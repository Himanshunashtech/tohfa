import { motion } from "framer-motion";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`}></div>
);

export const ProductSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="aspect-[4/5] rounded-3xl" />
    <div className="space-y-2">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
    {[...Array(count)].map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="container mx-auto max-w-6xl px-6 pt-24 pb-16">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      <Skeleton className="aspect-square rounded-2xl" />
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-3/4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
        <div className="pt-8 border-t border-border grid grid-cols-3 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const AccountSkeleton = () => (
  <div className="container mx-auto max-w-6xl px-6 pt-32 pb-20">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 space-y-4">
        <Skeleton className="h-24 w-full rounded-3xl" />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-2xl" />
        ))}
      </div>
      <div className="flex-1">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    </div>
  </div>
);
