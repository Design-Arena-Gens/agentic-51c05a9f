import * as THREE from 'three';

export function createTimeOfDay(light) {
    const timeline = {
        time: 0,
    };

    function update() {
        timeline.time += 0.001;
        const angle = timeline.time % (Math.PI * 2);
        light.position.x = 10 * Math.cos(angle);
        light.position.y = 20 * Math.sin(angle) + 10;
        
        // Day/Night color
        if(light.position.y < 0) {
            light.intensity = 0.1;
        } else {
            light.intensity = 0.5;
        }
    }

    return { update };
}

export function createSmoke(scene) {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 0.5 - 0.25;
        const y = Math.random() * 5;
        const z = Math.random() * 0.5 - 0.25;
        positions.push(x, y, z);
    }

    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x808080,
        size: 0.2,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
    });

    const smokeParticles = new THREE.Points(particles, particleMaterial);
    smokeParticles.position.set(0, 5, -15); // Chimney of a house
    scene.add(smokeParticles);

    function update() {
        const positions = smokeParticles.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] += 0.01;
            if (positions[i] > 5) {
                positions[i] = 0;
            }
        }
        smokeParticles.geometry.attributes.position.needsUpdate = true;
    }

    return { update };
}
