-- Create shops table
CREATE TABLE shops (
    id BIGSERIAL PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    domain_name VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    banner_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index on admin_id for faster queries
CREATE INDEX idx_shops_admin_id ON shops(admin_id);

-- Create index on domain_name for faster lookups
CREATE INDEX idx_shops_domain_name ON shops(domain_name);

-- Add comment on table
COMMENT ON TABLE shops IS 'Table contenant les informations des boutiques';

-- Add comments on columns
COMMENT ON COLUMN shops.id IS 'Identifiant unique de la boutique';
COMMENT ON COLUMN shops.admin_id IS 'Identifiant de l''administrateur de la boutique';
COMMENT ON COLUMN shops.domain_name IS 'Nom de domaine unique de la boutique';
COMMENT ON COLUMN shops.name IS 'Nom d''affichage de la boutique';
COMMENT ON COLUMN shops.description IS 'Description de la boutique';
COMMENT ON COLUMN shops.banner_url IS 'URL de l''image de bannière de la boutique';
COMMENT ON COLUMN shops.created_at IS 'Date de création de la boutique';
COMMENT ON COLUMN shops.updated_at IS 'Date de dernière mise à jour de la boutique';

