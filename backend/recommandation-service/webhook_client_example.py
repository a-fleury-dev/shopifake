"""
Example webhook client to simulate product service notifications.
This demonstrates how the product service would call the recommendation service.
"""
import requests
import json

# Configuration
WEBHOOK_URL = "http://localhost:8080/api/v1/webhook/products"
WEBHOOK_SECRET = "your-secret-key"  # Optional, not validated yet

def send_product_created(product_data):
    """Simulate product.created event"""
    event = {
        "event_type": "product.created",
        "product": product_data
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Webhook-Secret": WEBHOOK_SECRET
    }
    
    response = requests.post(WEBHOOK_URL, json=event, headers=headers)
    print(f"✅ Product Created: {response.json()}")
    return response


def send_product_updated(product_data):
    """Simulate product.updated event"""
    event = {
        "event_type": "product.updated",
        "product": product_data
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Webhook-Secret": WEBHOOK_SECRET
    }
    
    response = requests.post(WEBHOOK_URL, json=event, headers=headers)
    print(f"✅ Product Updated: {response.json()}")
    return response


def send_product_deleted(product_id):
    """Simulate product.deleted event"""
    event = {
        "event_type": "product.deleted",
        "product_id": product_id
    }
    
    headers = {
        "Content-Type": "application/json",
        "X-Webhook-Secret": WEBHOOK_SECRET
    }
    
    response = requests.post(WEBHOOK_URL, json=event, headers=headers)
    print(f"✅ Product Deleted: {response.json()}")
    return response


if __name__ == "__main__":
    print("🔔 Testing Webhook Integration\n")
    
    # Test 1: Create a new product
    print("1️⃣ Testing product.created event:")
    new_product = {
        "id": "test_001",
        "title": "Test Product - Wireless Mouse",
        "description": "Ergonomic wireless mouse with precision tracking and long battery life.",
        "tags": ["mouse", "wireless", "computer", "accessory"],
        "price": 29.99,
        "category": "Accessories",
        "image_url": "https://example.com/wireless-mouse.jpg"
    }
    send_product_created(new_product)
    print()
    
    # Test 2: Update the product
    print("2️⃣ Testing product.updated event:")
    updated_product = {
        **new_product,
        "title": "Test Product - Premium Wireless Mouse",
        "price": 39.99
    }
    send_product_updated(updated_product)
    print()
    
    # Test 3: Delete the product
    print("3️⃣ Testing product.deleted event:")
    send_product_deleted("test_001")
    print()
    
    print("✅ All webhook tests completed!")
