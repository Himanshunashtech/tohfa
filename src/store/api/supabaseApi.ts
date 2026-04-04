import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export const supabaseApi = createApi({
  reducerPath: 'supabaseApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Products', 'Orders', 'Artisans', 'Categories', 'Profiles', 'Portals', 'Reviews', 'Cart', 'Wishlist', 'CMS', 'Settings', 'Shipping', 'Addresses', 'Payments', 'Tickets', 'Returns', 'Collections'],
  endpoints: (builder) => ({
    // PRODUCTS
    getProducts: builder.query<any[], void>({
      queryFn: async () => {
        // Fetch products with their artisans
        const { data, error } = await supabase.from('products').select('*, artisan:artisans(*)').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Products'],
    }),
    getProductBySlug: builder.query<Database['public']['Tables']['products']['Row'], string>({
      queryFn: async (slug) => {
        const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (error) return { error };
        return { data };
      },
      providesTags: (result, error, slug) => [{ type: 'Products', id: slug }],
    }),
    updateProduct: builder.mutation<null, Partial<Database['public']['Tables']['products']['Update']> & { id: string }>({
      queryFn: async ({ id, ...patch }) => {
        // Perform update and request the updated record back to verify matching
        const { data, error } = await supabase.from('products').update(patch).eq('id', id).select();
        
        if (error) return { error };
        
        if (!data || data.length === 0) {
          return { 
            error: { 
              status: 404, 
              statusText: "Not Found", 
              data: `No product found with ID: ${id}. Update failed.` 
            } 
          };
        }
        
        return { data: null };
      },
      invalidatesTags: (result, error, { id }) => ['Products'],
    }),

    // CATEGORIES
    getCategories: builder.query<Database['public']['Tables']['categories']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Categories'],
    }),

    // ARTISANS
    getArtisans: builder.query<Database['public']['Tables']['artisans']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('artisans').select('*').order('name');
        if (error) return { error };
        return { data };
      },
      providesTags: ['Artisans'],
    }),

    // ORDERS (Polled for Admin)
    getOrders: builder.query<any[], void>({
      queryFn: async () => {
        // Fetch orders with their items
        const { data, error } = await supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Orders'],
    }),
    updateOrder: builder.mutation<null, { id: string } & Database['public']['Tables']['orders']['Update']>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('orders').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Orders'],
    }),

    // PORTALS
    getPortals: builder.query<Database['public']['Tables']['portals']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('portals').select('*');
        if (error) return { error };
        return { data };
      },
      providesTags: ['Portals'],
    }),

    // PROFILES & CUSTOMERS
    getProfile: builder.query<any, string>({
      queryFn: async (userId) => {
        try {
          const [profileRes, addressesRes, paymentsRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle(),
            supabase.from('addresses').select('*').eq('user_id', userId),
            supabase.from('payment_methods').select('*').eq('user_id', userId)
          ]);

          if (profileRes.error) return { error: profileRes.error };
          if (addressesRes.error) return { error: addressesRes.error };
          if (paymentsRes.error) return { error: paymentsRes.error };

          return { 
            data: { 
              ...(profileRes.data || { user_id: userId }), 
              addresses: addressesRes.data || [], 
              payment_methods: paymentsRes.data || [] 
            } 
          };
        } catch (err: any) {
          return { error: err };
        }
      },
      providesTags: ['Profiles', 'Addresses', 'Payments'],
    }),
    createProfile: builder.mutation<null, Database['public']['Tables']['profiles']['Insert']>({
      queryFn: async (profile) => {
        const { error } = await supabase.from('profiles').insert(profile);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Profiles'],
    }),
    updateProfile: builder.mutation<null, { id: string } & Database['public']['Tables']['profiles']['Update']>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('profiles').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Profiles'],
    }),

    // INVENTORY LOGS
    getInventoryLogs: builder.query<Database['public']['Tables']['inventory_logs']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('inventory_logs').select('*').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Products'], // Invalidate when products change or logs are added
    }),

    // CUSTOMERS (Profiles with order stats)
    getCustomers: builder.query<Database['public']['Tables']['profiles']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Profiles'],
    }),
    // POINTS HISTORY
    getPointsHistory: builder.query<any[], string>({
      queryFn: async (profileId) => {
        const { data, error } = await supabase.from('points_history').select('*').eq('profile_id', profileId).order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: (result, error, id) => [{ type: 'Profiles', id }],
    }),

    // REVIEWS
    getReviews: builder.query<Database['public']['Tables']['reviews']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Reviews'],
    }),
    deleteReview: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Reviews'],
    }),
    updateReview: builder.mutation<null, { id: string } & Database['public']['Tables']['reviews']['Update']>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('reviews').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Reviews'],
    }),

    // PROMOS & CAMPAIGNS
    getPromos: builder.query<Database['public']['Tables']['promos']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('promos').select('*').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Products'],
    }),
    createPromo: builder.mutation<null, Database['public']['Tables']['promos']['Insert']>({
      queryFn: async (promo) => {
        const { error } = await supabase.from('promos').insert(promo);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Products'],
    }),
    deletePromo: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('promos').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Products'],
    }),
    getCampaigns: builder.query<Database['public']['Tables']['campaigns']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Orders'],
    }),
    updateCampaign: builder.mutation<null, { id: string, active: boolean }>({
      queryFn: async ({ id, active }) => {
        const { error } = await supabase.from('campaigns').update({ active }).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Orders'],
    }),
    createCampaign: builder.mutation<null, Database['public']['Tables']['campaigns']['Insert']>({
      queryFn: async (campaign) => {
        const { error } = await supabase.from('campaigns').insert(campaign);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Orders'],
    }),

    // SETTINGS
    getStoreSettings: builder.query<Database['public']['Tables']['store_settings']['Row'] | null, void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('store_settings').select('*').limit(1);
        if (error) {
          console.error("[API Error] Failed to fetch settings:", error);
          return { error };
        }
        return { data: data && data.length > 0 ? data[0] : null };
      },
      providesTags: ['Profiles'],
    }),
    updateStoreSettings: builder.mutation<null, Partial<Database['public']['Tables']['store_settings']['Insert']>>({
      queryFn: async (patch) => {
        console.log("[API Update] Persisting Maintenance Status:", patch);
        const { error } = await supabase.from('store_settings').upsert(patch);
        if (error) {
          console.error("[API Error] Failed to persist settings:", error);
          return { error };
        }
        return { data: null };
      },
      invalidatesTags: ['Profiles'],
    }),
    getLoyaltySettings: builder.query<Database['public']['Tables']['loyalty_settings']['Row'], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('loyalty_settings').select('*').limit(1).single();
        if (error) return { error };
        return { data };
      },
      providesTags: ['Profiles'],
    }),
    updateLoyaltySettings: builder.mutation<null, Database['public']['Tables']['loyalty_settings']['Update']>({
      queryFn: async (patch) => {
        const { error } = await supabase.from('loyalty_settings').update(patch).neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy check to update the single record
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Profiles'],
    }),

    // TIMELINE
    getOrderTimeline: builder.query<Database['public']['Tables']['order_timeline']['Row'][], string>({
      queryFn: async (orderId) => {
        const { data, error } = await supabase.from('order_timeline').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
        if (error) return { error };
        return { data };
      },
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    addOrderMilestone: builder.mutation<null, Database['public']['Tables']['order_timeline']['Insert']>({
      queryFn: async (milestone) => {
        const { error } = await supabase.from('order_timeline').insert(milestone);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: (result, error, { order_id }) => [{ type: 'Orders', id: order_id }],
    }),

    // ADMIN ACTIONS (RPCs)
    awardPoints: builder.mutation<null, { email: string, points: number, reason: string }>({
      queryFn: async ({ email, points, reason }) => {
        const { error } = await (supabase as any).rpc('award_loyalty_points', { p_email: email, p_points: points, p_reason: reason });
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Profiles'],
    }),
    syncArtisanInventory: builder.mutation<number, void>({
      queryFn: async () => {
        const { data, error } = await (supabase as any).rpc('sync_artisan_inventory');
        if (error) return { error };
        return { data: (data as any)?.[0]?.synchronized_count || 0 };
      },
      invalidatesTags: ['Products'],
    }),
    addProductWithLog: builder.mutation<string, any>({
      queryFn: async (product) => {
        const { data, error } = await (supabase as any).rpc('add_product_with_log', { p_product: product });
        if (error) return { error };
        return { data: data as string };
      },
      invalidatesTags: ['Products'],
    }),

    // ADDITIONAL CRUD
    moveToTrash: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('products').update({ active: false }).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Products'],
    }),
    restoreProduct: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('products').update({ active: true }).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Products'],
    }),
    permanentlyDeleteProduct: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Products'],
    }),
    createReview: builder.mutation<null, any>({
      queryFn: async (review) => {
        const { error } = await supabase.from('reviews').insert(review);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Reviews'],
    }),

    // PORTALS
    createPortal: builder.mutation<null, any>({
      queryFn: async (portal) => {
        const { error } = await supabase.from('portals').insert(portal);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Orders'],
    }),
    updatePortal: builder.mutation<null, { id: string, patch: any }>({
      queryFn: async ({ id, patch }) => {
        const { error } = await supabase.from('portals').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Orders'],
    }),
    deletePortal: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('portals').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Orders'],
    }),

    // ARTISANS
    createArtisan: builder.mutation<null, any>({
      queryFn: async (artisan) => {
        const { error } = await supabase.from('artisans').insert(artisan);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Products'],
    }),
    updateArtisan: builder.mutation<null, { id: string, patch: any }>({
      queryFn: async ({ id, patch }) => {
        const { error } = await supabase.from('artisans').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Products'],
    }),
    deleteArtisan: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('artisans').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Products'],
    }),

    // CMS (Site Content)
    getSiteContent: builder.query<any[], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('site_content').select('*');
        if (error) return { error };
        return { data };
      },
      providesTags: ['CMS'],
    }),
    updateSiteContent: builder.mutation<null, { section_key: string, content: any }>({
      queryFn: async ({ section_key, content }) => {
        const { error } = await supabase.from('site_content').update({ content, updated_at: new Date().toISOString() }).eq('section_key', section_key);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['CMS'],
    }),

    // SHIPPING METHODS
    getShippingMethods: builder.query<any[], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('shipping_methods').select('*').order('name');
        if (error) return { error };
        return { data };
      },
      providesTags: ['Shipping'],
    }),
    updateShippingMethod: builder.mutation<null, { id: string } & any>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('shipping_methods').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Shipping'],
    }),
    createShippingMethod: builder.mutation<null, any>({
      queryFn: async (method) => {
        const { error } = await supabase.from('shipping_methods').insert(method);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Shipping'],
    }),
    deleteShippingMethod: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('shipping_methods').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Shipping'],
    }),
    createOrder: builder.mutation<string, { order: any, items: any[] }>({
      queryFn: async ({ order, items }) => {
        const { data, error } = await (supabase as any).rpc('create_order', { p_order: order, p_items: items });
        if (error) return { error };
        return { data: data as string };
      },
      invalidatesTags: ['Orders', 'Profiles'],
    }),

    // ADDRESSES
    createAddress: builder.mutation<null, Database['public']['Tables']['addresses']['Insert']>({
      queryFn: async (address) => {
        const { error } = await supabase.from('addresses').insert(address);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Addresses', 'Profiles'],
    }),
    updateAddress: builder.mutation<null, { id: string } & Database['public']['Tables']['addresses']['Update']>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('addresses').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Addresses', 'Profiles'],
    }),
    deleteAddress: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('addresses').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Addresses', 'Profiles'],
    }),

    // PAYMENT METHODS
    createPaymentMethod: builder.mutation<null, Database['public']['Tables']['payment_methods']['Insert']>({
      queryFn: async (payment) => {
        const { error } = await supabase.from('payment_methods').insert(payment);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Payments', 'Profiles'],
    }),
    updatePaymentMethod: builder.mutation<null, { id: string } & Database['public']['Tables']['payment_methods']['Update']>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('payment_methods').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Payments', 'Profiles'],
    }),
    deletePaymentMethod: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('payment_methods').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Payments', 'Profiles'],
    }),

    // SUPPORT TICKETS
    getSupportTickets: builder.query<Database['public']['Tables']['support_tickets']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Tickets'],
    }),
    createSupportTicket: builder.mutation<null, Database['public']['Tables']['support_tickets']['Insert']>({
      queryFn: async (ticket) => {
        const { error } = await supabase.from('support_tickets').insert(ticket);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Tickets'],
    }),
    updateSupportTicket: builder.mutation<null, { id: string } & Database['public']['Tables']['support_tickets']['Update']>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('support_tickets').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Tickets'],
    }),

    // ORDER RETURNS
    getOrderReturns: builder.query<Database['public']['Tables']['order_returns']['Row'][], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('order_returns').select('*').order('created_at', { ascending: false });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Returns'],
    }),
    createOrderReturn: builder.mutation<null, Database['public']['Tables']['order_returns']['Insert']>({
      queryFn: async (returnRequest) => {
        const { error } = await supabase.from('order_returns').insert(returnRequest);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Returns'],
    }),
    updateOrderReturn: builder.mutation<null, { id: string } & Database['public']['Tables']['order_returns']['Update']>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('order_returns').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Returns'],
    }),
    
    // COLLECTIONS
    getCollections: builder.query<any[], void>({
      queryFn: async () => {
        const { data, error } = await supabase.from('collections').select('*, products:collection_products(product_id, products(*))').order('name', { ascending: true });
        if (error) return { error };
        return { data };
      },
      providesTags: ['Collections'],
    }),
    getCollectionBySlug: builder.query<any, string>({
      queryFn: async (slug) => {
        const { data, error } = await supabase.from('collections').select('*, products:collection_products(product_id, products(*))').ilike('slug', slug).single();
        if (error) return { error };
        return { data };
      },
      providesTags: (result, error, slug) => [{ type: 'Collections', id: slug }],
    }),
    createCollection: builder.mutation<null, any>({
      queryFn: async (collection) => {
        const { error } = await supabase.from('collections').insert(collection);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Collections'],
    }),
    updateCollection: builder.mutation<null, { id: string } & any>({
      queryFn: async ({ id, ...patch }) => {
        const { error } = await supabase.from('collections').update(patch).eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Collections'],
    }),
    deleteCollection: builder.mutation<null, string>({
      queryFn: async (id) => {
        const { error } = await supabase.from('collections').delete().eq('id', id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Collections'],
    }),
    addProductToCollection: builder.mutation<null, { collection_id: string, product_id: string }>({
      queryFn: async ({ collection_id, product_id }) => {
        const { error } = await supabase.from('collection_products').insert({ collection_id, product_id });
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Collections'],
    }),
    removeProductFromCollection: builder.mutation<null, { collection_id: string, product_id: string }>({
      queryFn: async ({ collection_id, product_id }) => {
        const { error } = await supabase.from('collection_products').delete().eq('collection_id', collection_id).eq('product_id', product_id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Collections'],
    }),
    updateCollectionProductOrder: builder.mutation<null, { collection_id: string, product_id: string, sort_order: number }>({
      queryFn: async ({ collection_id, product_id, sort_order }) => {
        const { error } = await supabase.from('collection_products').update({ sort_order }).eq('collection_id', collection_id).eq('product_id', product_id);
        if (error) return { error };
        return { data: null };
      },
      invalidatesTags: ['Collections'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useUpdateProductMutation,
  useGetCategoriesQuery,
  useGetArtisansQuery,
  useGetOrdersQuery,
  useUpdateOrderMutation,
  useGetPortalsQuery,
  useGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useGetInventoryLogsQuery,
  useGetCustomersQuery,
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
  useCreateReviewMutation,
  useGetPromosQuery,
  useCreatePromoMutation,
  useDeletePromoMutation,
  useGetCampaignsQuery,
  useUpdateCampaignMutation,
  useCreateCampaignMutation,
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
  useGetLoyaltySettingsQuery,
  useUpdateLoyaltySettingsMutation,
  useGetOrderTimelineQuery,
  useAddOrderMilestoneMutation,
  useAwardPointsMutation,
  useSyncArtisanInventoryMutation,
  useAddProductWithLogMutation,
  useMoveToTrashMutation,
  useRestoreProductMutation,
  usePermanentlyDeleteProductMutation,
  useCreatePortalMutation,
  useUpdatePortalMutation,
  useDeletePortalMutation,
  useCreateArtisanMutation,
  useUpdateArtisanMutation,
  useDeleteArtisanMutation,
  useGetSiteContentQuery,
  useUpdateSiteContentMutation,
  useGetShippingMethodsQuery,
  useUpdateShippingMethodMutation,
  useCreateShippingMethodMutation,
  useDeleteShippingMethodMutation,
  useGetPointsHistoryQuery,
  useLazyGetPointsHistoryQuery,
  useCreateOrderMutation,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useGetSupportTicketsQuery,
  useCreateSupportTicketMutation,
  useUpdateSupportTicketMutation,
  useGetOrderReturnsQuery,
  useCreateOrderReturnMutation,
  useUpdateOrderReturnMutation,
  useGetCollectionsQuery,
  useGetCollectionBySlugQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
  useAddProductToCollectionMutation,
  useRemoveProductFromCollectionMutation,
  useUpdateCollectionProductOrderMutation,
} = supabaseApi;
