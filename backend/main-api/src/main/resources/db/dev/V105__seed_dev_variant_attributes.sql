-- Seeds de développement pour les attributs des variants
-- Création des combinaisons d'attributs pour chaque variant

-- ============================================================================
-- SHOP 1: Sport Elite - Attributs de variants
-- ============================================================================

-- T-shirt Running Pro: Variants avec Taille et Couleur
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Taille' AND pv.sku LIKE '%-S-%' THEN 'S'
        WHEN ad.attribute_name = 'Taille' AND pv.sku LIKE '%-M-%' THEN 'M'
        WHEN ad.attribute_name = 'Taille' AND pv.sku LIKE '%-L-%' THEN 'L'
        WHEN ad.attribute_name = 'Couleur' AND pv.sku LIKE '%-BLK' THEN 'Noir'
        WHEN ad.attribute_name = 'Couleur' AND pv.sku LIKE '%-BLU' THEN 'Bleu'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 't-shirt-running-pro';

-- Short Running Performance: Variants avec Taille et Couleur
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Taille' AND pv.sku LIKE '%-S-%' THEN 'S'
        WHEN ad.attribute_name = 'Taille' AND pv.sku LIKE '%-M-%' THEN 'M'
        WHEN ad.attribute_name = 'Taille' AND pv.sku LIKE '%-L-%' THEN 'L'
        WHEN ad.attribute_name = 'Couleur' AND pv.sku LIKE '%-BLK' THEN 'Noir'
        WHEN ad.attribute_name = 'Couleur' AND pv.sku LIKE '%-GRY' THEN 'Gris'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'short-running-performance';

-- Nike Air Zoom Pegasus: Variants avec Pointure et Couleur
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Pointure' AND pv.sku LIKE '%-41-%' THEN '41'
        WHEN ad.attribute_name = 'Pointure' AND pv.sku LIKE '%-42-%' THEN '42'
        WHEN ad.attribute_name = 'Pointure' AND pv.sku LIKE '%-43-%' THEN '43'
        WHEN ad.attribute_name = 'Couleur' AND pv.sku LIKE '%-BLK' THEN 'Noir'
        WHEN ad.attribute_name = 'Couleur' AND pv.sku LIKE '%-WHT' THEN 'Blanc'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'nike-air-zoom-pegasus';

-- Adidas Ultraboost DNA: Variants avec Pointure et Couleur
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Pointure' AND pv.sku LIKE '%-40-%' THEN '40'
        WHEN ad.attribute_name = 'Pointure' AND pv.sku LIKE '%-42-%' THEN '42'
        WHEN ad.attribute_name = 'Pointure' AND pv.sku LIKE '%-44-%' THEN '44'
        WHEN ad.attribute_name = 'Couleur' AND pv.sku LIKE '%-BLK' THEN 'Noir'
        WHEN ad.attribute_name = 'Couleur' AND pv.sku LIKE '%-WHT' THEN 'Blanc'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'adidas-ultraboost-dna';

-- Haltères Réglables: Variants avec Poids
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN pv.sku LIKE '%-15KG' THEN '15 kg'
        WHEN pv.sku LIKE '%-25KG' THEN '25 kg'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'halteres-reglables';

-- ============================================================================
-- SHOP 2: Bijoux de Luxe - Attributs de variants
-- ============================================================================

-- Solitaire Éternité: Variants avec Matériau, Taille de bague, Carats
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Matériau' AND pv.sku LIKE '%-WG-%' THEN 'Or blanc'
        WHEN ad.attribute_name = 'Matériau' AND pv.sku LIKE '%-YG-%' THEN 'Or jaune'
        WHEN ad.attribute_name = 'Taille de bague' AND pv.sku LIKE '%-52-%' THEN '52'
        WHEN ad.attribute_name = 'Taille de bague' AND pv.sku LIKE '%-54-%' THEN '54'
        WHEN ad.attribute_name = 'Carats' AND pv.sku LIKE '%-050' THEN '0.50'
        WHEN ad.attribute_name = 'Carats' AND pv.sku LIKE '%-075' THEN '0.75'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'solitaire-eternite';

-- Halo Prestige: Variants avec Matériau, Taille de bague, Carats
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Matériau' AND pv.sku LIKE '%-WG-%' THEN 'Or blanc'
        WHEN ad.attribute_name = 'Matériau' AND pv.sku LIKE '%-PT-%' THEN 'Platine'
        WHEN ad.attribute_name = 'Taille de bague' AND pv.sku LIKE '%-52-%' THEN '52'
        WHEN ad.attribute_name = 'Taille de bague' AND pv.sku LIKE '%-54-%' THEN '54'
        WHEN ad.attribute_name = 'Carats' AND pv.sku LIKE '%-100' THEN '1.00'
        WHEN ad.attribute_name = 'Carats' AND pv.sku LIKE '%-150' THEN '1.50'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'halo-prestige';

-- Pendentif Coeur Diamant: Variants avec Matériau et Longueur chaîne
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Matériau' AND pv.sku LIKE '%-WG-%' THEN 'Or blanc'
        WHEN ad.attribute_name = 'Matériau' AND pv.sku LIKE '%-YG-%' THEN 'Or jaune'
        WHEN ad.attribute_name = 'Longueur chaîne' AND pv.sku LIKE '%-40CM' THEN '40 cm'
        WHEN ad.attribute_name = 'Longueur chaîne' AND pv.sku LIKE '%-45CM' THEN '45 cm'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'pendentif-coeur-diamant';

