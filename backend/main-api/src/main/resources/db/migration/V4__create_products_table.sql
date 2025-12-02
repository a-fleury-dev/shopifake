-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT uq_products_category_slug UNIQUE (category_id, slug)
);

-- Create indexes for performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_category_active ON products(category_id, is_active);

-- Add comments on table
COMMENT ON TABLE products IS 'Table contenant les produits de chaque boutique';

-- Add comments on columns
COMMENT ON COLUMN products.id IS 'Identifiant unique du produit';
COMMENT ON COLUMN products.category_id IS 'Identifiant de la catégorie à laquelle appartient le produit';
COMMENT ON COLUMN products.name IS 'Nom du produit';
COMMENT ON COLUMN products.slug IS 'Slug URL unique pour le produit (au sein d''une catégorie)';
COMMENT ON COLUMN products.description IS 'Description détaillée du produit';
COMMENT ON COLUMN products.is_active IS 'Indique si le produit est actif/visible';
COMMENT ON COLUMN products.created_at IS 'Date de création du produit';
COMMENT ON COLUMN products.updated_at IS 'Date de dernière mise à jour du produit';

