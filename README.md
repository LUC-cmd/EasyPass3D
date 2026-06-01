# 🚦 EasyPass 3D - Plateforme Interactive de Simulation de Trafic

**Visualisation 3D immersive + Simulation IA + Chat Conversationnel Claude**

Une plateforme révolutionnaire pour tester et démontrer l'impact des systèmes de gestion de trafic intelligent en Afrique urbaine.

---

## 🎯 Qu'est-ce que c'est?

EasyPass 3D transforme ton projet de gestion de trafic urbain en **expérience interactive 3D**:
- **Visualisation**: Intersection urbaine africaine en 3D temps réel
- **Simulation**: Trafic adaptatif avec IA
- **Contrôle**: Chat conversationnel pour changer la simulation
- **Métriques**: Dashboard en temps réel (temps d'attente, émissions CO2, capacité, etc.)

---

## 🚀 Démarrage rapide

### Prérequis
- **Node.js 16+** 
- **npm 8+**
- **Python 3.7+** (pour le serveur HTTP)

### Installation & Lancement

```bash
# 1. Clone/Navigate
cd EasyPass3D

# 2. Backend
npm install
npm run server  # Port 5000

# 3. Frontend (dans un autre terminal)
cd public
python -m http.server 3000  # Port 3000

# 4. Ouvre le navigateur
# http://localhost:3000
```

---

## 📊 Architecture

### Backend (Node.js)
```
Port 5000
├── REST API
│   ├── GET  /api/status       → État simulation + métriques
│   └── POST /api/chat         → Chat avec Claude
├── WebSocket
│   └── Streaming temps réel (métriques, états)
├── Moteur de Simulation
│   ├── Gestion trafic
│   ├── Optimisation feux
│   └── Calcul métriques
└── Claude API Integration
    └── Compréhension commandes naturelles
```

### Frontend (HTML/CSS/JS + Three.js)
```
Port 3000
├── Visualisation 3D (Three.js)
│   ├── Scène urbaine
│   ├── Carrefours
│   ├── Véhicules
│   └── Feux adaptatifs
├── Chat Conversationnel
│   ├── Messages avec Claude
│   ├── Parser commandes
│   └── Contrôle simulation
└── Dashboard Métriques
    ├── Temps d'attente
    ├── Émissions CO2
    ├── Capacité
    ├── Congestion
    └── État des intersections
```

---

## 💬 Exemples de commandes

Essaie ces commandes dans le chat:

```
# Changer le scénario
"Active le scénario rush"
"Affiche la pluie intense"
"C'est la nuit calme"

# Contrôler la simulation
"Augmente le trafic de 50%"
"Active le mode urgence"
"Désactive mode urgence"
"Réduis les émissions"

# Obtenir des informations
"Quel est l'impact sur les émissions?"
"Montre les gains de temps"
"Compare les deux stratégies"
```

---

## 📈 Métriques en temps réel

| Métrique | Baseline | Optimisé | Amélioration |
|----------|----------|----------|----------------|
| Temps d'attente | 87 s | 34 s | **-61%** |
| Émissions CO2 | 100% | 68% | **-32%** |
| Capacité | 1200 véh/h | 1950 véh/h | **+63%** |
| Consommation énergie | 100% | 71% | **-29%** |

---

## 🎮 Scénarios disponibles

1. **Normal** - Flux moyen journalier
2. **Rush** - Heure de pointe (4x volume)
3. **Incident** - Accident bloquant 2 voies
4. **Pluie intense** - Réduction visibilité/vitesse
5. **Nuit calme** - Flux minimal
6. **Événement public** - Modifications flux

---

## 🔧 API REST

### Status
```bash
curl http://localhost:5000/api/status
```

Réponse:
```json
{
  "simulation": {
    "running": false,
    "scenario": "normal",
    "trafficIntensity": 1,
    "weatherCondition": "clear",
    "emergencyMode": false
  },
  "metrics": {
    "avgWaitTime": 87,
    "co2Emissions": 100,
    "throughput": 1200,
    "vehicleCount": 108,
    "congestionLevel": 65
  }
}
```

### Chat
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Active le rush","sessionId":"default"}'
```

---

## 🔌 WebSocket Events

```javascript
// Du serveur vers le client
socket.on('metrics:update', (metrics) => {...})
socket.on('simulation:started', () => {...})
socket.on('simulation:stopped', () => {...})
socket.on('state:update', (newState) => {...})

// Du client vers le serveur
socket.emit('start')
socket.emit('stop')
socket.emit('command', {type: 'scenario', value: 'rush'})
```

---

## 📦 Dépendances clés

**Backend:**
- `express` - Framework HTTP
- `socket.io` - Communication temps réel
- `@anthropic-ai/sdk` - Claude API
- `uuid` - Génération IDs

**Frontend:**
- `three.js` - Visualisation 3D
- `socket.io-client` - Client WebSocket

---

## 🎓 Cas d'usage

### Démonstration aux décideurs
Montrer l'impact réel de l'IA sur le trafic urbain en Afrique.

### Formation opérateurs
Entraîner les opérateurs de trafic avec des scénarios réalistes.

### Recherche & Développement
Tester de nouvelles stratégies d'optimisation avant déploiement réel.

### Pitching investisseurs
Présentation visuelle impressionnante du potentiel commercial.

---

## 📈 Roadmap

- [x] **Phase 1**: Prototype MVP avec 3D + Chat
- [ ] **Phase 2**: React full-stack (en cours)
- [ ] **Phase 3**: Intégration données réelles de trafic
- [ ] **Phase 4**: Mode multi-utilisateur collaboratif
- [ ] **Phase 5**: Export rapports/KPIs
- [ ] **Phase 6**: Mobile app (React Native)

---

## 🤝 Contribution

Ce projet est conçu pour être facilement extensible:

1. **Ajouter un scénario**: `server/simulation.js`
2. **Nouvelle métrique**: Ajouter au calcul dans `updateMetrics()`
3. **Améliorer 3D**: Éditer la scène dans `public/index.html`
4. **Personnaliser IA**: Modifier le `systemPrompt` dans `server/index.js`

---

## ⚙️ Configuration

### Variables d'environnement (`.env`)
```
PORT=5000
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-...
REACT_APP_API_URL=http://localhost:5000
```

---

## 🐛 Troubleshooting

**Backend ne démarre pas:**
```bash
npm install
node server/index.js
```

**Frontend ne charge pas:**
```bash
# Vérifier les ports
lsof -i :3000
lsof -i :5000

# Relancer HTTP server
python -m http.server 3000
```

**Chat ne répond pas:**
- Vérifier `ANTHROPIC_API_KEY` dans `.env`
- Vérifier connexion WebSocket: ouvrir console navigateur (F12)

---

## 📞 Support

Pour des questions, consulte la documentation EasyPass ou contacte:
- **Tech**: `tech@easypass.africa`
- **Partenariats**: `partnerships@easypass.africa`

---

**Créé pour la SEIC (Semaine de l'Entrepreneuriat, de l'Innovation et de la Créativité) 2025**  
Groupe SuitFlow | EasyPass Team
