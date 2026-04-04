-- Robust Maintenance Mode Migration
-- Adding a dedicated, top-level boolean flag to the store_settings table.

ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS is_maintenance_mode BOOLEAN DEFAULT FALSE;

-- Initialize the column for the existing record (if any)
UPDATE public.store_settings SET is_maintenance_mode = FALSE WHERE is_maintenance_mode IS NULL;
