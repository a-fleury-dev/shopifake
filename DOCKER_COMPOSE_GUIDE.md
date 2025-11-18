# Organisation des Docker Compose

## 📁 Structure actuelle

```
shopifake/
├── docker-compose.yml                          # 🎯 PRODUCTION - Tous les services
├── .env.example
└── backend/
    ├── chatbot-service/
    │   ├── docker-compose.dev.yml             # 🔧 DEV LOCAL - Chatbot seul
    │   └── ...
    └── api-gateway/
        ├── docker-compose.yml                 # ⚠️ À renommer aussi ?
        └── ...
```

## 🎯 Utilisation

### Pour le développement d'UN microservice spécifique

```bash
# Développer uniquement le chatbot-service
cd backend/chatbot-service
docker-compose -f docker-compose.dev.yml up -d
npm run dev
```

### Pour déployer TOUS les services (Production/Test complet)

```bash
# À la racine du projet
docker-compose up -d
```

## 📝 Règles

1. **docker-compose.yml (racine)** = Production et intégration complète
   - Tous les microservices
   - Tous les services partagés (bases de données, etc.)
   - Réseau unifié
   - Variables d'environnement centralisées

2. **docker-compose.dev.yml (dans chaque service)** = Développement isolé
   - Uniquement les dépendances du service
   - Pour développer/tester un service individuellement
   - Ports locaux

## ✅ Avantages de cette organisation

- 🔧 **Dev local rapide** : Démarrer uniquement ce dont vous avez besoin
- 🚀 **Production simple** : Un seul fichier à la racine
- 🧪 **Tests d'intégration** : Le docker-compose racine teste tout ensemble
- 👥 **Équipe** : Chacun peut travailler sur son service indépendamment

## 🔄 Migration recommandée

Pour uniformiser, vous devriez aussi renommer :
```bash
mv backend/api-gateway/docker-compose.yml backend/api-gateway/docker-compose.dev.yml
```

Et mettre à jour la documentation de chaque service.
