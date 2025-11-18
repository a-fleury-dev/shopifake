import axios from 'axios';

const CHATBOT_SERVICE_URL = 'http://localhost:3000';

// Test 1: Créer un nouveau produit
async function testCreateProduct() {
    console.log('\n📝 Test 1: Création d\'un nouveau produit via webhook\n');

    const newProduct = {
        event: 'created',
        product: {
            id: 999,
            name: 'Test Webhook Nike Revolution',
            description: 'Chaussures de running Nike Revolution pour test webhook avec semelle ultra confortable',
            price: 79.99,
            category: 'Running',
            style: 'Sport',
            color: 'Bleu et Blanc',
            size: [39, 40, 41, 42, 43, 44],
            stock: 50,
            brand: 'Nike',
            image: '/images/test-nike.jpg'
        }
    };

    try {
        const response = await axios.post(`${CHATBOT_SERVICE_URL}/webhook/product`, newProduct);
        console.log('✅ Réponse:', response.data);
        console.log(`   Produit "${newProduct.product.name}" indexé avec succès!\n`);
        return true;
    } catch (error) {
        console.error('❌ Erreur:', error.response?.data || error.message);
        return false;
    }
}

// Test 2: Mettre à jour un produit existant
async function testUpdateProduct() {
    console.log('\n📝 Test 2: Mise à jour d\'un produit existant\n');

    const updatedProduct = {
        event: 'updated',
        product: {
            id: 999,
            name: 'Test Webhook Nike Revolution v2',
            description: 'Chaussures de running Nike Revolution MISE À JOUR avec nouvelle technologie de semelle',
            price: 89.99, // Prix modifié
            category: 'Running',
            style: 'Sport',
            color: 'Noir et Orange', // Couleur modifiée
            size: [38, 39, 40, 41, 42, 43, 44, 45], // Tailles ajoutées
            stock: 30, // Stock modifié
            brand: 'Nike',
            image: '/images/test-nike-v2.jpg'
        }
    };

    try {
        const response = await axios.post(`${CHATBOT_SERVICE_URL}/webhook/product`, updatedProduct);
        console.log('✅ Réponse:', response.data);
        console.log(`   Produit mis à jour avec succès!\n`);
        return true;
    } catch (error) {
        console.error('❌ Erreur:', error.response?.data || error.message);
        return false;
    }
}

// Test 3: Vérifier que le produit est trouvé par le chatbot
async function testChatbotSearch() {
    console.log('\n📝 Test 3: Recherche du produit via le chatbot\n');

    try {
        const response = await axios.post(`${CHATBOT_SERVICE_URL}/chat`, {
            message: 'Je cherche des Nike Revolution',
            conversationHistory: []
        });

        console.log('🤖 Réponse du chatbot:', response.data.response);
        console.log('\n📦 Produits trouvés:');
        response.data.products.forEach((product, idx) => {
            console.log(`   ${idx + 1}. ${product.name} - ${product.price}€`);
        });
        console.log('');
        return true;
    } catch (error) {
        console.error('❌ Erreur:', error.response?.data || error.message);
        return false;
    }
}

// Test 4: Supprimer le produit
async function testDeleteProduct() {
    console.log('\n📝 Test 4: Suppression du produit\n');

    try {
        const response = await axios.delete(`${CHATBOT_SERVICE_URL}/webhook/product/999`);
        console.log('✅ Réponse:', response.data);
        console.log('   Produit supprimé avec succès!\n');
        return true;
    } catch (error) {
        console.error('❌ Erreur:', error.response?.data || error.message);
        return false;
    }
}

// Test 5: Vérifier que le produit n'est plus trouvé
async function testProductNotFound() {
    console.log('\n📝 Test 5: Vérification que le produit n\'est plus trouvé\n');

    try {
        const response = await axios.post(`${CHATBOT_SERVICE_URL}/chat`, {
            message: 'Je cherche des Nike Revolution',
            conversationHistory: []
        });

        const productFound = response.data.products.some(p => p.id === 999);

        if (!productFound) {
            console.log('✅ Le produit supprimé n\'apparaît plus dans les résultats');
        } else {
            console.log('⚠️ Le produit supprimé apparaît encore dans les résultats');
        }

        console.log('\n🤖 Réponse du chatbot:', response.data.response);
        console.log('');
        return !productFound;
    } catch (error) {
        console.error('❌ Erreur:', error.response?.data || error.message);
        return false;
    }
}

// Attendre un peu entre les tests
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Exécuter tous les tests
async function runAllTests() {
    console.log('🚀 Démarrage des tests webhooks\n');
    console.log('='.repeat(80));

    const results = {
        create: false,
        update: false,
        search: false,
        delete: false,
        verify: false
    };

    try {
        // Test création
        results.create = await testCreateProduct();
        await wait(3000);

        // Test mise à jour
        results.update = await testUpdateProduct();
        await wait(3000);

        // Test recherche
        results.search = await testChatbotSearch();
        await wait(3000);

        // Test suppression
        results.delete = await testDeleteProduct();
        await wait(2000);

        // Test vérification
        results.verify = await testProductNotFound();

        // Résumé
        console.log('='.repeat(80));
        console.log('\n📊 RÉSUMÉ DES TESTS\n');
        console.log(`   ${results.create ? '✅' : '❌'} Création de produit`);
        console.log(`   ${results.update ? '✅' : '❌'} Mise à jour de produit`);
        console.log(`   ${results.search ? '✅' : '❌'} Recherche par le chatbot`);
        console.log(`   ${results.delete ? '✅' : '❌'} Suppression de produit`);
        console.log(`   ${results.verify ? '✅' : '❌'} Vérification de la suppression`);

        const allPassed = Object.values(results).every(r => r === true);

        if (allPassed) {
            console.log('\n🎉 TOUS LES TESTS SONT PASSÉS!\n');
        } else {
            console.log('\n⚠️ Certains tests ont échoué\n');
        }

    } catch (error) {
        console.error('\n❌ ERREUR LORS DES TESTS:', error.message);
    }
}

// Lancer les tests
runAllTests();
