"""
Exemple de client pour envoyer des webhooks au service chatbot.
Ce script simule un autre service (comme le main-api) qui notifie 
le chatbot des changements de produits.

Usage:
    python webhook_client_example.py
"""
import requests
import json
from datetime import datetime
from typing import List, Dict, Any


CHATBOT_WEBHOOK_URL = "http://localhost:8080/webhook/product"
CHATBOT_BULK_WEBHOOK_URL = "http://localhost:8080/webhook/products/bulk"


def send_product_created(product: Dict[str, Any]) -> Dict:
    """
    Envoie un événement de création de produit.
    
    Args:
        product: Dictionnaire contenant les infos du produit
        
    Returns:
        La réponse du webhook
    """
    payload = {
        "event": "product.created",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data": product
    }
    
    print(f"📤 Envoi de l'événement 'product.created' pour: {product['title']}")
    response = requests.post(CHATBOT_WEBHOOK_URL, json=payload)
    
    if response.status_code == 200:
        print(f"✅ Succès: {response.json()}")
    else:
        print(f"❌ Erreur {response.status_code}: {response.text}")
    
    return response.json()


def send_product_updated(product: Dict[str, Any]) -> Dict:
    """
    Envoie un événement de mise à jour de produit.
    
    Args:
        product: Dictionnaire contenant les infos mises à jour
        
    Returns:
        La réponse du webhook
    """
    payload = {
        "event": "product.updated",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data": product
    }
    
    print(f"📤 Envoi de l'événement 'product.updated' pour: {product['title']}")
    response = requests.post(CHATBOT_WEBHOOK_URL, json=payload)
    
    if response.status_code == 200:
        print(f"✅ Succès: {response.json()}")
    else:
        print(f"❌ Erreur {response.status_code}: {response.text}")
    
    return response.json()


def send_product_deleted(product_id: str, product_title: str) -> Dict:
    """
    Envoie un événement de suppression de produit.
    
    Args:
        product_id: ID du produit supprimé
        product_title: Titre du produit (pour logging)
        
    Returns:
        La réponse du webhook
    """
    payload = {
        "event": "product.deleted",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data": {
            "id": product_id,
            "title": product_title
        }
    }
    
    print(f"📤 Envoi de l'événement 'product.deleted' pour: {product_title}")
    response = requests.post(CHATBOT_WEBHOOK_URL, json=payload)
    
    if response.status_code == 200:
        print(f"✅ Succès: {response.json()}")
    else:
        print(f"❌ Erreur {response.status_code}: {response.text}")
    
    return response.json()


def send_bulk_products(products: List[Dict[str, Any]]) -> Dict:
    """
    Envoie plusieurs produits en une seule requête (synchronisation en masse).
    
    Args:
        products: Liste des produits à synchroniser
        
    Returns:
        La réponse du webhook
    """
    payload = {
        "event": "products.sync",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "data": products
    }
    
    print(f"📤 Envoi de {len(products)} produits en masse")
    response = requests.post(CHATBOT_BULK_WEBHOOK_URL, json=payload)
    
    if response.status_code == 200:
        print(f"✅ Succès: {response.json()}")
    else:
        print(f"❌ Erreur {response.status_code}: {response.text}")
    
    return response.json()


def main():
    """Exemples d'utilisation du webhook"""
    print("="*80)
    print("WEBHOOK CLIENT - EXEMPLES D'UTILISATION")
    print("="*80)
    print()
    
    # Vérifier que le service est accessible
    try:
        health = requests.get("http://localhost:8080/webhook/health")
        if health.status_code == 200:
            print("✅ Service webhook accessible\n")
        else:
            print("❌ Service webhook non accessible")
            return
    except Exception as e:
        print(f"❌ Impossible de contacter le service: {e}")
        return
    
    # Exemple 1: Créer un nouveau produit
    print("\n" + "="*80)
    print("EXEMPLE 1: Création d'un nouveau produit")
    print("="*80)
    new_product = {
        "id": "prod-webhook-001",
        "title": "T-shirt Organic Cotton",
        "description": "T-shirt 100% coton biologique, confortable et écologique",
        "price": 29.99,
        "category": "vetements",
        "image_url": "https://example.com/tshirt.jpg",
        "stock": 50
    }
    send_product_created(new_product)
    
    # Exemple 2: Mettre à jour un produit
    print("\n" + "="*80)
    print("EXEMPLE 2: Mise à jour d'un produit")
    print("="*80)
    updated_product = {
        "id": "prod-webhook-001",
        "title": "T-shirt Organic Cotton - PROMO",
        "description": "T-shirt 100% coton biologique, confortable et écologique. EN PROMOTION!",
        "price": 24.99,  # Prix réduit
        "category": "vetements",
        "image_url": "https://example.com/tshirt.jpg",
        "stock": 45  # Stock diminué
    }
    send_product_updated(updated_product)
    
    # Exemple 3: Supprimer un produit
    print("\n" + "="*80)
    print("EXEMPLE 3: Suppression d'un produit")
    print("="*80)
    send_product_deleted("prod-webhook-001", "T-shirt Organic Cotton - PROMO")
    
    print("\n" + "="*80)
    print("✅ Tous les exemples ont été exécutés")
    print("="*80)


if __name__ == "__main__":
    main()
