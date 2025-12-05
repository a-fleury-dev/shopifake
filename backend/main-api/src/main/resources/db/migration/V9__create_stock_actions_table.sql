-- Create stock_actions table
CREATE TABLE stock_actions (
    id BIGSERIAL PRIMARY KEY,
    variant_id BIGINT NOT NULL,
    sku VARCHAR(100) NOT NULL,
    action_type VARCHAR(10) NOT NULL CHECK (action_type IN ('ADD', 'REMOVE')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_stock_actions_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_stock_actions_variant_id ON stock_actions(variant_id);
CREATE INDEX idx_stock_actions_created_at ON stock_actions(created_at DESC);
CREATE INDEX idx_stock_actions_sku ON stock_actions(sku);

-- Add comments
COMMENT ON TABLE stock_actions IS 'Table contenant l''historique des actions de stock';
COMMENT ON COLUMN stock_actions.id IS 'Identifiant unique de l''action';
COMMENT ON COLUMN stock_actions.variant_id IS 'Identifiant du variant concerné';
COMMENT ON COLUMN stock_actions.sku IS 'SKU du variant concerné (dénormalisé pour faciliter l''affichage)';
COMMENT ON COLUMN stock_actions.action_type IS 'Type d''action : ADD (ajout) ou REMOVE (retrait)';
COMMENT ON COLUMN stock_actions.quantity IS 'Quantité ajoutée ou retirée';
COMMENT ON COLUMN stock_actions.created_at IS 'Date et heure de l''action';

