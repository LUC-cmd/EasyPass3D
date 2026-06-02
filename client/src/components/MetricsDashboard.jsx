import React from 'react';

function MetricsDashboard({ metrics, state }) {
  if (!metrics) {
    return (
      <div className="h-1/2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 p-4 flex items-center justify-center">
        <p className="text-gray-400">En attente des données...</p>
      </div>
    );
  }

  const metricCard = (label, value, unit, icon, color) => (
    <div className="bg-slate-700 rounded-lg p-3 border border-slate-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs">{label}</p>
          <p className={`text-lg font-bold ${color}`}>{value} {unit}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="h-1/2 bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 sticky top-0">
        <h2 className="text-lg font-bold text-white">📊 Métriques</h2>
        <p className="text-green-100 text-xs">
          Scénario: <span className="font-bold">{state?.scenario || 'N/A'}</span> |
          Météo: <span className="font-bold">{state?.weatherCondition || 'N/A'}</span>
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 space-y-2">
        {metricCard(
          'Temps d\'attente moyen',
          metrics.avgWaitTime,
          's',
          '⏱️',
          'text-cyan-400'
        )}

        {metricCard(
          'Émissions CO2',
          metrics.co2Emissions,
          '%',
          '🌍',
          'text-red-400'
        )}

        {metricCard(
          'Capacité',
          metrics.throughput,
          'véh/h',
          '🚗',
          'text-yellow-400'
        )}

        {metricCard(
          'Délai urgence',
          metrics.emergencyDelay,
          's',
          '🚑',
          'text-orange-400'
        )}

        {metricCard(
          'Temps réponse',
          metrics.systemResponseTime,
          'ms',
          '⚡',
          'text-purple-400'
        )}

        {metricCard(
          'Consommation énergie',
          metrics.energyConsumption,
          '%',
          '🔋',
          'text-green-400'
        )}

        {metricCard(
          'Nb véhicules',
          metrics.vehicleCount,
          '',
          '🚕',
          'text-blue-400'
        )}

        {metricCard(
          'Congestion',
          metrics.congestionLevel,
          '%',
          '🚨',
          'text-red-500'
        )}

        {/* State Info */}
        <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 mt-4">
          <p className="text-gray-400 text-xs mb-2">État</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Intensité trafic:</span>
              <span className="text-white font-semibold">{(state?.trafficIntensity * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Mode urgence:</span>
              <span className={state?.emergencyMode ? 'text-red-400 font-semibold' : 'text-gray-500'}>
                {state?.emergencyMode ? '🚨 ACTIF' : '● Inactif'}
              </span>
            </div>
          </div>
        </div>

        {/* Intersections */}
        {metrics.intersections && metrics.intersections.length > 0 && (
          <div className="bg-slate-700 rounded-lg p-3 border border-slate-600 mt-4">
            <p className="text-gray-400 text-xs mb-2">Intersections</p>
            <div className="space-y-1 text-xs">
              {metrics.intersections.map((inter) => (
                <div key={inter.id} className="flex justify-between">
                  <span className="text-gray-400">{inter.name}:</span>
                  <div className="flex gap-2">
                    <span className="text-blue-400">{(inter.density * 100).toFixed(0)}% dense</span>
                    <span className="text-cyan-400">{inter.waitTime}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricsDashboard;
