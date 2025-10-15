import * as THREE from 'three';
import { textures, textureMaterial } from './textures.js';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.voxels = new Map();
        this.chunkSize = 16;
        this.mesh = null;
    }

    addVoxel(x, y, z, type) {
        const key = `${x},${y},${z}`;
        this.voxels.set(key, { type });
    }

    getVoxel(x, y, z) {
        const key = `${x},${y},${z}`;
        return this.voxels.get(key);
    }

    updateMesh() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }

        const geometries = [];
        for (const [key, voxel] of this.voxels.entries()) {
            const [x, y, z] = key.split(',').map(Number);
            
            // Simple culling: only show faces that are not adjacent to another block
            if (!this.getVoxel(x, y + 1, z)) this.addFace('top', x, y, z, voxel.type, geometries);
            if (!this.getVoxel(x, y - 1, z)) this.addFace('bottom', x, y, z, voxel.type, geometries);
            if (!this.getVoxel(x + 1, y, z)) this.addFace('right', x, y, z, voxel.type, geometries);
            if (!this.getVoxel(x - 1, y, z)) this.addFace('left', x, y, z, voxel.type, geometries);
            if (!this.getVoxel(x, y, z + 1)) this.addFace('front', x, y, z, voxel.type, geometries);
            if (!this.getVoxel(x, y, z - 1)) this.addFace('back', x, y, z, voxel.type, geometries);
        }

        if (geometries.length > 0) {
            const mergedGeometry = new THREE.BufferGeometry();
            
            const positions = [];
            const normals = [];
            const uvs = [];
            const colors = [];

            for(const geom of geometries) {
                positions.push(...geom.positions);
                normals.push(...geom.normals);
                uvs.push(...geom.uvs);
                colors.push(...geom.colors);
            }

            mergedGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
            mergedGeometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
            mergedGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
            mergedGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

            this.mesh = new THREE.Mesh(mergedGeometry, textureMaterial);
            this.scene.add(this.mesh);
        }
    }

    addFace(face, x, y, z, type, geometries) {
        const positions = [];
        const normals = [];
        const uvs = [];
        const colors = [];

        const g = new THREE.PlaneGeometry(1, 1);
        g.translate(x, y, z);

        let texture;
        if (type === 'grass') {
            if (face === 'top') texture = textures.grass_top;
            else if (face === 'bottom') texture = textures.dirt;
            else texture = textures.grass_side;
        } else {
            texture = textures[type] || textures.stone;
        }

        if (face === 'top') {
            g.rotateX(-Math.PI / 2);
            g.translate(0, 0.5, 0);
        } else if (face === 'bottom') {
            g.rotateX(Math.PI / 2);
            g.translate(0, -0.5, 0);
        } else if (face === 'right') {
            g.rotateY(-Math.PI / 2);
            g.translate(0.5, 0, 0);
        } else if (face === 'left') {
            g.rotateY(Math.PI / 2);
            g.translate(-0.5, 0, 0);
        } else if (face === 'front') {
            g.translate(0, 0, 0.5);
        } else if (face === 'back') {
            g.rotateY(Math.PI);
            g.translate(0, 0, -0.5);
        }

        positions.push(...g.attributes.position.array);
        normals.push(...g.attributes.normal.array);
        
        const uv_array = [texture[0].x, texture[0].y, texture[1].x, texture[1].y, texture[2].x, texture[2].y, texture[3].x, texture[3].y];
        uvs.push(uv_array[0], uv_array[1], uv_array[2], uv_array[3], uv_array[4], uv_array[5], uv_array[6], uv_array[7]);

        // Add vertex colors for ambient occlusion effect
        for(let i = 0; i < 4; i++) {
            colors.push(1, 1, 1);
        }

        geometries.push({ positions, normals, uvs, colors });
    }

    generate() {
        // Ground
        for (let x = -16; x < 16; x++) {
            for (let z = -16; z < 16; z++) {
                this.addVoxel(x, 0, z, 'grass');
                this.addVoxel(x, -1, z, 'dirt');
                this.addVoxel(x, -2, z, 'stone');
            }
        }

        // Castle
        this.buildCastle();
        
        // Village
        this.buildVillage();

        this.updateMesh();
    }

    buildCastle() {
        const stone = 'cobblestone';
        // Walls
        for (let y = 1; y < 10; y++) {
            for (let i = -10; i <= 10; i++) {
                this.addVoxel(i, y, -10, stone);
                this.addVoxel(i, y, 10, stone);
                this.addVoxel(-10, y, i, stone);
                this.addVoxel(10, y, i, stone);
            }
        }
        // Towers
        for (let y = 1; y < 12; y++) {
            for (let x = -12; x <= -10; x++) for (let z = -12; z <= -10; z++) this.addVoxel(x, y, z, stone);
            for (let x = 10; x <= 12; x++) for (let z = -12; z <= -10; z++) this.addVoxel(x, y, z, stone);
            for (let x = -12; x <= -10; x++) for (let z = 10; z <= 12; z++) this.addVoxel(x, y, z, stone);
            for (let x = 10; x <= 12; x++) for (let z = 10; z <= 12; z++) this.addVoxel(x, y, z, stone);
        }
        // Crenellations
        for (let i = -10; i <= 10; i += 2) {
            this.addVoxel(i, 10, -10, stone);
            this.addVoxel(i, 10, 10, stone);
            this.addVoxel(-10, 10, i, stone);
            this.addVoxel(10, 10, i, stone);
        }
        // Drawbridge
        for (let x = -2; x <= 2; x++) {
            for (let z = -12; z < -10; z++) {
                this.addVoxel(x, 1, z, 'planks');
            }
        }
    }

    buildVillage() {
        this.buildHouse(-15, 1, 0);
        this.buildHouse(15, 1, 0);
        this.buildHouse(0, 1, -15);
    }

    buildHouse(x, y, z) {
        const wood = 'planks';
        const roof = 'brick';
        // Walls
        for (let j = 0; j < 4; j++) {
            for (let i = -2; i <= 2; i++) {
                this.addVoxel(x + i, y + j, z - 2, wood);
                this.addVoxel(x + i, y + j, z + 2, wood);
                this.addVoxel(x - 2, y + j, z + i, wood);
                this.addVoxel(x + 2, y + j, z + i, wood);
            }
        }
        // Roof
        for (let i = -3; i <= 3; i++) {
            this.addVoxel(x + i, y + 4, z, roof);
            this.addVoxel(x + i-1, y + 4, z-1, roof);
            this.addVoxel(x + i-1, y + 4, z+1, roof);
        }
    }
}