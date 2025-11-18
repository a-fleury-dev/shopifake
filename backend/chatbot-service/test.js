// Script de test pour démontrer le flux complet du chatbot RAG
// 1. Indexer des produits (chaussures)
// 2. Poser des questions au chatbot
// 3. Obtenir des recommandations

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

// Données de test : catalogue de chaussures
const shoesProducts = [
    {
        id: 1,
        name: 'Nike Air Max 90',
        description: 'Baskets Nike Air Max 90 iconiques avec amorti Air visible, design rétro années 90',
        price: 139.99,
        category: 'Baskets',
        style: 'Sportif',
        color: 'Blanc et Rouge',
        size: [38, 39, 40, 41, 42, 43, 44, 45],
        stock: 25,
        brand: 'Nike',
        image: '/images/air-max-90.jpg'
    },
    {
        id: 2,
        name: 'Adidas Ultraboost 22',
        description: 'Chaussures de running Adidas Ultraboost avec semelle Boost pour un confort maximal',
        price: 189.99,
        category: 'Running',
        style: 'Sport Performance',
        color: 'Noir',
        size: [39, 40, 41, 42, 43, 44, 45],
        stock: 15,
        brand: 'Adidas',
        image: '/images/ultraboost-22.jpg'
    },
    {
        id: 3,
        name: 'Converse Chuck Taylor All Star',
        description: 'Baskets classiques Converse Chuck Taylor montantes en toile, style intemporel',
        price: 64.99,
        category: 'Baskets',
        style: 'Casual',
        color: 'Noir',
        size: [36, 37, 38, 39, 40, 41, 42, 43, 44],
        stock: 50,
        brand: 'Converse',
        image: '/images/chuck-taylor.jpg'
    },
    {
        id: 4,
        name: 'Vans Old Skool',
        description: 'Baskets Vans Old Skool avec bande signature, parfaites pour le skate et le streetwear',
        price: 79.99,
        category: 'Baskets',
        style: 'Streetwear',
        color: 'Noir et Blanc',
        size: [38, 39, 40, 41, 42, 43, 44, 45],
        stock: 30,
        brand: 'Vans',
        image: '/images/old-skool.jpg'
    },
    {
        id: 5,
        name: 'New Balance 574',
        description: 'Baskets New Balance 574 rétro avec semelle ENCAP pour confort et durabilité',
        price: 99.99,
        category: 'Baskets',
        style: 'Lifestyle',
        color: 'Gris',
        size: [39, 40, 41, 42, 43, 44, 45],
        stock: 20,
        brand: 'New Balance',
        image: '/images/nb-574.jpg'
    },
    {
        id: 6,
        name: 'Jordan 1 Retro High',
        description: 'Baskets Air Jordan 1 High iconiques, sneaker de légende avec design basketball',
        price: 179.99,
        category: 'Baskets',
        style: 'Basketball/Streetwear',
        color: 'Rouge et Noir',
        size: [40, 41, 42, 43, 44, 45],
        stock: 8,
        brand: 'Jordan',
        image: '/images/jordan-1.jpg'
    },
    {
        id: 7,
        name: 'Puma Suede Classic',
        description: 'Baskets Puma Suede Classic en daim, style vintage et élégant',
        price: 74.99,
        category: 'Baskets',
        style: 'Casual',
        color: 'Bleu Marine',
        size: [38, 39, 40, 41, 42, 43, 44],
        stock: 18,
        brand: 'Puma',
        image: '/images/puma-suede.jpg'
    },
    {
        id: 8,
        name: 'Asics Gel-Kayano 29',
        description: 'Chaussures de running Asics Gel-Kayano avec technologie Gel pour amorti et stabilité',
        price: 169.99,
        category: 'Running',
        style: 'Sport Performance',
        color: 'Bleu',
        size: [40, 41, 42, 43, 44, 45],
        stock: 12,
        brand: 'Asics',
        image: '/images/gel-kayano.jpg'
    },
    {
        id: 9,
        name: 'Reebok Classic Leather',
        description: 'Baskets Reebok Classic Leather rétro, confort au quotidien avec style intemporel',
        price: 84.99,
        category: 'Baskets',
        style: 'Lifestyle',
        color: 'Blanc',
        size: [38, 39, 40, 41, 42, 43, 44, 45],
        stock: 22,
        brand: 'Reebok',
        image: '/images/classic-leather.jpg'
    },
    {
        id: 10,
        name: 'Nike Blazer Mid 77',
        description: 'Baskets Nike Blazer Mid 77 vintage avec design basketball classique et look rétro',
        price: 109.99,
        category: 'Baskets',
        style: 'Vintage',
        color: 'Blanc et Orange',
        size: [39, 40, 41, 42, 43, 44, 45],
        stock: 16,
        brand: 'Nike',
        image: '/images/blazer-mid.jpg'
    },
    {
        id: 11,
        name: 'Salomon Speedcross 5',
        description: 'Chaussures de trail Salomon Speedcross avec adhérence exceptionnelle pour terrains difficiles',
        price: 139.99,
        category: 'Trail',
        style: 'Outdoor',
        color: 'Noir et Vert',
        size: [40, 41, 42, 43, 44, 45],
        stock: 10,
        brand: 'Salomon',
        image: '/images/speedcross.jpg'
    },
    {
        id: 12,
        name: 'Timberland 6-Inch Premium',
        description: 'Boots Timberland Premium 6-Inch en cuir imperméable, robustes et élégantes',
        price: 199.99,
        category: 'Boots',
        style: 'Outdoor/Casual',
        color: 'Marron',
        size: [40, 41, 42, 43, 44, 45],
        stock: 14,
        brand: 'Timberland',
        image: '/images/timberland-boot.jpg'
    }
];

