-- Seeds de développement pour les boutiques
-- Insertion de 3 boutiques de démonstration avec le même admin_id (1)

INSERT INTO shops (admin_id, domain_name, name, description, banner_url, created_at, updated_at)
VALUES
    (
        'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        'sport-elite',
        'Sport Elite',
        'Découvrez notre gamme complète de vêtements et équipements sportifs de haute qualité. Que vous soyez un athlète professionnel ou un amateur passionné, nous avons tout ce qu''il vous faut pour atteindre vos objectifs. Running, fitness, sports collectifs, outdoor : équipez-vous chez Sport Elite !',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&h=400&fit=crop',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        'bijoux-luxe',
        'Bijoux de Luxe',
        'Plongez dans l''univers du luxe et de l''élégance avec notre collection exclusive de bijoux raffinés. Bagues en or et diamants, colliers précieux, bracelets délicats et boucles d''oreilles éblouissantes : chaque pièce est sélectionnée avec soin pour sublimer votre beauté. Offrez-vous ou offrez à vos proches des créations d''exception.',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&h=400&fit=crop',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
        'tech-informatique',
        'Tech & Informatique Pro',
        'Votre destination incontournable pour tout le matériel informatique et technologique. Ordinateurs portables dernière génération, PC gaming surpuissants, périphériques gaming RGB, composants PC, accessoires high-tech et bien plus encore. Des produits de qualité professionnelle à prix compétitifs, avec un service client réactif et des conseils d''experts.',
        'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1600&h=400&fit=crop',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- Vérification des données insérées
SELECT
    id,
    admin_id,
    domain_name,
    name,
    LEFT(description, 50) || '...' as description_preview,
    banner_url
FROM shops
ORDER BY id;

