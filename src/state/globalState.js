export default function globalStateManager() {
  let instance = null;

  function createInstance() {
    let freezePlayer = false;
    let locale = "portuguese";
    let fontSize = 24;

    return {
      setFreezePlayer(value) {
        freezePlayer = value;
      },
      getFreezePlayer: () => freezePlayer,
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