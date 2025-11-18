import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_HOST = process.env.QDRANT_HOST || 'localhost';
const QDRANT_PORT = process.env.QDRANT_PORT || 6333;
const COLLECTION_NAME = 'products';

// Initialiser le client Qdrant
export const qdrantClient = new QdrantClient({
    url: `http://${QDRANT_HOST}:${QDRANT_PORT}`,
});

/**
 * Initialiser la collection Qdrant pour les produits
 */
export async function initializeQdrantCollection() {
    try {
        // Vérifier si la collection existe
        const collections = await qdrantClient.getCollections();
        const collectionExists = collections.collections.some(
            col => col.name === COLLECTION_NAME
        );

        if (!collectionExists) {
            // Créer la collection avec la dimension de mistral-embed (1024)
            await qdrantClient.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: 1024,
                    distance: 'Cosine',
                },
            });
            console.log(`✅ Collection '${COLLECTION_NAME}' créée`);
        } else {
            console.log(`✅ Collection '${COLLECTION_NAME}' déjà existante`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de Qdrant:', error);
        throw error;
    }
}

/**
 * Ajouter des produits dans Qdrant
 * @param {Array} products - Liste des produits avec embeddings
 */
export async function indexProducts(products) {
    try {
        const points = products.map((product, index) => ({
            id: product.id || index + 1,
            vector: product.embedding,
            payload: {
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                stock: product.stock,
                image: product.image,
            },
        }));

        await qdrantClient.upsert(COLLECTION_NAME, {
            wait: true,
            points: points,
        });

        console.log(`✅ ${products.length} produits indexés dans Qdrant`);
        return { success: true, count: products.length };
    } catch (error) {
        console.error('❌ Erreur lors de l\'indexation des produits:', error);
        throw error;
    }
}

/**
 * Rechercher des produits similaires
 * @param {Array} queryVector - Vecteur de la requête
 * @param {number} limit - Nombre de résultats
 */
export async function searchProducts(queryVector, limit = 5) {
    try {
        const searchResult = await qdrantClient.search(COLLECTION_NAME, {
            vector: queryVector,
            limit: limit,
            with_payload: true,
        });

        return searchResult.map(result => ({
            score: result.score,
            product: result.payload,
        }));
    } catch (error) {
        console.error('❌ Erreur lors de la recherche:', error);
        throw error;
    }
}

/**
 * Compter le nombre de produits indexés
 */
export async function getProductCount() {
    try {
        const result = await qdrantClient.count(COLLECTION_NAME);
        return result.count;
    } catch (error) {
        console.error('❌ Erreur lors du comptage:', error);
        return 0;
    }
}

/**
 * Supprimer tous les produits
 */
export async function clearProducts() {
    try {
        await qdrantClient.delete(COLLECTION_NAME, {
            wait: true,
            filter: {},
        });
        console.log('✅ Tous les produits supprimés de Qdrant');
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        throw error;
    }
}
