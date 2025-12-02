-- Seeds de développement pour les catégories
-- Organisation hiérarchique pour chaque boutique

-- ============================================================================
-- SHOP 1: Sport Elite (sport-elite.shopifake.com)
-- ============================================================================

-- Catégories racines
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(1, NULL, 'Vêtements', 'vetements', 1),
(1, NULL, 'Chaussures', 'chaussures', 2),
(1, NULL, 'Équipements', 'equipements', 3),
(1, NULL, 'Accessoires', 'accessoires', 4);

-- Sous-catégories de Vêtements
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'vetements'), 'Running', 'vetements-running', 1),
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'vetements'), 'Fitness', 'vetements-fitness', 2),
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'vetements'), 'Sports collectifs', 'vetements-sports-collectifs', 3),
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'vetements'), 'Outdoor', 'vetements-outdoor', 4);

-- Sous-catégories de Chaussures
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'chaussures'), 'Running', 'chaussures-running', 1),
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'chaussures'), 'Training', 'chaussures-training', 2),
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'chaussures'), 'Football', 'chaussures-football', 3),
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'chaussures'), 'Basketball', 'chaussures-basketball', 4);

-- Sous-catégories de Équipements
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'equipements'), 'Fitness & Musculation', 'equipements-fitness-musculation', 1),
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'equipements'), 'Cardio', 'equipements-cardio', 2),
(1, (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'equipements'), 'Ballons & Raquettes', 'equipements-ballons-raquettes', 3);


-- ============================================================================
-- SHOP 2: Bijoux de Luxe (bijoux-luxe.shopifake.com)
-- ============================================================================

-- Catégories racines
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(2, NULL, 'Bagues', 'bagues', 1),
(2, NULL, 'Colliers', 'colliers', 2),
(2, NULL, 'Bracelets', 'bracelets', 3),
(2, NULL, 'Boucles d''oreilles', 'boucles-oreilles', 4),
(2, NULL, 'Montres', 'montres', 5);

-- Sous-catégories de Bagues
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bagues'), 'Bagues de fiançailles', 'bagues-fiancailles', 1),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bagues'), 'Alliances', 'bagues-alliances', 2),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bagues'), 'Bagues solitaires', 'bagues-solitaires', 3),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bagues'), 'Bagues fantaisie', 'bagues-fantaisie', 4);

-- Sous-catégories de Colliers
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'colliers'), 'Pendentifs', 'colliers-pendentifs', 1),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'colliers'), 'Chaînes', 'colliers-chaines', 2),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'colliers'), 'Sautoirs', 'colliers-sautoirs', 3),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'colliers'), 'Ras de cou', 'colliers-ras-de-cou', 4);

-- Sous-catégories de Bracelets
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bracelets'), 'Bracelets rigides', 'bracelets-rigides', 1),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bracelets'), 'Bracelets chaînes', 'bracelets-chaines', 2),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bracelets'), 'Bracelets tennis', 'bracelets-tennis', 3);

-- Sous-catégories de Boucles d'oreilles
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'boucles-oreilles'), 'Puces', 'boucles-oreilles-puces', 1),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'boucles-oreilles'), 'Créoles', 'boucles-oreilles-creoles', 2),
(2, (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'boucles-oreilles'), 'Pendantes', 'boucles-oreilles-pendantes', 3);


-- ============================================================================
-- SHOP 3: Tech & Informatique Pro (tech-informatique.shopifake.com)
-- ============================================================================

-- Catégories racines
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(3, NULL, 'Ordinateurs', 'ordinateurs', 1),
(3, NULL, 'Composants PC', 'composants-pc', 2),
(3, NULL, 'Périphériques', 'peripheriques', 3),
(3, NULL, 'Gaming', 'gaming', 4),
(3, NULL, 'Stockage', 'stockage', 5);

-- Sous-catégories de Ordinateurs
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'ordinateurs'), 'PC Portables', 'ordinateurs-portables', 1),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'ordinateurs'), 'PC Bureau', 'ordinateurs-bureau', 2),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'ordinateurs'), 'Ultrabooks', 'ordinateurs-ultrabooks', 3),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'ordinateurs'), 'Workstations', 'ordinateurs-workstations', 4);

-- Sous-catégories de Composants PC
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'composants-pc'), 'Processeurs', 'composants-processeurs', 1),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'composants-pc'), 'Cartes graphiques', 'composants-cartes-graphiques', 2),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'composants-pc'), 'Cartes mères', 'composants-cartes-meres', 3),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'composants-pc'), 'Mémoire RAM', 'composants-memoire-ram', 4),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'composants-pc'), 'Alimentations', 'composants-alimentations', 5);

-- Sous-catégories de Périphériques
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'peripheriques'), 'Claviers', 'peripheriques-claviers', 1),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'peripheriques'), 'Souris', 'peripheriques-souris', 2),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'peripheriques'), 'Écrans', 'peripheriques-ecrans', 3),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'peripheriques'), 'Casques audio', 'peripheriques-casques-audio', 4),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'peripheriques'), 'Webcams', 'peripheriques-webcams', 5);

-- Sous-catégories de Gaming
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'gaming'), 'PC Gaming', 'gaming-pc', 1),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'gaming'), 'Claviers Gaming', 'gaming-claviers', 2),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'gaming'), 'Souris Gaming', 'gaming-souris', 3),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'gaming'), 'Casques Gaming', 'gaming-casques', 4),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'gaming'), 'Fauteuils Gaming', 'gaming-fauteuils', 5);

-- Sous-sous-catégories de PC Gaming (exemple de profondeur 3)
INSERT INTO categories (shop_id, parent_id, label, slug, position) VALUES
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'gaming-pc'), 'Entrée de gamme', 'gaming-pc-entree-gamme', 1),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'gaming-pc'), 'Milieu de gamme', 'gaming-pc-milieu-gamme', 2),
(3, (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'gaming-pc'), 'Haut de gamme', 'gaming-pc-haut-gamme', 3);


-- Vérification des données insérées
SELECT
    c1.id,
    c1.shop_id,
    s.name as shop_name,
    c1.label as category,
    c2.label as parent_category,
    c1.slug,
    c1.position
FROM categories c1
LEFT JOIN categories c2 ON c1.parent_id = c2.id
LEFT JOIN shops s ON c1.shop_id = s.id
ORDER BY c1.shop_id, COALESCE(c2.position, c1.position), c1.position;

