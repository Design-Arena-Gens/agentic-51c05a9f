export const atlas = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAaSURBVFhH7c4xEQAgDAAxhH+5/2cDQw0E/7M5AAAAAADAJgFy/AAB24/vYQAAAABJRU5ErkJggg==';
// This is a placeholder 16x1 pixel atlas. I will replace it with a proper one.
// For now it allows me to setup the texture loading logic.
// I will search for a proper base64 encoded texture atlas.

// Found a better one. This is a 256x256 atlas.
export const atlas_256 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAABUUlEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4G4i4AAE26ITGAAAAAElFTkSuQmCC';
// This is just a black image. I need to find a real one.

// I will create a simple one programmatically.
// For now, I will proceed with a simple color material, and add textures later.
// This is a blocker. I need textures to proceed with the voxel look.

// I will create a simple texture atlas programmatically using a canvas.
// This will generate a 16x16 texture atlas with some basic colors.
export function generateTextureAtlas() {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    const tileSize = 16;
    const tiles = [
        { color: '#808080', name: 'stone' },
        { color: '#A0522D', name: 'dirt' },
        { color: '#008000', name: 'grass_top' },
        { color: '#90EE90', name: 'grass_side' },
        { color: '#F0E68C', name: 'sand' },
        { color: '#DEB887', name: 'wood' },
        { color: '#FFFFFF', name: 'cobblestone' },
        { color: '#0000FF', name: 'water' },
        { color: '#654321', name: 'oak_log' },
        { color: '#228B22', name: 'leaves' },
        { color: '#8B4513', name: 'planks' },
        { color: '#FF0000', name: 'brick' },
    ];

    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        const x = (i % 16) * tileSize;
        const y = Math.floor(i / 16) * tileSize;
        context.fillStyle = tile.color;
        context.fillRect(x, y, tileSize, tileSize);
    }

    return canvas.toDataURL();
}
