import * as THREE from 'three';
import { generateTextureAtlas } from './atlas.js';

const textureLoader = new THREE.TextureLoader();
const atlasURL = generateTextureAtlas();
const atlasTexture = textureLoader.load(atlasURL);
atlasTexture.magFilter = THREE.NearestFilter;
atlasTexture.minFilter = THREE.NearestFilter;

const tileSize = 16;
const atlasSize = 256;

export const textures = {
    stone: getUVs(0, 0),
    dirt: getUVs(1, 0),
    grass_top: getUVs(2, 0),
    grass_side: getUVs(3, 0),
    sand: getUVs(4, 0),
    wood: getUVs(5, 0),
    cobblestone: getUVs(6, 0),
    water: getUVs(7, 0),
    oak_log: getUVs(8, 0),
    leaves: getUVs(9, 0),
    planks: getUVs(10, 0),
    brick: getUVs(11, 0),
};

function getUVs(x, y) {
    const u = (x * tileSize) / atlasSize;
    const v = 1 - ((y + 1) * tileSize) / atlasSize;
    const u2 = ((x + 1) * tileSize) / atlasSize;
    const v2 = 1 - (y * tileSize) / atlasSize;
    return [
        new THREE.Vector2(u, v),
        new THREE.Vector2(u2, v),
        new THREE.Vector2(u, v2),
        new THREE.Vector2(u2, v2),
    ];
}

export const textureMaterial = new THREE.MeshLambertMaterial({
    map: atlasTexture,
    side: THREE.DoubleSide,
    vertexColors: true,
});
