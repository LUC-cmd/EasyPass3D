# ⚡ Quick Start - 5 minutes

Lance EasyPass 3D en 5 minutes! 🚀

---

## Étape 1: Clé API (1 min)

```bash
# Va ici: https://console.anthropic.com/keys
# Crée une clé → Copie-la
# Crée un fichier .env:

echo "ANTHROPIC_API_KEY=sk-ant-paste_your_key_here" > .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env
```

---

## Étape 2: Installation (2 min)

```bash
# Dans le dossier EasyPass3D
cd EasyPass3D
npm install
```

---

## Étape 3: Démarrage (2 min)

### Terminal 1 - Backend
```bash
npm run server
```

Attend de voir:
```
🚀 Serveur EasyPass 3D lancé sur http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd public
python -m http.server 3000
```

Attend de voir:
```
Serving HTTP on port 3000
```

---

## Étape 4: Visite l'app!

```
http://localhost:3000
```

Tu dois voir:
- 🎨 Intersection 3D
- 💬 Chat conversationnel
- 📊 Dashboard métriques

---

## 🎮 Essaie une commande!

Clique le bouton **"▶ Démarrer"**, puis dans le chat écris:

```
"Active le scénario rush"
```

Tu devrais voir:
- ✅ Claude répond
- ✅ La 3D change
- ✅ Les métriques se mettent à jour

---

## 🚀 Autres commandes rapides

```
"Pluie intense"
"Mode urgence"
"Augmente le trafic de 80%"
"Quel est l'impact sur les émissions?"
```

---

## 📚 Docs complètes

- **README.md** - Vue d'ensemble complet
- **SETUP.md** - Installation détaillée + troubleshooting
- **CHAT_GUIDE.md** - Guide complet du chat Claude

---

## 🆘 Ça ne marche pas?

### Port occupé?
```bash
lsof -i :5000
kill -9 <PID>
npm run server  # Redémarre
```

### Clé API invalide?
Vérifier dans `.env`:
```bash
cat .env
```

La clé doit commencer par `sk-ant-`

### Pas de réponse du chat?
- Vérifier la connexion internet
- Ouvrir F12 → Console pour voir les erreurs
- Relancer le backend

---

## ✅ Checklist

- [ ] `npm install` réussi
- [ ] `.env` créé avec clé API
- [ ] Backend démarre sans erreur
- [ ] Frontend répond sur :3000
- [ ] Première commande chat fonctionne

**Tout ✅?** C'est bon! Tu as EasyPass 3D qui tourne! 🎉

---

**Prochaine étape:** Lis `CHAT_GUIDE.md` pour explorer toutes les possibilités du chat!

Bon contrôle! 🚦✨
