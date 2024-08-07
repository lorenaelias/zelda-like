import {
    generatePlayerComponents,
    setPlayerMovement,
} from "../entities/player.js";
import { generateSlimeComponents, setSlimeAI } from "../entities/slime.js";
import { gameState } from "../state/stateManagers.js";
import { healthBar } from "../uiComponents/healthBar.js";
import inProgressMessageLines from "../content/inProgressMessageLines.js";
import {
    colorizeBackground,
    drawBoundaries,
    drawTiles,
    fetchMapData,
    onAttacked,
    onCollideWithPlayer,
} from "../utils.js";
import { showMessageInProgress } from "../uiComponents/inProgressDialog.js";

export default async function world(k) {
    const previousScene = gameState.getPreviousScene();
    colorizeBackground(k, 76, 170, 255);
    const mapData = await fetchMapData("./assets/maps/world.json");

    const map = k.add([k.pos(0, 0)]);

    const entities = {
        player: null,
        slimes: [],
    };

    const layers = mapData.layers;

    for (const layer of layers) {
        if (layer.name === "Boundaries") {
            drawBoundaries(k, map, layer);
            continue;
        }

        if (layer.name === "SpawnPoints") {
            for (const object of layer.objects) {
                if(
                    object.name==="player-dungeon" &&
                    previousScene === "dungeon"
                ) {
                    entities.player = map.add(
                        generatePlayerComponents(k, k.vec2(object.x, object.y))
                    );
                    continue;
                }

                if (object.name === "player" && previousScene !== "dungeon") {
                    entities.player = map.add(
                        generatePlayerComponents(k, k.vec2(object.x, object.y))
                    );
                    continue;
                }

                if (object.name === "slime") {
                    entities.slimes.push(
                        map.add(
                            generateSlimeComponents(
                                k,
                                k.vec2(object.x, object.y)
                            )
                        )
                    );
                    continue;
                }
            }
            continue;
        }

        drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }

    k.camScale(4);
    k.camPos(entities.player.worldPos());
    k.onUpdate(async () => {
        if (entities.player.pos.dist(k.camPos())) {
            await k.tween(
                k.camPos(),
                entities.player.worldPos(),
                0.15,
                (val) => {
                    k.camPos(val);
                },
                k.easings.linear
            );
        }
    });

    setPlayerMovement(k, entities.player);

    for(const slime of entities.slimes) {
        setSlimeAI(k, slime);
        onAttacked(k, slime, entities.player);
        onCollideWithPlayer(k, slime);
    }

    entities.player.onCollide("door-entrance", () => {
        k.go("house");
    });

    const responses = inProgressMessageLines[gameState.getLocale()];
    
    entities.player.onCollide("dungeon-door-entrance", () => {
        // showMessageInProgress(k, k.vec2(55, 350), responses[0]);
        k.go("dungeon");
    });

    healthBar(k);
}
