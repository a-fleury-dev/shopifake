import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Mistral } from '@mistralai/mistralai';
import axios from 'axios';
import { initializeQdrantCollection, indexProducts, searchProducts, getProductCount } from './qdrant.js';
import { generateEmbedding, generateEmbeddings, createProductSearchText } from './embeddings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8080/api/products';

// Initialiser Mistral AI
const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'chatbot-service' });
});

// Endpoint pour récupérer et indexer les produits
app.post('/products/index', async (req, res) => {
    try {
        console.log('📦 Récupération des produits...');

        // Récupérer les produits depuis le service de produits (ou utiliser les produits fournis)
        let products = req.body.products;

        if (!products || products.length === 0) {
            // Essayer de récupérer depuis le service externe
            try {
                const response = await axios.get(PRODUCT_SERVICE_URL);
                products = response.data;
            } catch (error) {
                // Si le service n'est pas disponible, utiliser des produits mock
                console.log('⚠️ Service de produits non disponible, utilisation de données mock');
                products = getMockProducts();
            }
        }

        console.log(`📝 ${products.length} produits récupérés`);

        // Générer les embeddings pour chaque produit
        console.log('🔄 Génération des embeddings...');
        const productTexts = products.map(createProductSearchText);
        const embeddings = await generateEmbeddings(productTexts);

        // Ajouter les embeddings aux produits
        const productsWithEmbeddings = products.map((product, index) => ({
            ...product,
            embedding: embeddings[index],
        }));

        // Indexer dans Qdrant
        console.log('💾 Indexation dans Qdrant...');
        await indexProducts(productsWithEmbeddings);

        const count = await getProductCount();

        res.json({
            success: true,
            message: `${products.length} produits indexés avec succès`,
            totalIndexed: count,
        });

    } catch (error) {
        console.error('❌ Erreur lors de l\'indexation:', error);
        res.status(500).json({
            error: 'Failed to index products',
            details: error.message
        });
    }
});

// Endpoint pour obtenir le statut de l'indexation
app.get('/products/status', async (req, res) => {
    try {
        const count = await getProductCount();
        res.json({
            indexed: count,
            ready: count > 0,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get status',
            details: error.message
        });
    }
});

// Webhook endpoint pour recevoir les événements de création/modification de produits
app.post('/webhook/product', async (req, res) => {
    try {
        const { event, product } = req.body;

        if (!product) {
            return res.status(400).json({
                error: 'Product data is required',
                message: 'Le body doit contenir un objet "product"'
            });
        }

        console.log(`📬 Webhook reçu: ${event} pour produit ID ${product.id}`);

        // Créer le texte de recherche pour le produit
        const searchText = createProductSearchText(product);

        // Générer l'embedding
        console.log('🔄 Génération de l\'embedding...');
        const embedding = await generateEmbedding(searchText);

        // Indexer ou mettre à jour le produit dans Qdrant
        const productWithEmbedding = {
            ...product,
            embedding: embedding
        };

        await indexProducts([productWithEmbedding]);

        console.log(`✅ Produit "${product.name}" indexé avec succès`);

        res.status(200).json({
            success: true,
            message: `Product ${event}d successfully`,
            productId: product.id,
            productName: product.name
        });

    } catch (error) {
        console.error('❌ Erreur lors du traitement du webhook:', error);
        res.status(500).json({
            error: 'Failed to process webhook',
            details: error.message
        });
    }
});

// Webhook endpoint pour suppression de produit
app.delete('/webhook/product/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);

        console.log(`📬 Webhook reçu: DELETE pour produit ID ${productId}`);

        // Supprimer le produit de Qdrant
        const { QdrantClient } = await import('@qdrant/js-client-rest');
        const qdrantClient = new QdrantClient({
            url: `http://${process.env.QDRANT_HOST || 'localhost'}:${process.env.QDRANT_PORT || 6333}`,
        });

        await qdrantClient.delete('products', {
            wait: true,
            points: [productId]
        });

        console.log(`✅ Produit ID ${productId} supprimé avec succès`);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            productId: productId
        });

    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        res.status(500).json({
            error: 'Failed to delete product',
            details: error.message
        });
    }
});

