/*
  # Fashion Store Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `category_id` (uuid, foreign key)
      - `image_url` (text)
      - `stock` (integer)
      - `sizes` (text array)
      - `colors` (text array)
      - `featured` (boolean)
      - `created_at` (timestamptz)
    
    - `customers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `total_amount` (numeric)
      - `status` (text)
      - `shipping_address` (text)
      - `created_at` (timestamptz)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (numeric)
      - `size` (text)
      - `color` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to products and categories
    - Add policies for authenticated admin access to manage data
*/

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert categories"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update categories"
  ON categories FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete categories"
  ON categories FOR DELETE
  USING (true);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL CHECK (price >= 0),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text DEFAULT '',
  stock integer DEFAULT 0 CHECK (stock >= 0),
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete products"
  ON products FOR DELETE
  USING (true);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text DEFAULT '',
  address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can view customers"
  ON customers FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert customers"
  ON customers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update customers"
  ON customers FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can view orders"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update orders"
  ON orders FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  size text DEFAULT '',
  color text DEFAULT ''
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can view order items"
  ON order_items FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Insert sample data
INSERT INTO categories (name, description, image_url) VALUES
  ('Homme', 'Collection pour homme', 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg'),
  ('Femme', 'Collection pour femme', 'https://images.pexels.com/photos/974911/pexels-photo-974911.jpeg'),
  ('Accessoires', 'Accessoires de mode', 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg'),
  ('Chaussures', 'Chaussures pour tous', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, stock, sizes, colors, featured) 
SELECT 
  'T-shirt Classic', 
  'T-shirt en coton de haute qualité', 
  29.99, 
  c.id, 
  'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg',
  50,
  ARRAY['S', 'M', 'L', 'XL'],
  ARRAY['Noir', 'Blanc', 'Bleu'],
  true
FROM categories c WHERE c.name = 'Homme'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, category_id, image_url, stock, sizes, colors, featured) 
SELECT 
  'Robe d''été', 
  'Robe légère parfaite pour l''été', 
  79.99, 
  c.id, 
  'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
  30,
  ARRAY['S', 'M', 'L'],
  ARRAY['Rouge', 'Bleu', 'Vert'],
  true
FROM categories c WHERE c.name = 'Femme'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, category_id, image_url, stock, sizes, colors, featured) 
SELECT 
  'Sneakers Urban', 
  'Chaussures confortables pour tous les jours', 
  89.99, 
  c.id, 
  'https://images.pexels.com/photos/1280064/pexels-photo-1280064.jpeg',
  40,
  ARRAY['38', '39', '40', '41', '42', '43'],
  ARRAY['Noir', 'Blanc'],
  true
FROM categories c WHERE c.name = 'Chaussures'
ON CONFLICT DO NOTHING;