import oldmanLines from "../content/oldmanDialogue.js";
import { dialog } from "../uiComponents/dialog.js";
import { playAnimIfNotPlaying } from "../utils.js";

export function generateOldmanComponents(k, pos) {
  return [
    k.sprite("assets", {
      anim: "oldman-down",
    }),
    k.area({ shape: new k.Rect(k.vec2(2, 4), 12, 12) }),
    k.body({ isStatic: true }),
    k.pos(pos),
    "oldman",
  ]
}

export async function startInteraction(k, oldman, player) {
  if(player.direction === "left") {
    oldman.flipX = true;
    playAnimIfNotPlaying(oldman, "oldman-side");
  }  
  
  if(player.direction === "right") {
    oldman.flipX = false;
    playAnimIfNotPlaying(oldman, "oldman-side");
  }  
  
  if(player.direction === "down") {
    playAnimIfNotPlaying(oldman, "oldman-up");
  }

  if(player.direction === "up") {
    playAnimIfNotPlaying(oldman, "oldman-down");
  }

  const responses = oldmanLines.english;
  
  dialog(k, k.vec2(55, 350), responses[0]);
}