let D = null;
export async function loadData() {
    if (!D) {
        const res = await fetch('/src/data/db.json');
        D = await res.json();
    }
    return D;
}
export async function coinMapping() {
    const data = await loadData();
    const coinMap1 = Object.fromEntries(Object.keys(data.core).map(core => [core, data.core[core].cost]));
    const coinMap2 = Object.fromEntries(Object.keys(data.particle).map(par => [par, data.particle[par].cost]));
    const coinMap3 = Object.fromEntries(Object.keys(data.rings).map(ring => [ring, data.rings[ring].cost]));
    let coinMap = { ...coinMap1, ...coinMap2, ...coinMap3 };
    return coinMap;
}