-- Bracelet Tennis Diamants: Variants avec Matériau et Longueur
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Matériau' AND pv.sku LIKE '%-WG-%' THEN 'Or blanc'
        WHEN ad.attribute_name = 'Matériau' AND pv.sku LIKE '%-YG-%' THEN 'Or jaune'
        WHEN ad.attribute_name = 'Longueur' AND pv.sku LIKE '%-17CM' THEN '17 cm'
        WHEN ad.attribute_name = 'Longueur' AND pv.sku LIKE '%-19CM' THEN '19 cm'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'bracelet-tennis-diamants';

-- ============================================================================
-- SHOP 3: Tech & Informatique Pro - Attributs de variants
-- ============================================================================

-- Dell XPS 15: Variants avec Processeur, RAM, Stockage
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Processeur' AND pv.sku LIKE '%-I7-%' THEN 'Intel i7'
        WHEN ad.attribute_name = 'Processeur' AND pv.sku LIKE '%-I9-%' THEN 'Intel i9'
        WHEN ad.attribute_name = 'RAM' AND pv.sku LIKE '%-16-%' THEN '16 GB'
        WHEN ad.attribute_name = 'RAM' AND pv.sku LIKE '%-32-%' THEN '32 GB'
        WHEN ad.attribute_name = 'Stockage' AND pv.sku LIKE '%-512' THEN '512 GB SSD'
        WHEN ad.attribute_name = 'Stockage' AND pv.sku LIKE '%-1TB' THEN '1 TB SSD'
        WHEN ad.attribute_name = 'Stockage' AND pv.sku LIKE '%-2TB' THEN '2 TB SSD'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'dell-xps-15';

-- MacBook Pro: Variants avec Puce, RAM, Stockage
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Puce' AND pv.sku LIKE '%-M3-16-%' THEN 'Apple M3'
        WHEN ad.attribute_name = 'Puce' AND pv.sku LIKE '%-M3-32-%' THEN 'Apple M3'
        WHEN ad.attribute_name = 'Puce' AND pv.sku LIKE '%-M3PRO-%' THEN 'Apple M3 Pro'
        WHEN ad.attribute_name = 'Puce' AND pv.sku LIKE '%-M3MAX-%' THEN 'Apple M3 Max'
        WHEN ad.attribute_name = 'RAM' AND pv.sku LIKE '%-M3-16-%' THEN '16 GB'
        WHEN ad.attribute_name = 'RAM' AND pv.sku LIKE '%-32-%' THEN '32 GB'
        WHEN ad.attribute_name = 'RAM' AND pv.sku LIKE '%-64-%' THEN '64 GB'
        WHEN ad.attribute_name = 'Stockage' AND pv.sku LIKE '%-512' THEN '512 GB SSD'
        WHEN ad.attribute_name = 'Stockage' AND pv.sku LIKE '%-1TB' THEN '1 TB SSD'
        WHEN ad.attribute_name = 'Stockage' AND pv.sku LIKE '%-2TB' THEN '2 TB SSD'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'macbook-pro';

-- NVIDIA GeForce RTX 4080: Variants avec Mémoire VRAM
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN pv.sku LIKE '%-16GB' THEN '16 GB GDDR6X'
        WHEN pv.sku LIKE '%-16GB-OC' THEN '16 GB GDDR6X OC'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'nvidia-rtx-4080';

-- AMD Radeon RX 7900 XTX: Variants avec Mémoire VRAM
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN pv.sku LIKE '%-24GB' THEN '24 GB GDDR6'
        WHEN pv.sku LIKE '%-24GB-OC' THEN '24 GB GDDR6 OC'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'amd-rx-7900-xtx';

-- Clavier Mécanique RGB: Variants avec Type de switches et Layout
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN ad.attribute_name = 'Type de switches' AND pv.sku LIKE '%-RED-%' THEN 'Cherry MX Red'
        WHEN ad.attribute_name = 'Type de switches' AND pv.sku LIKE '%-BLUE-%' THEN 'Cherry MX Blue'
        WHEN ad.attribute_name = 'Type de switches' AND pv.sku LIKE '%-BROWN-%' THEN 'Cherry MX Brown'
        WHEN ad.attribute_name = 'Layout' AND pv.sku LIKE '%-FR' THEN 'AZERTY (FR)'
        WHEN ad.attribute_name = 'Layout' AND pv.sku LIKE '%-US' THEN 'QWERTY (US)'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'clavier-mecanique-rgb';

-- Souris Gaming Pro: Variants avec Couleur
INSERT INTO variant_attributes (variant_id, attribute_definition_id, attribute_value)
SELECT
    pv.id,
    ad.id,
    CASE
        WHEN pv.sku LIKE '%-BLK' THEN 'Noir'
        WHEN pv.sku LIKE '%-WHT' THEN 'Blanc'
    END
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON ad.product_id = p.id
WHERE p.slug = 'souris-gaming-pro';

-- Vérification
SELECT
    p.name AS product_name,
    pv.sku,
    ad.attribute_name,
    va.attribute_value
FROM variant_attributes va
JOIN product_variants pv ON va.variant_id = pv.id
JOIN products p ON pv.product_id = p.id
JOIN attribute_definitions ad ON va.attribute_definition_id = ad.id
ORDER BY p.id, pv.id, ad.position;

