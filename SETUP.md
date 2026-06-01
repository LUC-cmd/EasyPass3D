# 🚀 Setup Complet - EasyPass 3D

Guide complet pour configurer et lancer EasyPass 3D sur ta machine.

---

## 1️⃣ Prérequis

Vérifie que tu as installé:

```bash
# Node.js (v16+)
node --version

# npm (v8+)
npm --version

# Python (v3.7+) - pour serveur HTTP
python --version
```

Si manquant, télécharge de:
- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)

---

## 2️⃣ Clé API Claude

### Obtiens ta clé

1. Va sur [console.anthropic.com](https://console.anthropic.com)
2. Crée un compte (gratuit)
3. Clique sur **"API Keys"** dans le menu
4. **Create Key** → Copie la clé (elle commence par `sk-ant-`)
5. ⚠️ **Sauve-la quelque part** (tu ne pourras pas la revoir!)

### Configure-la

```bash
# Dans le dossier EasyPass3D, crée un fichier .env
echo "ANTHROPIC_API_KEY=sk-ant-your_key_here_12345" > .env
```

Ou édite `.env` directement:
```
PORT=5000
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXXXX
REACT_APP_API_URL=http://localhost:5000
```

---

## 3️⃣ Installation des dépendances

### Backend
```bash
cd EasyPass3D
npm install
```

### Frontend (optionnel - pour version React complète)
```bash
cd client
npm install
```

---

## 4️⃣ Lancement

### Option A: MVP Simple (Recommandé pour démarrer)

**Terminal 1 - Backend:**
```bash
cd EasyPass3D
npm run server
```

Tu devrais voir:
```
🚀 Serveur EasyPass 3D lancé sur http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd EasyPass3D/public
python -m http.server 3000
```

Tu devrais voir:
```
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/) ...
```

**Ouvre ton navigateur:**
```
http://localhost:3000
```

---

### Option B: Full React (Quand npm install est complet)

**Terminal 1:**
```bash
cd EasyPass3D
npm run server
```

**Terminal 2:**
```bash
cd EasyPass3D/client
npm start
```

Le navigateur va ouvrir automatiquement sur `http://localhost:3000`

---

### Option C: Dual mode (Recommandé long terme)

À la racine du projet:
```bash
npm run dev
```

Cela lance les deux serveurs en parallèle avec `concurrently`.

---

## 5️⃣ Vérification

Quand tout tourne, teste:

```bash
# Backend alive?
curl http://localhost:5000/api/status

# Frontend accessible?
curl http://localhost:3000
```

Tu devrais voir du HTML/JSON comme réponse.

---

## 6️⃣ Premier test

1. **Ouvre** http://localhost:3000 dans ton navigateur
2. **Clique** sur "▶ Démarrer"
3. **Attends** 2-3 secondes pour que la simulation démarre
4. **Essaie** une commande dans le chat:

```
"Active le scénario rush"
```

Tu devrais voir:
- ✅ Réponse de Claude
- ✅ Visualisation 3D change
- ✅ Métriques se mettent à jour

---

## 🐛 Troubleshooting

### "Port 5000/3000 already in use"

```bash
# Trouver quel processus utilise le port
lsof -i :5000
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou change le port dans .env
PORT=5001
```

### "ANTHROPIC_API_KEY is not set"

```bash
# Vérifier que .env existe
ls -la .env

# Vérifier que la clé est dedans
cat .env

# Relancer le backend
npm run server
```

### "WebSocket connection failed"

- Vérifier que le backend tourne: `curl http://localhost:5000/api/status`
- Vérifier la console du navigateur (F12 → Console)
- Vérifier qu'il n'y a pas de firewall bloquant

### "Three.js not found"

Pour la version HTML simple, Three.js se charge depuis CDN. Vérifier la connexion internet.

Pour React, réinstaller les dépendances:
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### "npm install échoue"

```bash
# Nettoyer le cache npm
npm cache clean --force

# Réinstaller avec flag legacy
npm install --legacy-peer-deps
```

---

## 📊 Structure attendue

```
EasyPass3D/
├── .env                      # ← Fichier À CRÉER avec ta clé API
├── package.json
├── README.md
├── CHAT_GUIDE.md
├── SETUP.md (ce fichier)
├── server/
│   ├── index.js             # Backend principal
│   └── simulation.js         # Moteur simulation
├── public/
│   └── index.html           # Frontend MVP
├── client/                  # (optionnel) React version
│   ├── package.json
│   ├── public/
│   ├── src/
│   └── node_modules/
└── node_modules/
```

---

## 🎯 Prochaines étapes

### Pour l'améliorer:

1. **Ajouter plus de scénarios**  
   → Édite `server/simulation.js`, fonction `getScenarioDensityMultiplier()`

2. **Personnaliser l'interface 3D**  
   → Édite `public/index.html`, section `initScene()`

3. **Ajouter des métriques**  
   → Ajoute au `updateMetrics()` dans `simulation.js`

4. **Passer à React complet**  
   → `cd client && npm start` quand `npm install` est fini

5. **Intégrer des données réelles**  
   → Crée une API qui lit des capteurs/données historiques

---

## 💡 Tips & Tricks

### Lancer avec logs détaillés
```bash
DEBUG=* npm run server
```

### Voir les WebSocket events
F12 → Console → Observe les messages `socket.io`

### Exporter les logs
```bash
npm run server > backend.log 2>&1 &
cd client && npm start > frontend.log 2>&1 &
```

### Développer plus vite
- Modifie `public/index.html` et actualise F5 (pas besoin redémarrer)
- Modifie `server/simulation.js` et redémarre le backend

### Déboguer la simulation
Ajoute des logs dans `server/simulation.js`:
```javascript
console.log('Vehicles:', this.vehicles.length);
console.log('Metrics:', this.metrics);
```

---

## 🔗 Ressources

- **Claude API Docs**: https://docs.anthropic.com
- **Three.js Docs**: https://threejs.org/docs/
- **Socket.io Docs**: https://socket.io/docs/
- **Express Docs**: https://expressjs.com/

---

## 📞 Support

Si tu es bloqué:

1. **Vérifier les logs** (console navigateur F12, ou terminal)
2. **Vérifier la clé API** (commence par `sk-ant-`?)
3. **Vérifier que les ports sont libres** (`curl localhost:5000`)
4. **Relancer les serveurs**

---

## ✅ Checklist de démarrage

- [ ] Node.js et Python installés
- [ ] Clé API Claude obtenue
- [ ] `.env` créé avec la clé API
- [ ] `npm install` complété dans le dossier root
- [ ] Terminal 1: `npm run server` → Vois "lancé sur 5000"
- [ ] Terminal 2: `python -m http.server 3000` → Vois "Serving"
- [ ] Navigateur: `http://localhost:3000` → La page charge
- [ ] Clique "Démarrer" → Simulation commence
- [ ] Chat: Envoie "test" → Claude répond
- [ ] Visualisation 3D: Vois l'intersection et les véhicules

Tout ✅? **Bienvenue dans EasyPass 3D!** 🎉

---

Bon développement! 🚀
