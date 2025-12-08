-- Add shop_id to products table
ALTER TABLE products ADD COLUMN shop_id BIGINT;

-- Update existing products with shop_id from categories
UPDATE products p
SET shop_id = c.shop_id
FROM categories c
WHERE p.category_id = c.id;

-- Make shop_id NOT NULL after data migration
ALTER TABLE products ALTER COLUMN shop_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE products ADD CONSTRAINT fk_products_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX idx_products_shop_id ON products(shop_id);

-- Add comment
COMMENT ON COLUMN products.shop_id IS 'Identifiant de la boutique à laquelle appartient le produit';

-- Add shop_id to product_variants table
ALTER TABLE product_variants ADD COLUMN shop_id BIGINT;

-- Update existing product_variants with shop_id from products
UPDATE product_variants pv
SET shop_id = p.shop_id
FROM products p
WHERE pv.product_id = p.id;

-- Make shop_id NOT NULL after data migration
ALTER TABLE product_variants ALTER COLUMN shop_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE product_variants ADD CONSTRAINT fk_product_variants_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX idx_product_variants_shop_id ON product_variants(shop_id);

-- Add comment
COMMENT ON COLUMN product_variants.shop_id IS 'Identifiant de la boutique à laquelle appartient le variant';

