import menuText from "../content/menuText.js";
import { gameState } from "../state/stateManagers.js";
import { colorizeBackground } from "../utils.js";


export default function mainMenu(k) {
  const locales = ["english", "french", "portuguese"];

  const currentLocale = gameState.getLocale();

  colorizeBackground(k, 0, 0, 0);

  k.add([
    k.text(menuText[currentLocale].title, { size: 30, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 100)
  ]);

  k.add([
    k.text(menuText[currentLocale].languageIndication, { size: 10, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 100)
  ]);

  k.add([
    k.text(menuText[currentLocale].playIndication, { size: 22, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y + 200)
  ]);

  k.onKeyPress("f", () => {
    const options = JSON.parse(JSON.stringify(locales));
    console.log('locales', locales);
    console.log('options', options);
    options.splice(locales.indexOf(gameState.getLocale()), 1);
    gameState.setLocale(locales[(locales.indexOf(gameState.getLocale()) + 1) % locales.length]);
    k.go("mainMenu");
  });

  k.onKeyPress("enter", () => {
    k.go("world");
  });
}