// Fonction pour afficher les résultats de manière lisible
function displayResponse(title, data) {
    console.log('\n' + '='.repeat(80));
    console.log(`📋 ${title}`);
    console.log('='.repeat(80));
    console.log(JSON.stringify(data, null, 2));
}

// Fonction pour attendre un peu (pour simuler l'expérience utilisateur)
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Test principal
async function runTest() {
    try {
        console.log('🚀 Démarrage du test du chatbot RAG pour chaussures\n');

        // Étape 1: Vérifier que le service est up
        console.log('1️⃣ Vérification du service...');
        const healthCheck = await axios.get(`${BASE_URL}/health`);
        displayResponse('Health Check', healthCheck.data);
        await wait(1000);

        // Étape 2: Indexer les produits (chaussures)
        console.log('\n2️⃣ Indexation de 12 chaussures dans la base vectorielle...');
        console.log('   (Génération des embeddings avec Mistral Embed + stockage dans Qdrant)');

        const indexResponse = await axios.post(`${BASE_URL}/products/index`, {
            products: shoesProducts
        });
        displayResponse('Indexation des produits', indexResponse.data);
        await wait(3000); // Augmenté pour éviter le rate limiting

        // Étape 3: Vérifier le statut de l'indexation
        console.log('\n3️⃣ Vérification du statut de l\'indexation...');
        const statusResponse = await axios.get(`${BASE_URL}/products/status`);
        displayResponse('Statut de l\'indexation', statusResponse.data);
        await wait(1000);

        // Étape 4: Scénarios de test avec le chatbot
        console.log('\n4️⃣ Test des conversations avec le chatbot...\n');

        const testQueries = [
            {
                scenario: 'Recherche de baskets Nike blanches',
                message: 'Je cherche des baskets Nike blanches, qu\'est-ce que vous avez ?'
            },
            {
                scenario: 'Recherche de chaussures de running',
                message: 'J\'ai besoin de chaussures pour courir un marathon, que me conseillez-vous ?'
            },
            {
                scenario: 'Recherche de chaussures streetwear noires',
                message: 'Je veux des chaussures noires style streetwear pour tous les jours'
            },
            {
                scenario: 'Recherche d\'un modèle spécifique',
                message: 'Est-ce que vous avez des Air Jordan 1 en rouge et noir ?'
            },
            {
                scenario: 'Recherche par budget',
                message: 'Quelles chaussures avez-vous à moins de 100€ ?'
            }
        ];

        for (let i = 0; i < testQueries.length; i++) {
            const query = testQueries[i];
            console.log(`\n   📝 Scénario ${i + 1}: ${query.scenario}`);
            console.log(`   💬 Client: "${query.message}"\n`);

            const chatResponse = await axios.post(`${BASE_URL}/chat`, {
                message: query.message,
                conversationHistory: []
            });

            console.log(`   🤖 Chatbot: ${chatResponse.data.response}\n`);

            if (chatResponse.data.products && chatResponse.data.products.length > 0) {
                console.log(`   📦 Produits recommandés:`);
                chatResponse.data.products.forEach((product, idx) => {
                    console.log(`      ${idx + 1}. ${product.name} - ${product.price}€ (${product.color})`);
                });
            }

            console.log('   ' + '-'.repeat(70));
            await wait(5000); // Augmenté pour éviter le rate limiting
        }

        // Étape 5: Test avec historique de conversation
        console.log('\n5️⃣ Test avec historique de conversation (multi-tours)...\n');

        let conversationHistory = [];

        // Premier message
        const msg1 = 'Je cherche des baskets pour faire du sport';
        console.log(`   💬 Client: "${msg1}"`);
        const response1 = await axios.post(`${BASE_URL}/chat`, {
            message: msg1,
            conversationHistory: conversationHistory
        });
        console.log(`   🤖 Chatbot: ${response1.data.response}\n`);
        conversationHistory = response1.data.conversationHistory;
        await wait(1500);

        // Deuxième message (follow-up)
        const msg2 = 'Et pour le running spécifiquement ?';
        console.log(`   💬 Client: "${msg2}"`);
        const response2 = await axios.post(`${BASE_URL}/chat`, {
            message: msg2,
            conversationHistory: conversationHistory
        });
        console.log(`   🤖 Chatbot: ${response2.data.response}\n`);
        await wait(1500);

        // Résumé final
        console.log('\n' + '='.repeat(80));
        console.log('✅ TEST TERMINÉ AVEC SUCCÈS !');
        console.log('='.repeat(80));
        console.log('\n📊 Résumé:');
        console.log(`   • ${shoesProducts.length} chaussures indexées`);
        console.log(`   • ${testQueries.length + 2} conversations testées`);
        console.log(`   • Recherche vectorielle fonctionnelle`);
        console.log(`   • RAG opérationnel avec Mistral AI + Qdrant`);
        console.log('\n');

    } catch (error) {
        console.error('\n❌ ERREUR LORS DU TEST:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Message: ${JSON.stringify(error.response.data, null, 2)}`);
        } else if (error.request) {
            console.error('   Aucune réponse du serveur. Le service est-il démarré ?');
            console.error('   Lancez: npm run dev');
        } else {
            console.error(`   ${error.message}`);
        }
        process.exit(1);
    }
}

// Lancer le test
runTest();
