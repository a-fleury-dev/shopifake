-- Supprimer l'index existant
DROP INDEX IF EXISTS idx_shops_admin_id;

-- Supprimer l'ancienne colonne
ALTER TABLE shops DROP COLUMN admin_id;

-- Recréer la colonne avec le bon type
ALTER TABLE shops ADD COLUMN admin_id UUID NOT NULL;

-- Recréer l'index
CREATE INDEX idx_shops_admin_id ON shops(admin_id);

-- Mettre à jour le commentaire
COMMENT ON COLUMN shops.admin_id IS 'UUID de l administrateur de la boutique';
