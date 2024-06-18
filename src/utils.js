export async function fetchMapData(mapPath) {
  return await (await fetch(mapPath)).json();
}