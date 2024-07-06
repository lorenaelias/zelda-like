export default function globalStateManager() {
  let instance = null;

  function createInstance() {
    let previousScene = null;
    let freezePlayer = false;
    let isGhostDefeated = false;
    let isSonSaved = false;

    let locale = "portuguese";
    let fontSize = 24;

    return {
      setPreviousScene(sceneName) {
        previousScene = sceneName;
      },
      getPreviousScene: () => previousScene, 
      setFreezePlayer(value) {
        freezePlayer = value;
      },
      getFreezePlayer: () => freezePlayer,
      setIsGhostDefeated(value) {
        isGhostDefeated = value;
      },
      getIsGhostDefeated: () => isGhostDefeated,
      setIsSonSaved(value) {
        isSonSaved = value;
      },
      getIsSonSaved: () => isSonSaved,
      setFontSize(value) {
        fontSize = value;
      },
      getFontSize: () => fontSize,
      setLocale(value) {
        locale = value;
      },
      getLocale: () => locale,
    }
  }

  return {
    getInstance() {
      if(!instance) {
        instance = createInstance();
      }

      return instance;
    }
  }
}