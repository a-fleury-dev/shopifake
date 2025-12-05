-- Seeds de développement pour les variants de produits
-- Au moins 2 variants par produit avec des combinaisons d'attributs uniques

-- ============================================================================
-- SHOP 1: Sport Elite - Variants
-- ============================================================================

-- T-shirt Running Pro: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 't-shirt-running-pro'), 1, 'TSHIRT-RUN-PRO-S-BLK', 29.99, 50, true),
((SELECT id FROM products WHERE slug = 't-shirt-running-pro'), 1, 'TSHIRT-RUN-PRO-S-BLU', 29.99, 45, true),
((SELECT id FROM products WHERE slug = 't-shirt-running-pro'), 1, 'TSHIRT-RUN-PRO-M-BLK', 29.99, 60, true),
((SELECT id FROM products WHERE slug = 't-shirt-running-pro'), 1, 'TSHIRT-RUN-PRO-M-BLU', 29.99, 55, true),
((SELECT id FROM products WHERE slug = 't-shirt-running-pro'), 1, 'TSHIRT-RUN-PRO-L-BLK', 29.99, 40, true),
((SELECT id FROM products WHERE slug = 't-shirt-running-pro'), 1, 'TSHIRT-RUN-PRO-L-BLU', 29.99, 35, true);

-- Short Running Performance: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'short-running-performance'), 1, 'SHORT-RUN-PERF-S-BLK', 34.99, 40, true),
((SELECT id FROM products WHERE slug = 'short-running-performance'), 1, 'SHORT-RUN-PERF-S-GRY', 34.99, 35, true),
((SELECT id FROM products WHERE slug = 'short-running-performance'), 1, 'SHORT-RUN-PERF-M-BLK', 34.99, 50, true),
((SELECT id FROM products WHERE slug = 'short-running-performance'), 1, 'SHORT-RUN-PERF-M-GRY', 34.99, 45, true),
((SELECT id FROM products WHERE slug = 'short-running-performance'), 1, 'SHORT-RUN-PERF-L-BLK', 34.99, 30, true),
((SELECT id FROM products WHERE slug = 'short-running-performance'), 1, 'SHORT-RUN-PERF-L-GRY', 34.99, 25, true);

-- Nike Air Zoom Pegasus: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'nike-air-zoom-pegasus'), 1, 'NIKE-PEGASUS-41-BLK', 139.99, 25, true),
((SELECT id FROM products WHERE slug = 'nike-air-zoom-pegasus'), 1, 'NIKE-PEGASUS-41-WHT', 139.99, 20, true),
((SELECT id FROM products WHERE slug = 'nike-air-zoom-pegasus'), 1, 'NIKE-PEGASUS-42-BLK', 139.99, 30, true),
((SELECT id FROM products WHERE slug = 'nike-air-zoom-pegasus'), 1, 'NIKE-PEGASUS-42-WHT', 139.99, 28, true),
((SELECT id FROM products WHERE slug = 'nike-air-zoom-pegasus'), 1, 'NIKE-PEGASUS-43-BLK', 139.99, 22, true),
((SELECT id FROM products WHERE slug = 'nike-air-zoom-pegasus'), 1, 'NIKE-PEGASUS-43-WHT', 139.99, 18, true);

-- Adidas Ultraboost DNA: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-dna'), 1, 'ADIDAS-UB-DNA-40-BLK', 179.99, 20, true),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-dna'), 1, 'ADIDAS-UB-DNA-40-WHT', 179.99, 18, true),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-dna'), 1, 'ADIDAS-UB-DNA-42-BLK', 179.99, 25, true),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-dna'), 1, 'ADIDAS-UB-DNA-42-WHT', 179.99, 22, true),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-dna'), 1, 'ADIDAS-UB-DNA-44-BLK', 179.99, 15, true),
((SELECT id FROM products WHERE slug = 'adidas-ultraboost-dna'), 1, 'ADIDAS-UB-DNA-44-WHT', 179.99, 12, true);

-- Haltères Réglables: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'halteres-reglables'), 1, 'HALTERE-ADJ-15KG', 89.99, 30, true),
((SELECT id FROM products WHERE slug = 'halteres-reglables'), 1, 'HALTERE-ADJ-25KG', 129.99, 25, true);

-- ============================================================================
-- SHOP 2: Bijoux de Luxe - Variants
-- ============================================================================

-- Solitaire Éternité: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'solitaire-eternite'), 2, 'SOL-ETER-WG-52-050', 2499.99, 5, true),
((SELECT id FROM products WHERE slug = 'solitaire-eternite'), 2, 'SOL-ETER-WG-52-075', 3499.99, 3, true),
((SELECT id FROM products WHERE slug = 'solitaire-eternite'), 2, 'SOL-ETER-WG-54-050', 2499.99, 4, true),
((SELECT id FROM products WHERE slug = 'solitaire-eternite'), 2, 'SOL-ETER-WG-54-075', 3499.99, 2, true),
((SELECT id FROM products WHERE slug = 'solitaire-eternite'), 2, 'SOL-ETER-YG-52-050', 2599.99, 4, true),
((SELECT id FROM products WHERE slug = 'solitaire-eternite'), 2, 'SOL-ETER-YG-54-050', 2599.99, 3, true);

-- Halo Prestige: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'halo-prestige'), 2, 'HALO-PREST-WG-52-100', 4999.99, 3, true),
((SELECT id FROM products WHERE slug = 'halo-prestige'), 2, 'HALO-PREST-WG-52-150', 6999.99, 2, true),
((SELECT id FROM products WHERE slug = 'halo-prestige'), 2, 'HALO-PREST-WG-54-100', 4999.99, 2, true),
((SELECT id FROM products WHERE slug = 'halo-prestige'), 2, 'HALO-PREST-PT-52-100', 5499.99, 2, true),
((SELECT id FROM products WHERE slug = 'halo-prestige'), 2, 'HALO-PREST-PT-54-100', 5499.99, 1, true);

