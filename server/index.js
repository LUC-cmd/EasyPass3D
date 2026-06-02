const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Anthropic = require('@anthropic-ai/sdk');
const { TrafficSimulation } = require('./simulation');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://easypass3d-seic.netlify.app',
  process.env.FRONTEND_URL,
  /\.netlify\.app$/,   // tout sous-domaine Netlify
  /\.onrender\.com$/   // preview Render
].filter(Boolean);

const io = socketIo(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// Health check pour Render
app.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

const client = new Anthropic();
const simulation = new TrafficSimulation();

// État de la simulation
let simulationState = {
  running: false,
  scenario: 'normal',
  trafficIntensity: 1.0,
  weatherCondition: 'clear',
  emergencyMode: false,
  timestamp: Date.now()
};

// Stockage des conversations par session
const conversationHistory = new Map();

// Endpoints API
app.get('/api/status', (req, res) => {
  res.json({
    simulation: simulationState,
    metrics: simulation.getMetrics()
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, []);
    }

    const history = conversationHistory.get(sessionId);
    const systemPrompt = `Tu es un assistant de contrôle pour EasyPass 3D, une plateforme de simulation de trafic urbain intelligent.

État actuel:
- Scénario: ${simulationState.scenario}
- Intensité trafic: ${(simulationState.trafficIntensity * 100).toFixed(0)}%
- Condition météo: ${simulationState.weatherCondition}
- Mode urgence: ${simulationState.emergencyMode ? 'ACTIF' : 'inactif'}

Tu peux:
1. Modifier le scénario (normal, rush, incident, pluie, nuit, événement)
2. Ajuster l'intensité du trafic (0-200%)
3. Changer la météo (clear, rain, fog, night)
4. Activer/désactiver mode urgence
5. Expliquer les métriques (temps d'attente, émissions, capacité)
6. Comparer des stratégies d'optimisation

Réponds toujours avec une explication claire et propose des commandes concrètes.`;

    history.push({
      role: 'user',
      content: message
    });

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: history
    });

    const assistantMessage = response.content[0].text;
    history.push({
      role: 'assistant',
      content: assistantMessage
    });

    // Parser les commandes dans la réponse
    const commands = parseCommands(message, assistantMessage);
    if (commands.length > 0) {
      applyCommands(commands);
    }

    res.json({
      response: assistantMessage,
      commands: commands,
      newState: simulationState
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// WebSocket pour mise à jour temps réel
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  socket.emit('init', {
    state: simulationState,
    metrics: simulation.getMetrics()
  });

  socket.on('start', () => {
    simulationState.running = true;
    startSimulation();
    io.emit('simulation:started');
  });

  socket.on('stop', () => {
    simulationState.running = false;
    io.emit('simulation:stopped');
  });

  socket.on('command', (cmd) => {
    applyCommands([cmd]);
    io.emit('state:update', simulationState);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// Boucle de simulation
let simulationInterval;
function startSimulation() {
  if (simulationInterval) clearInterval(simulationInterval);

  simulationInterval = setInterval(() => {
    if (simulationState.running) {
      simulation.update(simulationState);
      const metrics = simulation.getMetrics();

      io.emit('metrics:update', {
        ...metrics,
        timestamp: Date.now()
      });

      simulationState.timestamp = Date.now();
    }
  }, 100); // 10 fps
}

// Parser les intentions de commandes
function parseCommands(userMessage, assistantResponse) {
  const commands = [];
  const fullText = (userMessage + ' ' + assistantResponse).toLowerCase();

  if (fullText.includes('rush') || fullText.includes('heure de pointe')) {
    commands.push({ type: 'scenario', value: 'rush' });
  } else if (fullText.includes('pluie') || fullText.includes('rain')) {
    commands.push({ type: 'weather', value: 'rain' });
  } else if (fullText.includes('incident') || fullText.includes('accident')) {
    commands.push({ type: 'scenario', value: 'incident' });
  } else if (fullText.includes('normal') || fullText.includes('nominal')) {
    commands.push({ type: 'scenario', value: 'normal' });
  } else if (fullText.includes('nuit') || fullText.includes('night')) {
    commands.push({ type: 'weather', value: 'night' });
  } else if (fullText.includes('urgence') || fullText.includes('emergency')) {
    commands.push({ type: 'emergency', value: true });
  } else if (fullText.includes('arrête') || fullText.includes('désactive')) {
    commands.push({ type: 'emergency', value: false });
  }

  // Parser les pourcentages
  const percentMatch = fullText.match(/(\d+)\s*%/);
  if (percentMatch) {
    commands.push({ type: 'intensity', value: parseInt(percentMatch[1]) / 100 });
  }

  return commands;
}

function applyCommands(commands) {
  for (const cmd of commands) {
    switch (cmd.type) {
      case 'scenario':
        simulationState.scenario = cmd.value;
        break;
      case 'weather':
        simulationState.weatherCondition = cmd.value;
        break;
      case 'intensity':
        simulationState.trafficIntensity = Math.min(2, Math.max(0, cmd.value));
        break;
      case 'emergency':
        simulationState.emergencyMode = cmd.value;
        break;
    }
  }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur EasyPass 3D lancé sur http://localhost:${PORT}`);
});
