import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Visualization3D from './components/Visualization3D';
import ChatControl from './components/ChatControl';
import MetricsDashboard from './components/MetricsDashboard';
import './index.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [state, setState] = useState({
    scenario: 'normal',
    trafficIntensity: 1.0,
    weatherCondition: 'clear',
    emergencyMode: false
  });
  const [metrics, setMetrics] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      console.log('✅ Connecté au serveur');
    });

    newSocket.on('init', (data) => {
      setState(data.state);
      setMetrics(data.metrics);
    });

    newSocket.on('metrics:update', (data) => {
      setMetrics(data);
      setVehicles(data.vehicles || []);
    });

    newSocket.on('state:update', (newState) => {
      setState(newState);
    });

    newSocket.on('simulation:started', () => {
      setSimulationRunning(true);
    });

    newSocket.on('simulation:stopped', () => {
      setSimulationRunning(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleStartSimulation = () => {
    socket?.emit('start');
  };

  const handleStopSimulation = () => {
    socket?.emit('stop');
  };

  const handleCommand = (cmd) => {
    socket?.emit('command', cmd);
  };

  return (
    <div className="w-full h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">🚦 EasyPass 3D</h1>
            <p className="text-blue-100 text-sm">Simulation Intelligente de Trafic Urbain</p>
          </div>
          <div className="flex gap-3">
            {!simulationRunning ? (
              <button
                onClick={handleStartSimulation}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
              >
                ▶ Démarrer
              </button>
            ) : (
              <button
                onClick={handleStopSimulation}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
              >
                ⏹ Arrêter
              </button>
            )}
            <div className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">
              Status: <span className={simulationRunning ? 'text-green-400' : 'text-red-400'}>
                {simulationRunning ? '▌▌ En cours' : '● Arrêtée'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* 3D Visualization */}
        <div className="flex-1 bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
          <Visualization3D
            state={state}
            metrics={metrics}
            vehicles={vehicles}
            simulationRunning={simulationRunning}
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-96 flex flex-col gap-4 overflow-hidden">
          {/* Chat Control */}
          <ChatControl onCommand={handleCommand} />

          {/* Metrics Dashboard */}
          <MetricsDashboard metrics={metrics} state={state} />
        </div>
      </div>
    </div>
  );
}

export default App;
