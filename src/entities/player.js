import { areAnyOfTheseKeysDown, playAnimIfNotPlaying } from "../utils.js";

export function generatePlayerComponents(k, pos) {
    return [
        k.sprite("assets", {
            anim: "player-idle-down",
        }),
        k.area({ shape: new k.Rect(k.vec2(3, 4), 10, 12) }),
        k.body(),
        k.pos(pos),
        k.opacity(),
        {
            speed: 100,
            attackPower: 1,
            direction: "down",
            isAttacking: false,
        },
        "player",
    ];
}

function movePlayer(
    k,
    player,
    currentKey,
    expectedKey,
    excludedKeys,
    direction,
    moveVec2
) {
    if (currentKey === expectedKey && !areAnyOfTheseKeysDown(k, excludedKeys)) {
        switch(direction) {
            case "left":    
                player.flipX = true;
                playAnimIfNotPlaying(player, "player-side");
                break;
            case "right":
                player.flipX = false;
                playAnimIfNotPlaying(player, "player-side");
                break;
            case "up":
                playAnimIfNotPlaying(player, "player-up");
                break;
            case "down":
                playAnimIfNotPlaying(player, "player-down");
                break;
        }
        player.move(moveVec2);
        player.direction = direction;
    }
}

export function setPlayerMovement(k, player) {
    k.onKeyDown((key) => {
        movePlayer(
            k,
            player,
            key,
            "left",
            ["up", "down", "w", "s", "a"],
            "left",
            k.vec2(-player.speed, 0)
        );
        movePlayer(
            k,
            player,
            key,
            "a",
            ["up", "down", "w", "s", "left"],
            "left",
            k.vec2(-player.speed, 0)
        );

        movePlayer(
            k,
            player,
            key,
            "right",
            ["up", "down", "w", "s", "d"],
            "right",
            k.vec2(player.speed, 0)
        );
        movePlayer(
            k,
            player,
            key,
            "d",
            ["up", "down", "w", "s", "right"],
            "right",
            k.vec2(player.speed, 0)
        );


        movePlayer(
            k,
            player,
            key,
            "up",
            ["w"],
            "up",
            k.vec2(0, -player.speed)
        );
        movePlayer(
            k,
            player,
            key,
            "w",
            ["up"],
            "up",
            k.vec2(0, -player.speed)
        );


        movePlayer(
            k,
            player,
            key,
            "down",
            ["s"],
            "down",
            k.vec2(0, player.speed)
        );
        movePlayer(
            k,
            player,
            key,
            "s",
            ["down"],
            "down",
            k.vec2(0, player.speed)
        );
    });

    k.onKeyRelease(() => {
        player.stop();
    });
}
