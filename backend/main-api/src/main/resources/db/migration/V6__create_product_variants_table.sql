-- Create product_variants table
CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_product_active ON product_variants(product_id, is_active);

-- Add comments
COMMENT ON TABLE product_variants IS 'Table contenant les variants de produits avec leurs attributs';
COMMENT ON COLUMN product_variants.id IS 'Identifiant unique du variant';
COMMENT ON COLUMN product_variants.product_id IS 'Identifiant du produit parent';
COMMENT ON COLUMN product_variants.sku IS 'Code SKU unique du variant';
COMMENT ON COLUMN product_variants.price IS 'Prix du variant';
COMMENT ON COLUMN product_variants.stock IS 'Quantité en stock';
COMMENT ON COLUMN product_variants.is_active IS 'Indique si le variant est actif/visible';

