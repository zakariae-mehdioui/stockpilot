/*
# Inventory Management Schema

## Overview
Creates the core tables for a cloud-native inventory management dashboard:
products and orders. Single-tenant demo dataset accessible by the anon-key
frontend client.

## New Tables

### products
- id, name, sku (unique), category, price, cost, stock, description,
  image_url, status (active/out_of_stock/discontinued), created_at, updated_at

### orders
- id, order_number (unique), customer_name, customer_email, status
  (pending/processing/shipped/delivered/cancelled), total, items_count,
  created_at, updated_at

## Security
- RLS enabled on both tables.
- Anon + authenticated CRUD (demo/shared data).
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE NOT NULL,
  category text NOT NULL,
  price numeric(12,2) NOT NULL DEFAULT 0,
  cost numeric(12,2) NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  status text NOT NULL DEFAULT 'pending',
  total numeric(12,2) NOT NULL DEFAULT 0,
  items_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);
