import { gsap } from 'gsap';

export function createCinematicCamera(camera, controls) {
    const cinematic = {
        points: [
            { position: { x: -32, y: 16, z: -32 }, lookAt: { x: 0, y: 0, z: 0 } },
            { position: { x: 0, y: 32, z: -40 }, lookAt: { x: 0, y: 0, z: 0 } },
            { position: { x: 32, y: 16, z: -32 }, lookAt: { x: 0, y: 0, z: 0 } },
            { position: { x: 0, y: 5, z: 15 }, lookAt: { x: 0, y: 2, z: 0 } },
        ],
        currentPoint: 0,
    };

    function play() {
        const nextPoint = cinematic.points[cinematic.currentPoint];
        
        gsap.to(camera.position, {
            x: nextPoint.position.x,
            y: nextPoint.position.y,
            z: nextPoint.position.z,
            duration: 5,
            onUpdate: () => {
                controls.target.set(nextPoint.lookAt.x, nextPoint.lookAt.y, nextPoint.lookAt.z);
            },
            onComplete: () => {
                cinematic.currentPoint = (cinematic.currentPoint + 1) % cinematic.points.length;
                play();
            }
        });
    }

    const button = document.createElement('button');
    button.innerText = 'Play Cinematic';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '100';
    document.body.appendChild(button);
    button.addEventListener('click', play);
}
