# App

Ce projet contient une application **Angular** (frontend) et une **API NestJS** (backend), organisées dans deux dossiers :

- **`frontend/`** — Application Angular (générée avec [Angular CLI](https://github.com/angular/angular-cli) 19.2.19)
- **`backend/`** — API NestJS

## Installation

Pour installer toutes les dépendances (frontend et backend), exécutez à la **racine du projet** :

```bash
npm run install:all
```

Ou manuellement :

```bash
cd frontend && npm install
cd ../backend && npm install
```

## Configuration

### Backend (NestJS)

Le fichier `.env` dans le dossier `backend/` doit être configuré avec vos paramètres de base de données et autres variables d'environnement.

**Important** : Modifiez les valeurs JWT_SECRET pour la production !

### Frontend (Angular)

Les fichiers d'environnement sont dans `frontend/src/environment/` et pointent vers `/api/`, redirigé vers le backend via le proxy.

## Développement

### Lancer les deux projets ensemble

À la racine du projet :

```bash
npm run start:all
```

- Backend (NestJS) : `http://localhost:2023`
- Frontend (Angular) : `http://localhost:4200`

### Lancer séparément

**Frontend uniquement :**
```bash
npm start
# ou
cd frontend && npm start
```

**Backend uniquement :**
```bash
npm run start:api
# ou
cd backend && npm run start:dev
```

Ouvrez ensuite `http://localhost:4200/` dans votre navigateur.

## Build

À la racine :

```bash
npm run build       # frontend uniquement
npm run build:api   # backend uniquement
npm run build:all   # les deux
```

Pour le frontend uniquement depuis son dossier :

```bash
cd frontend && npm run build
```

## Tests

```bash
npm test            # tests Angular (depuis la racine)
cd frontend && npm test
```

## Structure du projet

```
app/
├── frontend/       # Application Angular
│   ├── src/
│   ├── angular.json
│   └── package.json
├── backend/        # API NestJS
│   ├── src/
│   └── package.json
├── package.json    # Scripts racine (start:all, install:all, etc.)
└── README.md
```

## Ressources

- [Angular CLI](https://angular.dev/tools/cli)
- [NestJS](https://nestjs.com/)
