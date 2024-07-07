import {
    generatePlayerComponents,
    setPlayerMovement,
} from "../entities/player.js";
import { gameState } from "../state/stateManagers.js";
import { healthBar } from "../uiComponents/healthBar.js";
import {
    colorizeBackground,
    drawBoundaries,
    drawTiles,
    fetchMapData,
    playAnimIfNotPlaying,
} from "../utils.js";

export default async function myHouse(k) {
    const previousScene = gameState.getPreviousScene();
    colorizeBackground(k, 27, 29, 52);

    const mapData = await fetchMapData("./assets/maps/my_house.json");

    const map = k.add([k.pos(250, 200)]);

    const entities = {
        player: null,
    };

    const layers = mapData.layers;

    for (const layer of layers) {
        if (layer.name === "Boundaries") {
            drawBoundaries(k, map, layer);
            continue;
        }

        if (layer.name === "SpawnPoints") {
            for (const object of layer.objects) {
                if (object.name === "player" && previousScene !== "world") {
                    entities.player = map.add(
                        generatePlayerComponents(k, k.vec2(object.x, object.y))
                    );
                    continue;
                }

                if (
                    object.name === "player-entered-my-house" &&
                    previousScene === "world"
                ) {
                    entities.player = map.add(
                        generatePlayerComponents(k, k.vec2(object.x, object.y))
                    );
                    continue;
                }
            }
            continue;
        }

        drawTiles(k, map, layer, mapData.tileheight, mapData.tilewidth);
    }

    k.camScale(2.5);

    setPlayerMovement(k, entities.player);

    entities.player.onCollide("door-exit-my-house", () => {
        gameState.setPreviousScene("myHouse");
        k.go("world");
    });

    entities.player.onCollide("honey-pot", async () => {
        console.log("honeypot is empty");
        // await startInteraction(k, entities.oldman, entities.player);
    });

    healthBar(k);
}
