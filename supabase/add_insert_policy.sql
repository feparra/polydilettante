-- ==============================================================================
-- POLYDILETTANTE RLS INGESTION POLICIES
-- Ejecutar en Supabase SQL Editor para permitir la inserción de nuevos nodos
-- ==============================================================================

-- 1. Permitir a roles anon y authenticated insertar nuevos nodos de conocimiento
create policy "Allow insert on nodes"
  on public.nodes
  for insert
  to anon, authenticated
  with check (true);

-- 2. Permitir actualizar nodos existentes en caso de conflicto (upsert)
create policy "Allow update on nodes"
  on public.nodes
  for update
  to anon, authenticated
  using (true)
  with check (true);
