import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
});

/**
 * Générer un embedding avec Mistral
 * @param {string} text - Texte à vectoriser
 */
export async function generateEmbedding(text) {
    try {
        const embeddingResponse = await mistral.embeddings.create({
            model: 'mistral-embed',
            inputs: [text],
        });

        return embeddingResponse.data[0].embedding;
    } catch (error) {
        console.error('❌ Erreur lors de la génération de l\'embedding:', error);
        throw error;
    }
}

/**
 * Générer des embeddings pour plusieurs textes
 * @param {Array<string>} texts - Liste de textes
 */
export async function generateEmbeddings(texts) {
    try {
        const embeddingResponse = await mistral.embeddings.create({
            model: 'mistral-embed',
            inputs: texts,
        });

        return embeddingResponse.data.map(item => item.embedding);
    } catch (error) {
        console.error('❌ Erreur lors de la génération des embeddings:', error);
        throw error;
    }
}

/**
 * Créer un texte de recherche pour un produit
 * @param {Object} product - Produit
 */
export function createProductSearchText(product) {
    return `${product.name}. ${product.description}. Catégorie: ${product.category}. Prix: ${product.price}€`;
}
