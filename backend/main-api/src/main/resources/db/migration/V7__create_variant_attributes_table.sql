-- Create variant_attributes table to store variant attribute values
CREATE TABLE variant_attributes (
    id BIGSERIAL PRIMARY KEY,
    variant_id BIGINT NOT NULL,
    attribute_definition_id BIGINT NOT NULL,
    attribute_value VARCHAR(100) NOT NULL,

    CONSTRAINT fk_variant_attributes_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    CONSTRAINT fk_variant_attributes_definition FOREIGN KEY (attribute_definition_id) REFERENCES attribute_definitions(id) ON DELETE CASCADE,
    CONSTRAINT uq_variant_attributes_variant_definition UNIQUE (variant_id, attribute_definition_id)
);

-- Create indexes for performance
CREATE INDEX idx_variant_attributes_variant_id ON variant_attributes(variant_id);
CREATE INDEX idx_variant_attributes_definition_id ON variant_attributes(attribute_definition_id);

-- Add comments
COMMENT ON TABLE variant_attributes IS 'Table contenant les valeurs d''attributs pour chaque variant (ex: Rouge, XL)';
COMMENT ON COLUMN variant_attributes.id IS 'Identifiant unique de la valeur d''attribut';
COMMENT ON COLUMN variant_attributes.variant_id IS 'Identifiant du variant';
COMMENT ON COLUMN variant_attributes.attribute_definition_id IS 'Identifiant de la définition d''attribut';
COMMENT ON COLUMN variant_attributes.attribute_value IS 'Valeur de l''attribut pour ce variant';

