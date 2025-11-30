-- Create categories table
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT NOT NULL,
    parent_id BIGINT,
    label VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_categories_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE RESTRICT,
    CONSTRAINT chk_categories_not_self_parent CHECK (parent_id IS NULL OR parent_id != id),
    CONSTRAINT uq_categories_shop_slug UNIQUE (shop_id, slug)
);

-- Create indexes for performance
CREATE INDEX idx_categories_shop_id ON categories(shop_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_shop_parent ON categories(shop_id, parent_id);
CREATE INDEX idx_categories_shop_slug ON categories(shop_id, slug);

-- Add comments on table
COMMENT ON TABLE categories IS 'Table contenant les catégories de produits organisées en hiérarchie';

-- Add comments on columns
COMMENT ON COLUMN categories.id IS 'Identifiant unique de la catégorie';
COMMENT ON COLUMN categories.shop_id IS 'Identifiant de la boutique à laquelle appartient la catégorie';
COMMENT ON COLUMN categories.parent_id IS 'Identifiant de la catégorie parente (NULL pour une catégorie racine)';
COMMENT ON COLUMN categories.label IS 'Libellé d''affichage de la catégorie';
COMMENT ON COLUMN categories.slug IS 'Slug URL unique pour la catégorie (au sein d''une boutique)';
COMMENT ON COLUMN categories.position IS 'Position pour l''ordre d''affichage';
COMMENT ON COLUMN categories.created_at IS 'Date de création de la catégorie';
COMMENT ON COLUMN categories.updated_at IS 'Date de dernière mise à jour de la catégorie';

