export function playAnimIfNotPlaying(gameObj, animName) {
    if (gameObj.curAnim() !== animName) gameObj.play(animName);
}

export function areAnyOfTheseKeysDown(k, keys) {
    for (const key of keys) {
        if (k.isKeyDown(key)) return true;
    }
    return false;
}

export function colorizeBackground(k, r, g, b) {
    k.add([
        k.rect(k.canvas.width, k.canvas.height),
        k.color(r, g, b),
        k.fixed(),
    ]);
}

export async function fetchMapData(mapPath) {
    return await (await fetch(mapPath)).json();
}

export function drawTiles(k, map, layer, tileheight, tilewidth) {
    let nbOfDrawnTiles = 0;
    const tilePos = k.vec2(0, 0);
    for (const tile of layer.data) {
        if (nbOfDrawnTiles % layer.width === 0) {
            tilePos.x = 0;
            tilePos.y += tileheight;
        } else {
            tilePos.x += tilewidth;
        }

        nbOfDrawnTiles++;

        if (tile === 0) continue;

        map.add([
            k.sprite("assets", { frame: tile - 1 }),
            k.pos(tilePos),
            k.offscreen(),
        ]);
    }
}

export function generateColliderBoxComponents(k, width, height, pos, tag) {
    return [
        k.area({ shape: new k.Rect(k.vec2(0), width, height) }),
        k.pos(pos),
        k.body({ isStatic: true }),
        k.offscreen(),
        tag,
    ];
}

export function drawBoundaries(k, map, layer) {
    for (const object of layer.objects) {
        map.add(
            generateColliderBoxComponents(
                k,
                object.width,
                object.height,
                k.vec2(object.x, object.y + 16),
                object.name
            )
        );
    }
}
