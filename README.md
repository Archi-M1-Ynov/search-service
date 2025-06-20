# searcg-service

🔍 Objectif

Microservice de recherche produit avec cache Redis.
Il interroge le product-service si la recherche n’est pas déjà en cache.



⚙️ Prérequis

Node.js + Bun installé
Redis (via Docker ou local)
product-service doit être en ligne


📦 Installation

git clone git@github.com:eshop-backend/search-service.git
cd search-service
bun install


📁 Structure


.env
src/
├── index.js                ← Point d’entrée serveur Express
└── controllers/
    └── searchController.js ← Logique cache + appel product-service
🔐 .env à créer


.env
REDIS_URL=redis://localhost:6379
PRODUCT_SERVICE_URL=http://localhost:4001/products/search


🐳 Lancer Redis avec Docker (si besoin)

docker run -d -p 6379:6379 --name redis-cart redis


🚀 Démarrer le service

bun run dev


🧪 Tester l’API

➕ Rechercher un produit

POST http://localhost:4003/search
Content-Type: application/json

{
  "query": "nutella"
}

🔁 Si trouvé dans Redis → réponse instantanée

❌ Si non trouvé → appel product-service, puis cache du résultat 5 min

🧰 Commandes utiles Redis

redis-cli          # pour entrer dans le shell Redis

KEYS *             # lister les clés
GET search:nutella # afficher le cache pour "nutella"
DEL search:nutella # supprimer une entrée du cache