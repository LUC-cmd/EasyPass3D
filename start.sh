#!/bin/bash
cd "$(dirname "$0")"

echo "🚀 Démarrage d'EasyPass 3D..."
echo ""
echo "📦 Backend: npm run server"
echo "🎨 Frontend: cd client && npm start"
echo ""

# Start backend
echo "⚙️ Démarrage du backend sur port 5000..."
npm run server &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 3

# Start frontend
echo "🎨 Démarrage du frontend sur port 3000..."
cd client
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Tous les serveurs ont démarré!"
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""

# Wait for both
wait $BACKEND_PID $FRONTEND_PID
