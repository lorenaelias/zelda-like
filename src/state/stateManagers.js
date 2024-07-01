import globalStateManager from "./globalState.js";
import oldManGlobalStateManager from "./oldManGlobalState.js";

export const gameState = globalStateManager().getInstance();
export const oldManState = oldManGlobalStateManager().getInstance();

