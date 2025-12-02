"""
Script to load sample products into the recommendation service.
This populates the Qdrant database with test data.
"""
import json
import requests
from pathlib import Path

# Configuration
API_URL = "http://localhost:8080/api/v1/products/index"
PRODUCTS_FILE = "products.sample.json"

def load_products():
    """Load products from JSON file and index them."""
    # Read the products file
    products_path = Path(__file__).parent / PRODUCTS_FILE
    
    print(f"📂 Reading products from {products_path}")
    with open(products_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"📦 Found {len(data['items'])} products to index")
    
    # Send to API
    print(f"🚀 Sending to {API_URL}")
    response = requests.post(API_URL, json=data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Success! Indexed {result['indexed_count']} products")
        print(f"   {result['message']}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"   {response.text}")

if __name__ == "__main__":
    try:
        load_products()
    except FileNotFoundError:
        print(f"❌ Error: {PRODUCTS_FILE} not found")
    except requests.exceptions.ConnectionError:
        print(f"❌ Error: Cannot connect to {API_URL}")
        print("   Make sure the recommendation service is running")
    except Exception as e:
        print(f"❌ Error: {e}")
