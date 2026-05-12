# P_Web-295-Passion-Lecture-Backend
## Lancer le projet
### Prérequis
Lancez le conteneur docker avec MySQL
```sh
docker-compose up -d
```
### Initialisation
1. Copiez l'exemple de .env.example dans .env
   ```sh
   cp .env.example .env
   ```
2. Générez le clé pour l'app
   ```sh
   node ace generate:key
   ```
3. Installez les dépendances
  ```sh
  npm install
   ```
4. Lancez le build
    ```sh
   npm run build
   ```
5. Allez dans le dossier build
```sh
  cd build
```
6. Installez les dépendances
   ```sh
   npm ci --omit="dev"
   ```
7. Lancez le serveur
    ```sh
   node bin/server.js
   ```
8. Faites une migration et seed de la base de données
     ```sh
   node ace migration:fresh  --seed
   ```
Votre API est prête à être utilisée
