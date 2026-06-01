class TrafficSimulation {
  constructor() {
    this.vehicles = [];
    this.intersections = this.initIntersections();
    this.metrics = this.initMetrics();
    this.time = 0;
    this.initVehicles();
  }

  initIntersections() {
    return [
      { id: 'main', name: 'Carrefour Principal', lanes: 4, position: [0, 0], trafficDensity: 0.5 },
      { id: 'north', name: 'Route Nord', lanes: 2, position: [0, 1], trafficDensity: 0.4 },
      { id: 'south', name: 'Route Sud', lanes: 2, position: [0, -1], trafficDensity: 0.3 },
      { id: 'east', name: 'Route Est', lanes: 3, position: [1, 0], trafficDensity: 0.6 },
      { id: 'west', name: 'Route Ouest', lanes: 3, position: [-1, 0], trafficDensity: 0.5 }
    ];
  }

  initMetrics() {
    return {
      avgWaitTime: 87,
      co2Emissions: 100,
      throughput: 1200,
      emergencyDelay: 0,
      systemResponseTime: 250,
      energyConsumption: 100,
      vehicleCount: 145,
      congestionLevel: 65
    };
  }

  initVehicles() {
    const types = ['taxi', 'minibus', 'car', 'truck'];
    const count = Math.floor(Math.random() * 50) + 80;

    for (let i = 0; i < count; i++) {
      this.vehicles.push({
        id: `v_${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        lane: Math.floor(Math.random() * 4),
        progress: Math.random(),
        speed: Math.random() * 0.8 + 0.2,
        waitTime: Math.random() * 60,
        intersectionId: this.intersections[Math.floor(Math.random() * this.intersections.length)].id
      });
    }
  }

  update(state) {
    this.time++;

    // Ajuster la densité basée sur le scénario
    const densityMultiplier = this.getScenarioDensityMultiplier(state.scenario) * state.trafficIntensity;

    // Simuler le flux de trafic
    this.vehicles.forEach(vehicle => {
      const intersection = this.intersections.find(i => i.id === vehicle.intersectionId);

      // Augmenter/réduire le temps d'attente selon le contexte
      if (Math.random() < 0.1) {
        vehicle.progress += (vehicle.speed * 0.05) * densityMultiplier;
      }

      if (vehicle.progress >= 1) {
        vehicle.progress = 0;
        vehicle.waitTime = 0;
        vehicle.intersectionId = this.intersections[Math.floor(Math.random() * this.intersections.length)].id;
      } else {
        vehicle.waitTime += (1 - densityMultiplier * 0.5);
      }
    });

    // Mettre à jour les intersections
    this.intersections.forEach(intersection => {
      const vehiclesHere = this.vehicles.filter(v => v.intersectionId === intersection.id).length;
      intersection.trafficDensity = Math.min(1, vehiclesHere / (intersection.lanes * 20));
    });

    // Calculer les métriques
    this.updateMetrics(state);
  }

  updateMetrics(state) {
    const avgWait = this.vehicles.reduce((sum, v) => sum + v.waitTime, 0) / this.vehicles.length;

    // Baseline: 87 secondes
    let baselineWait = 87;
    let optimizationFactor = 1;

    // Impact du scénario
    switch (state.scenario) {
      case 'rush':
        optimizationFactor = 0.6;
        baselineWait = 200;
        break;
      case 'normal':
        optimizationFactor = 0.39;
        baselineWait = 87;
        break;
      case 'incident':
        optimizationFactor = 0.45;
        baselineWait = 150;
        break;
      case 'pluie':
        optimizationFactor = 0.5;
        baselineWait = 110;
        break;
      case 'nuit':
        optimizationFactor = 0.85;
        baselineWait = 30;
        break;
      case 'evenement':
        optimizationFactor = 0.55;
        baselineWait = 130;
        break;
    }

    // Impact de la météo
    if (state.weatherCondition === 'rain') {
      optimizationFactor *= 0.9;
      baselineWait *= 1.2;
    } else if (state.weatherCondition === 'night') {
      baselineWait *= 0.5;
    }

    // Mode urgence
    if (state.emergencyMode) {
      optimizationFactor *= 1.2; // Feux verts prioritaires
    }

    this.metrics = {
      avgWaitTime: Math.round(baselineWait * optimizationFactor),
      co2Emissions: Math.round(100 * optimizationFactor * (1 + (state.trafficIntensity - 1) * 0.3)),
      throughput: Math.round(1200 + (state.trafficIntensity - 1) * 400),
      emergencyDelay: state.emergencyMode ? Math.random() * 30 : Math.random() * 200,
      systemResponseTime: 100 + Math.random() * 100,
      energyConsumption: Math.round(100 * optimizationFactor),
      vehicleCount: Math.floor(this.vehicles.length * state.trafficIntensity),
      congestionLevel: Math.round(65 * state.trafficIntensity)
    };
  }

  getScenarioDensityMultiplier(scenario) {
    const multipliers = {
      'normal': 1,
      'rush': 4,
      'incident': 2.5,
      'pluie': 1.5,
      'nuit': 0.3,
      'evenement': 2
    };
    return multipliers[scenario] || 1;
  }

  getMetrics() {
    return {
      ...this.metrics,
      vehicleCount: this.vehicles.length,
      intersections: this.intersections.map(i => ({
        id: i.id,
        name: i.name,
        density: i.trafficDensity,
        waitTime: Math.round(this.metrics.avgWaitTime * (1 + i.trafficDensity))
      }))
    };
  }

  getVehiclesData() {
    return this.vehicles.map(v => ({
      ...v,
      position: this.calculatePosition(v)
    }));
  }

  calculatePosition(vehicle) {
    const intersection = this.intersections.find(i => i.id === vehicle.intersectionId);
    const baseX = intersection.position[0] * 100;
    const baseY = intersection.position[1] * 100;
    const laneOffset = (vehicle.lane - 1.5) * 10;

    return [
      baseX + laneOffset + vehicle.progress * 40,
      baseY + Math.sin(this.time * 0.05) * 5,
      0
    ];
  }
}

module.exports = { TrafficSimulation };
