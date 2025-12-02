-- Create attribute_definitions table to store product attributes structure
CREATE TABLE attribute_definitions (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    attribute_name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attribute_definitions_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT uq_attribute_definitions_product_name UNIQUE (product_id, attribute_name)
);

-- Create index for performance
CREATE INDEX idx_attribute_definitions_product_id ON attribute_definitions(product_id);

-- Add comments
COMMENT ON TABLE attribute_definitions IS 'Table contenant les définitions d''attributs pour les produits (ex: Couleur, Taille)';
COMMENT ON COLUMN attribute_definitions.id IS 'Identifiant unique de la définition d''attribut';
COMMENT ON COLUMN attribute_definitions.product_id IS 'Identifiant du produit auquel appartient cette définition';
COMMENT ON COLUMN attribute_definitions.attribute_name IS 'Nom de l''attribut (ex: Couleur, Taille, Capacité)';
COMMENT ON COLUMN attribute_definitions.position IS 'Position pour l''ordre d''affichage';

