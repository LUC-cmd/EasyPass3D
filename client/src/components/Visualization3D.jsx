import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Visualization3D({ state, metrics, vehicles, simulationRunning }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const vehicleObjectsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 150, 200);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create intersection ground
    const groundGeometry = new THREE.PlaneGeometry(400, 400);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a3e });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Road lanes
    const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const createLane = (x, y, w, h) => {
      const lane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), roadMaterial);
      lane.position.set(x, 0.01, y);
      lane.rotation.x = -Math.PI / 2;
      lane.receiveShadow = true;
      scene.add(lane);
    };

    createLane(0, 0, 120, 60); // Horizontal roads
    createLane(0, 0, 60, 120); // Vertical roads

    // Traffic lights
    const createTrafficLight = (x, z) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 40, 8), new THREE.MeshStandardMaterial({ color: 0x444444 }));
      pole.position.set(x, 20, z);
      scene.add(pole);

      const lightGroup = new THREE.Group();
      lightGroup.position.set(x, 35, z);

      const lights = [
        { color: 0xff0000, y: 10 },  // Red
        { color: 0xffff00, y: 0 },   // Yellow
        { color: 0x00ff00, y: -10 }  // Green
      ];

      lights.forEach(light => {
        const lightGeometry = new THREE.CircleGeometry(3, 32);
        const lightMaterial = new THREE.MeshBasicMaterial({ color: light.color });
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.y = light.y;
        lightMesh.userData.baseColor = light.color;
        lightGroup.add(lightMesh);
      });

      scene.add(lightGroup);
      return lightGroup;
    };

    const trafficLights = [
      createTrafficLight(-35, 35),
      createTrafficLight(35, 35),
      createTrafficLight(-35, -35),
      createTrafficLight(35, -35)
    ];

    // Vehicle creation helper
    const createVehicle = (type) => {
      let geometry, color;

      switch (type) {
        case 'taxi':
          geometry = new THREE.BoxGeometry(8, 6, 15);
          color = 0xffff00;
          break;
        case 'minibus':
          geometry = new THREE.BoxGeometry(10, 8, 20);
          color = 0xff6600;
          break;
        case 'truck':
          geometry = new THREE.BoxGeometry(12, 8, 25);
          color = 0xcc0000;
          break;
        default:
          geometry = new THREE.BoxGeometry(8, 6, 15);
          color = 0x0099ff;
      }

      const material = new THREE.MeshPhongMaterial({ color });
      const vehicle = new THREE.Mesh(geometry, material);
      vehicle.castShadow = true;
      vehicle.receiveShadow = true;
      return vehicle;
    };

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (simulationRunning && vehicles && vehicles.length > 0) {
        // Update or create vehicle meshes
        while (vehicleObjectsRef.current.length < vehicles.length) {
          const vehicle = createVehicle(vehicles[vehicleObjectsRef.current.length]?.type || 'car');
          scene.add(vehicle);
          vehicleObjectsRef.current.push(vehicle);
        }

        // Update positions
        vehicles.forEach((vData, idx) => {
          if (vehicleObjectsRef.current[idx]) {
            const mesh = vehicleObjectsRef.current[idx];
            if (vData.position) {
              mesh.position.set(vData.position[0], 3, vData.position[2]);
            }
          }
        });
      }

      // Update traffic light colors based on scenario
      if (state) {
        const colors = state.emergencyMode
          ? [0x00ff00, 0x00ff00, 0xff0000, 0xff0000]
          : [0x00ff00, 0xff0000, 0xff0000, 0x00ff00];

        trafficLights.forEach((light, idx) => {
          light.children.forEach((child, lightIdx) => {
            if (lightIdx === 2) { // Green light
              child.material.color.setHex(colors[idx]);
              child.material.emissive.setHex(colors[idx]);
            }
          });
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [simulationRunning, state, vehicles]);

  return <div ref={containerRef} className="w-full h-full" />;
}

export default Visualization3D;
