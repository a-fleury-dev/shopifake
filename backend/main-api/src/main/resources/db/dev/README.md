# Seeds de développement

Ce dossier contient les seeds de développement pour la base de données.

Les fichiers SQL dans ce dossier seront exécutés par Flyway lors du démarrage de l'application en mode développement.

## Convention de nommage

Les fichiers doivent suivre la convention suivante :
- `V{version}__{description}.sql` pour les migrations
- Les seeds de dev peuvent être nommés avec un préfixe plus élevé pour s'exécuter après les migrations principales

## Exemple

```sql
-- Fichier: V100__seed_dev_users.sql
INSERT INTO users (id, username, email, created_at) 
VALUES 
  (1, 'admin', 'admin@shopifake.com', NOW()),
  (2, 'user', 'user@shopifake.com', NOW());
```