// Endpoint de chat avec RAG pour recommandation de produits
app.post('/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Générer l'embedding de la question de l'utilisateur
        console.log('🔍 Recherche de produits pertinents...');
        const queryEmbedding = await generateEmbedding(message);

        // Rechercher les produits similaires dans Qdrant
        const similarProducts = await searchProducts(queryEmbedding, 3);

        // Construire le contexte avec les produits trouvés
        let contextText = '';
        if (similarProducts.length > 0) {
            contextText = '\n\nProduits disponibles pertinents:\n' +
                similarProducts.map((item, index) => {
                    const p = item.product;
                    return `${index + 1}. ${p.name} - ${p.price}€
   Description: ${p.description}
   Catégorie: ${p.category}
   Stock: ${p.stock > 0 ? 'Disponible' : 'Rupture de stock'}
   Score de pertinence: ${(item.score * 100).toFixed(1)}%`;
                }).join('\n\n');
        }

        // Construire l'historique de conversation pour Mistral AI
        const systemPrompt = `Tu es un assistant virtuel pour Shopifake, une plateforme e-commerce. 
Tu dois aider les utilisateurs à trouver des produits qui correspondent à leurs besoins.

${contextText}

Instructions:
- Utilise UNIQUEMENT les produits listés ci-dessus pour répondre
- Recommande les produits les plus pertinents en fonction de la demande
- Mentionne le prix, la disponibilité et les caractéristiques importantes
- Si aucun produit ne correspond, dis-le poliment et suggère d'autres options
- Sois amical, professionnel et concis`;

        const messages = [
            {
                role: 'system',
                content: systemPrompt
            },
            ...conversationHistory,
            {
                role: 'user',
                content: message
            }
        ];

        // Appel à l'API Mistral AI
        const completion = await mistral.chat.complete({
            model: 'mistral-large-latest',
            messages: messages,
            temperature: 0.7,
            maxTokens: 500,
        });

        const botResponse = completion.choices[0].message.content;

        res.json({
            response: botResponse,
            products: similarProducts.map(item => item.product),
            conversationHistory: [
                ...conversationHistory,
                { role: 'user', content: message },
                { role: 'assistant', content: botResponse }
            ]
        });

    } catch (error) {
        console.error('Error calling Mistral API:', error);
        res.status(500).json({
            error: 'Failed to process chat request',
            details: error.message
        });
    }
});

// Endpoint pour réinitialiser la conversation
app.post('/chat/reset', (req, res) => {
    res.json({
        message: 'Conversation reset',
        conversationHistory: []
    });
});

// Fonction pour générer des produits mock
function getMockProducts() {
    return [
        {
            id: 1,
            name: 'iPhone 15 Pro',
            description: 'Smartphone Apple avec puce A17 Pro, appareil photo 48MP, écran Super Retina XDR',
            price: 1229,
            category: 'Smartphones',
            stock: 15,
            image: '/images/iphone15pro.jpg'
        },
        {
            id: 2,
            name: 'Samsung Galaxy S24 Ultra',
            description: 'Smartphone premium Samsung avec S Pen, écran AMOLED 6.8", appareil photo 200MP',
            price: 1399,
            category: 'Smartphones',
            stock: 8,
            image: '/images/galaxys24.jpg'
        },
        {
            id: 3,
            name: 'MacBook Pro M3',
            description: 'Ordinateur portable Apple avec puce M3, 16GB RAM, écran Liquid Retina XDR 14"',
            price: 2299,
            category: 'Ordinateurs',
            stock: 5,
            image: '/images/macbookpro.jpg'
        },
        {
            id: 4,
            name: 'Dell XPS 15',
            description: 'PC portable Dell avec Intel i9, 32GB RAM, NVIDIA RTX 4060, écran 4K OLED',
            price: 2499,
            category: 'Ordinateurs',
            stock: 3,
            image: '/images/dellxps15.jpg'
        },
        {
            id: 5,
            name: 'AirPods Pro 2',
            description: 'Écouteurs sans fil Apple avec réduction de bruit active, audio spatial',
            price: 279,
            category: 'Audio',
            stock: 25,
            image: '/images/airpodspro.jpg'
        },
        {
            id: 6,
            name: 'Sony WH-1000XM5',
            description: 'Casque audio sans fil premium avec réduction de bruit exceptionnelle',
            price: 399,
            category: 'Audio',
            stock: 12,
            image: '/images/sonywh1000xm5.jpg'
        },
        {
            id: 7,
            name: 'iPad Air M2',
            description: 'Tablette Apple avec puce M2, écran Liquid Retina 11", compatible Apple Pencil',
            price: 699,
            category: 'Tablettes',
            stock: 10,
            image: '/images/ipadair.jpg'
        },
        {
            id: 8,
            name: 'Samsung Tab S9',
            description: 'Tablette Android premium avec S Pen inclus, écran AMOLED 11"',
            price: 649,
            category: 'Tablettes',
            stock: 7,
            image: '/images/tabs9.jpg'
        }
    ];
}

// Initialiser Qdrant et démarrer le serveur
async function startServer() {
    try {
        console.log('🚀 Initialisation du chatbot service...');

        // Initialiser la collection Qdrant
        await initializeQdrantCollection();

        // Démarrer le serveur
        app.listen(PORT, () => {
            console.log(`🤖 Chatbot service running on port ${PORT}`);
            console.log(`✅ Mistral AI API configured`);
            console.log(`✅ Qdrant vector database ready`);
            console.log(`\n💡 Pour indexer les produits: POST /products/index`);
            console.log(`💡 Pour chatter: POST /chat`);
        });
    } catch (error) {
        console.error('❌ Erreur lors du démarrage:', error);
        process.exit(1);
    }
}

startServer();
