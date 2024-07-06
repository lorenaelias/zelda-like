import { playerState } from "./state/stateManagers.js";
import { healthBar } from "./uiComponents/healthBar.js";

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

export async function blinkEffect(k, entity) {
    await k.tween(
        entity.opacity,
        0,
        0.1,
        (val) => (entity.opacity = val),
        k.easings.linear,
    );    
    await k.tween(
        entity.opacity,
        1,
        0.1,
        (val) => (entity.opacity = val),
        k.easings.linear,
    );
}

export function onAttacked(k, entity, player) {
    entity.onCollide("swordHitBox", async () => {
        if(entity.isAttacking) return; // desconsiderar quando é o slime/fantasma que está atacando o player
        // pq assim o ataque do player tem que ser cancelado
        
        if(entity.hp() <= 0) {
            k.destroy(entity);
            return;
        }

        entity.hurt(player.attackPower);
        await blinkEffect(k, entity);
    })
}

export function onCollideWithPlayer(k, entity) {
    entity.onCollide("player", async (player) => {
        if(player.isAttacking) return; //cancela os dois ataques
        playerState.setHealth(playerState.getHealth() - entity.attackPower);
        k.destroyAll("heartsContainer");
        healthBar(k, player);
        await blinkEffect(k, player);

        if(playerState.getHealth() <= 0) {
            playerState.setHealth(playerState.getMaxHealth());
            k.go("world");
        }
    })
}

export async function slideCamY(k, range, duration) {
    const currentCamPos = k.camPos();
    await k.tween(
        currentCamPos.y,
        currentCamPos.y + range,
        duration,
        (newPosY) => k.camPos(currentCamPos.x, newPosY),
        k.easings.linear
    );
}