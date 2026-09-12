let D = null;
async function loadData() {
    if (!D) {
        const res = await fetch('/src/data/db.json');
        D = await res.json();
    }
    return D;
}

export default async function Calc(core, particle, ring, c = 1, p = 1) {
    const D = await loadData();

    const core1 = D.core[core];
    const particle1 = D.particle[particle];
    const ring1 = ring ? D.rings[ring] : "";
    let damage = core1.damage;

    if (particle1.el_damage && core1.element === particle1.element) damage *= (1 + (particle1.el_damage / 100));
    else damage *= (1 + (particle1.damage / 100));

    if (ring1) damage += ring1.damage;
    if (core1.element === particle1.element) damage *= 1.05;
    return damage;
}
