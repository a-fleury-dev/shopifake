CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id VARCHAR(255) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,

    product_id VARCHAR(255),
    variant_id VARCHAR(255),

    bucket_name VARCHAR(100) NOT NULL,
    object_key VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    size_bytes BIGINT,

    display_order INTEGER DEFAULT 0,

    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT chk_entity_type CHECK (entity_type IN ('STORE_BANNER', 'VARIANT_IMAGE', 'BLOG_IMAGE')),

    CONSTRAINT chk_banner_refs CHECK (
        entity_type != 'STORE_BANNER' OR (product_id IS NULL AND variant_id IS NULL)
    ),
    CONSTRAINT chk_blog_refs CHECK (
        entity_type != 'BLOG_IMAGE' OR (product_id IS NULL AND variant_id IS NULL)
    ),
    CONSTRAINT chk_variant_refs CHECK (
        entity_type != 'VARIANT_IMAGE' OR (variant_id IS NOT NULL AND product_id IS NOT NULL)
    )
);

CREATE INDEX idx_images_store_id ON images(store_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_images_variant_id_order ON images(variant_id, display_order) WHERE deleted_at IS NULL AND variant_id IS NOT NULL;
CREATE INDEX idx_images_entity_type ON images(entity_type, store_id) WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX idx_unique_active_banner ON images(store_id, entity_type)
    WHERE entity_type = 'STORE_BANNER' AND deleted_at IS NULL;

COMMENT ON TABLE images IS 'Table principale pour stocker les métadonnées de toutes les images du système';
COMMENT ON COLUMN images.entity_type IS 'Type d''entité: STORE_BANNER, VARIANT_IMAGE, ou BLOG_IMAGE';
COMMENT ON COLUMN images.display_order IS 'Ordre d''affichage pour les images de variantes (0 = image principale)';
COMMENT ON COLUMN images.deleted_at IS 'Soft delete: NULL = actif, non-NULL = supprimé';
