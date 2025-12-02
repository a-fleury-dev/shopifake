-- Seeds de développement pour les produits
-- Ajout de produits variés dans différentes catégories avec leurs attributs

-- ============================================================================
-- SHOP 1: Sport Elite - Produits
-- ============================================================================

-- Produits dans la catégorie "Vêtements > Running"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'vetements-running'),
    'T-shirt Running Pro',
    't-shirt-running-pro',
    'T-shirt technique respirant pour la course à pied. Tissu anti-transpiration avec technologie Dry-Fit. Coupe ergonomique pour un confort optimal.',
    true
),
(
    (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'vetements-running'),
    'Short Running Performance',
    'short-running-performance',
    'Short léger et confortable pour les entraînements intensifs. Poches zippées pour ranger vos clés. Séchage rapide et protection UV.',
    true
);

-- Produits dans la catégorie "Chaussures > Running"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'chaussures-running'),
    'Nike Air Zoom Pegasus',
    'nike-air-zoom-pegasus',
    'Chaussures de running polyvalentes avec amorti Air Zoom. Parfaites pour les sorties quotidiennes et les entraînements variés. Semelle durable et respirabilité optimale.',
    true
),
(
    (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'chaussures-running'),
    'Adidas Ultraboost DNA',
    'adidas-ultraboost-dna',
    'Chaussures de course avec technologie Boost pour un retour d''énergie maximal. Tige Primeknit pour un ajustement chaussette. Confort longue distance.',
    true
);

-- Produits dans la catégorie "Équipements > Fitness & Musculation"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 1 AND slug = 'equipements-fitness-musculation'),
    'Haltères Réglables',
    'halteres-reglables',
    'Set d''haltères réglables de 5 à 25kg. Gain de place et polyvalence pour tous vos exercices. Poignées ergonomiques antidérapantes.',
    true
);

-- ============================================================================
-- SHOP 2: Bijoux de Luxe - Produits
-- ============================================================================

-- Produits dans la catégorie "Bagues > Bagues de fiançailles"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bagues-fiancailles'),
    'Solitaire Éternité',
    'solitaire-eternite',
    'Bague de fiançailles avec diamant solitaire certifié. Serti 6 griffes en or blanc. Pureté exceptionnelle VVS1.',
    true
),
(
    (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bagues-fiancailles'),
    'Halo Prestige',
    'halo-prestige',
    'Bague halo avec diamant central entouré de diamants pavés. Design intemporel et élégant. Certifiée GIA.',
    true
);

-- Produits dans la catégorie "Colliers > Pendentifs"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'colliers-pendentifs'),
    'Pendentif Coeur Diamant',
    'pendentif-coeur-diamant',
    'Pendentif en forme de cœur serti de diamants. Chaîne vénitienne incluse. Symbole d''amour éternel.',
    true
);

-- Produits dans la catégorie "Bracelets > Bracelets tennis"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 2 AND slug = 'bracelets-tennis'),
    'Bracelet Tennis Diamants',
    'bracelet-tennis-diamants',
    'Bracelet tennis avec diamants taille brillant. Monture sertie clos pour plus de sécurité. Élégance intemporelle.',
    true
);

-- ============================================================================
-- SHOP 3: Tech & Informatique Pro - Produits
-- ============================================================================

-- Produits dans la catégorie "Ordinateurs > PC Portables"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'ordinateurs-portables'),
    'Dell XPS 15',
    'dell-xps-15',
    'Ultrabook premium avec écran InfinityEdge 4K. Performances exceptionnelles pour les créatifs et professionnels. Design aluminium élégant.',
    true
),
(
    (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'ordinateurs-portables'),
    'MacBook Pro',
    'macbook-pro',
    'MacBook Pro avec puce M3. Performance révolutionnaire et autonomie incroyable. Écran Retina XDR.',
    true
);

-- Produits dans la catégorie "Composants PC > Cartes graphiques"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'composants-cartes-graphiques'),
    'NVIDIA GeForce RTX 4080',
    'nvidia-rtx-4080',
    'Carte graphique haut de gamme avec architecture Ada Lovelace. Ray tracing en temps réel et DLSS 3. Parfaite pour le gaming 4K.',
    true
),
(
    (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'composants-cartes-graphiques'),
    'AMD Radeon RX 7900 XTX',
    'amd-rx-7900-xtx',
    'Carte graphique AMD RDNA 3. Performances gaming exceptionnelles. Technologies AMD FidelityFX.',
    true
);

-- Produits dans la catégorie "Périphériques"
INSERT INTO products (category_id, name, slug, description, is_active) VALUES
(
    (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'peripheriques'),
    'Clavier Mécanique RGB',
    'clavier-mecanique-rgb',
    'Clavier mécanique gaming avec switches Cherry MX. RGB personnalisable. Repose-poignet magnétique.',
    true
),
(
    (SELECT id FROM categories WHERE shop_id = 3 AND slug = 'peripheriques'),
    'Souris Gaming Pro',
    'souris-gaming-pro',
    'Souris gaming haute précision avec capteur optique 25000 DPI. 11 boutons programmables. Éclairage RGB.',
    true
);

-- Vérification
SELECT p.id, c.shop_id, p.name, p.slug, p.is_active
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY c.shop_id, p.id;

