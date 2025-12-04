# Résumé des modifications pour la gestion du stock

## Modifications apportées

### 1. Migrations de base de données

#### V8__add_shop_id_to_products_and_variants.sql
- Ajout de la colonne `shop_id` à la table `products`
- Ajout de la colonne `shop_id` à la table `product_variants`
- Migration des données existantes depuis les catégories
- Ajout des contraintes et index

#### V9__create_stock_actions_table.sql
- Création de la table `stock_actions` pour historiser les actions de stock
- Champs : id, variant_id, sku, action_type (ADD/REMOVE), quantity, created_at
- Index sur variant_id, created_at et sku

### 2. Modèles Java

#### Nouveaux modèles
- **ActionType.java** : Enum avec ADD et REMOVE
- **StockAction.java** : Entité pour l'historique des actions de stock

#### Modèles mis à jour
- **Product.java** : Ajout du champ `shopId`
- **ProductVariant.java** : Ajout du champ `shopId`

### 3. DTOs

#### Nouveaux DTOs
- **StockActionRequest** : Pour effectuer une action de stock (sku, actionType, quantity)
- **StockActionDto** : Pour retourner une action de stock
- **StockSummaryDto** : Pour le résumé du stock (totalUnits, totalValue, recentActions)

#### DTOs mis à jour
- **ProductDto** : Ajout du champ `shopId`
- **ProductVariantDto** : Ajout du champ `shopId`
- **CreateProductRequest** : Ajout du champ `shopId`
- **CreateProductVariantRequest** : Ajout du champ `shopId`

### 4. Repositories

#### Nouveau repository
- **StockActionRepository** : avec méthode `findRecentByShopId()`

#### Repository mis à jour
- **ProductVariantRepository** : 
  - `sumStockByShopId()` : Somme totale des unités en stock
  - `sumStockValueByShopId()` : Valeur totale du stock (stock × prix)

### 5. Services

#### Nouveau service
- **StockService** :
  - `performStockAction()` : Effectue une action ADD ou REMOVE sur un variant
  - `getStockSummary()` : Retourne le résumé du stock d'une boutique
  - Validation : pas de stock négatif possible

#### Services mis à jour
- **ProductService** : Ajout du `shopId` lors de la création de produits
- **ProductVariantService** : Ajout du `shopId` lors de la création de variants

### 6. Controllers

#### Nouveau controller
- **StockController** (`/api/shops/{shopId}/stock`) :
  - `GET /summary` : Récupère le résumé du stock (totalUnits, totalValue, recentActions)
  - `POST /action` : Effectue une action de stock (ADD/REMOVE)

### 7. Mappers

- **ProductMapper** : Inclusion du `shopId` dans le DTO
- **ProductVariantMapper** : Inclusion du `shopId` dans le DTO

### 8. Seeds de développement

#### Fichiers mis à jour
- **V102__seed_dev_products.sql** : Ajout du `shop_id` dans tous les INSERT
- **V104__seed_dev_product_variants.sql** : Ajout du `shop_id` dans tous les INSERT

## Endpoints disponibles

### Gestion du stock

```
GET /api/shops/{shopId}/stock/summary
```
Retourne :
```json
{
  "totalUnits": 1245,
  "totalValue": 125489.50,
  "recentActions": [
    {
      "id": 1,
      "sku": "TSHIRT-RUN-PRO-S-BLK",
      "actionType": "ADD",
      "quantity": 50,
      "createdAt": "2025-12-04T10:30:00Z"
    }
  ]
}
```

```
POST /api/shops/{shopId}/stock/action
```
Body :
```json
{
  "sku": "TSHIRT-RUN-PRO-S-BLK",
  "actionType": "ADD",
  "quantity": 10
}
```

## Utilisation pour le front-end

### Dashboard Stock
Le front peut appeler `GET /api/shops/{shopId}/stock/summary` pour afficher :
- **Nombre total d'unités en stock** : `totalUnits`
- **Valeur totale du stock** : `totalValue`
- **Historique des actions** : `recentActions` (liste des 20 dernières actions)
  - SKU du variant
  - Type d'action (ADD en vert, REMOVE en rouge)
  - Quantité
  - Date de l'action

### Gestion du stock
Le front peut appeler `POST /api/shops/{shopId}/stock/action` pour :
- Ajouter du stock (actionType: "ADD")
- Retirer du stock (actionType: "REMOVE")

Le backend :
- Crée automatiquement une entrée dans `stock_actions`
- Met à jour le stock du variant
- Bloque les retraits si la quantité dépasse le stock actuel

## Notes

- Tous les shops ont un ID cohérent :
  - Shop 1 : Sport Elite (shop_id = 1)
  - Shop 2 : Bijoux de Luxe (shop_id = 2)
  - Shop 3 : Tech & Informatique Pro (shop_id = 3)
- Les migrations sont ordonnées correctement
- Les seeds incluent directement le `shop_id` pour plus de lisibilité