-- Pendentif Coeur Diamant: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'pendentif-coeur-diamant'), 2, 'PEND-COEUR-WG-40CM', 899.99, 10, true),
((SELECT id FROM products WHERE slug = 'pendentif-coeur-diamant'), 2, 'PEND-COEUR-WG-45CM', 899.99, 8, true),
((SELECT id FROM products WHERE slug = 'pendentif-coeur-diamant'), 2, 'PEND-COEUR-YG-40CM', 949.99, 7, true),
((SELECT id FROM products WHERE slug = 'pendentif-coeur-diamant'), 2, 'PEND-COEUR-YG-45CM', 949.99, 6, true);

-- Bracelet Tennis Diamants: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'bracelet-tennis-diamants'), 2, 'BRAC-TENNIS-WG-17CM', 3999.99, 5, true),
((SELECT id FROM products WHERE slug = 'bracelet-tennis-diamants'), 2, 'BRAC-TENNIS-WG-19CM', 4199.99, 4, true),
((SELECT id FROM products WHERE slug = 'bracelet-tennis-diamants'), 2, 'BRAC-TENNIS-YG-17CM', 4099.99, 4, true),
((SELECT id FROM products WHERE slug = 'bracelet-tennis-diamants'), 2, 'BRAC-TENNIS-YG-19CM', 4299.99, 3, true);

-- ============================================================================
-- SHOP 3: Tech & Informatique Pro - Variants
-- ============================================================================

-- Dell XPS 15: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'dell-xps-15'), 3, 'DELL-XPS15-I7-16-512', 1799.99, 15, true),
((SELECT id FROM products WHERE slug = 'dell-xps-15'), 3, 'DELL-XPS15-I7-16-1TB', 1999.99, 12, true),
((SELECT id FROM products WHERE slug = 'dell-xps-15'), 3, 'DELL-XPS15-I7-32-512', 2099.99, 10, true),
((SELECT id FROM products WHERE slug = 'dell-xps-15'), 3, 'DELL-XPS15-I7-32-1TB', 2299.99, 8, true),
((SELECT id FROM products WHERE slug = 'dell-xps-15'), 3, 'DELL-XPS15-I9-32-1TB', 2799.99, 5, true),
((SELECT id FROM products WHERE slug = 'dell-xps-15'), 3, 'DELL-XPS15-I9-32-2TB', 2999.99, 3, true);

-- MacBook Pro: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'macbook-pro'), 3, 'MBP-M3-16-512', 2499.99, 20, true),
((SELECT id FROM products WHERE slug = 'macbook-pro'), 3, 'MBP-M3-16-1TB', 2699.99, 18, true),
((SELECT id FROM products WHERE slug = 'macbook-pro'), 3, 'MBP-M3-32-1TB', 2999.99, 15, true),
((SELECT id FROM products WHERE slug = 'macbook-pro'), 3, 'MBP-M3PRO-32-1TB', 3499.99, 10, true),
((SELECT id FROM products WHERE slug = 'macbook-pro'), 3, 'MBP-M3PRO-32-2TB', 3899.99, 8, true),
((SELECT id FROM products WHERE slug = 'macbook-pro'), 3, 'MBP-M3MAX-64-2TB', 4999.99, 5, true);

-- NVIDIA GeForce RTX 4080: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'nvidia-rtx-4080'), 3, 'NVIDIA-RTX4080-16GB', 1199.99, 12, true),
((SELECT id FROM products WHERE slug = 'nvidia-rtx-4080'), 3, 'NVIDIA-RTX4080-16GB-OC', 1299.99, 8, true);

-- AMD Radeon RX 7900 XTX: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'amd-rx-7900-xtx'), 3, 'AMD-RX7900XTX-24GB', 999.99, 10, true),
((SELECT id FROM products WHERE slug = 'amd-rx-7900-xtx'), 3, 'AMD-RX7900XTX-24GB-OC', 1099.99, 7, true);

-- Clavier Mécanique RGB: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'clavier-mecanique-rgb'), 3, 'KB-MECA-RGB-RED-FR', 149.99, 25, true),
((SELECT id FROM products WHERE slug = 'clavier-mecanique-rgb'), 3, 'KB-MECA-RGB-RED-US', 149.99, 30, true),
((SELECT id FROM products WHERE slug = 'clavier-mecanique-rgb'), 3, 'KB-MECA-RGB-BLUE-FR', 149.99, 20, true),
((SELECT id FROM products WHERE slug = 'clavier-mecanique-rgb'), 3, 'KB-MECA-RGB-BLUE-US', 149.99, 22, true),
((SELECT id FROM products WHERE slug = 'clavier-mecanique-rgb'), 3, 'KB-MECA-RGB-BROWN-FR', 149.99, 18, true),
((SELECT id FROM products WHERE slug = 'clavier-mecanique-rgb'), 3, 'KB-MECA-RGB-BROWN-US', 149.99, 20, true);

-- Souris Gaming Pro: Variants
INSERT INTO product_variants (product_id, shop_id, sku, price, stock, is_active) VALUES
((SELECT id FROM products WHERE slug = 'souris-gaming-pro'), 3, 'MOUSE-GAME-PRO-BLK', 79.99, 40, true),
((SELECT id FROM products WHERE slug = 'souris-gaming-pro'), 3, 'MOUSE-GAME-PRO-WHT', 79.99, 35, true);

-- Vérification
SELECT pv.id, p.name, pv.sku, pv.price, pv.stock
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
ORDER BY p.id, pv.id;

