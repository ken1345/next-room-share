-- Fix Security Definer Warning for admin_block_logs
-- Sets security_invoker = true to respect RLS policies of the invoker

ALTER VIEW public.admin_block_logs SET (security_invoker = true);
