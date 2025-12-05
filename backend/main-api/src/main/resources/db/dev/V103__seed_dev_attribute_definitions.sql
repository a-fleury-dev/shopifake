-- Seeds de développement pour les définitions d'attributs des produits

-- ============================================================================
-- SHOP 1: Sport Elite - Définitions d'attributs
-- ============================================================================

-- T-shirt Running Pro: Taille et Couleur
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 't-shirt-running-pro'),
    'Taille',
    1
),
(
    (SELECT id FROM products WHERE slug = 't-shirt-running-pro'),
    'Couleur',
    2
);

-- Short Running Performance: Taille et Couleur
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'short-running-performance'),
    'Taille',
    1
),
(
    (SELECT id FROM products WHERE slug = 'short-running-performance'),
    'Couleur',
    2
);

-- Nike Air Zoom Pegasus: Pointure et Couleur
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'nike-air-zoom-pegasus'),
    'Pointure',
    1
),
(
    (SELECT id FROM products WHERE slug = 'nike-air-zoom-pegasus'),
    'Couleur',
    2
);

-- Adidas Ultraboost DNA: Pointure et Couleur
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'adidas-ultraboost-dna'),
    'Pointure',
    1
),
(
    (SELECT id FROM products WHERE slug = 'adidas-ultraboost-dna'),
    'Couleur',
    2
);

-- Haltères Réglables: Poids
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'halteres-reglables'),
    'Poids max',
    1
);

-- ============================================================================
-- SHOP 2: Bijoux de Luxe - Définitions d'attributs
-- ============================================================================

-- Solitaire Éternité: Matériau et Taille de bague
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'solitaire-eternite'),
    'Matériau',
    1
),
(
    (SELECT id FROM products WHERE slug = 'solitaire-eternite'),
    'Taille de bague',
    2
),
(
    (SELECT id FROM products WHERE slug = 'solitaire-eternite'),
    'Carats',
    3
);

-- Halo Prestige: Matériau et Taille de bague
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'halo-prestige'),
    'Matériau',
    1
),
(
    (SELECT id FROM products WHERE slug = 'halo-prestige'),
    'Taille de bague',
    2
),
(
    (SELECT id FROM products WHERE slug = 'halo-prestige'),
    'Carats',
    3
);

-- Pendentif Coeur Diamant: Matériau et Longueur chaîne
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'pendentif-coeur-diamant'),
    'Matériau',
    1
),
(
    (SELECT id FROM products WHERE slug = 'pendentif-coeur-diamant'),
    'Longueur chaîne',
    2
);

-- Bracelet Tennis Diamants: Matériau et Longueur
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'bracelet-tennis-diamants'),
    'Matériau',
    1
),
(
    (SELECT id FROM products WHERE slug = 'bracelet-tennis-diamants'),
    'Longueur',
    2
);

-- ============================================================================
-- SHOP 3: Tech & Informatique Pro - Définitions d'attributs
-- ============================================================================

-- Dell XPS 15: Processeur, RAM, Stockage
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'dell-xps-15'),
    'Processeur',
    1
),
(
    (SELECT id FROM products WHERE slug = 'dell-xps-15'),
    'RAM',
    2
),
(
    (SELECT id FROM products WHERE slug = 'dell-xps-15'),
    'Stockage',
    3
);

-- MacBook Pro: Puce, RAM, Stockage
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'macbook-pro'),
    'Puce',
    1
),
(
    (SELECT id FROM products WHERE slug = 'macbook-pro'),
    'RAM',
    2
),
(
    (SELECT id FROM products WHERE slug = 'macbook-pro'),
    'Stockage',
    3
);

-- NVIDIA GeForce RTX 4080: Mémoire VRAM
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'nvidia-rtx-4080'),
    'Mémoire VRAM',
    1
);

-- AMD Radeon RX 7900 XTX: Mémoire VRAM
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'amd-rx-7900-xtx'),
    'Mémoire VRAM',
    1
);

-- Clavier Mécanique RGB: Type de switches et Layout
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'clavier-mecanique-rgb'),
    'Type de switches',
    1
),
(
    (SELECT id FROM products WHERE slug = 'clavier-mecanique-rgb'),
    'Layout',
    2
);

-- Souris Gaming Pro: Couleur
INSERT INTO attribute_definitions (product_id, attribute_name, position) VALUES
(
    (SELECT id FROM products WHERE slug = 'souris-gaming-pro'),
    'Couleur',
    1
);

-- Vérification
SELECT p.name, ad.attribute_name, ad.position
FROM attribute_definitions ad
JOIN products p ON ad.product_id = p.id
ORDER BY p.id, ad.position;

