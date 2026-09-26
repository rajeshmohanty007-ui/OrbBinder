let D = null;
async function loadData() {
    if (!D) {
        const res = await fetch('/src/data/db.json');
        D = await res.json()
    }
    return D;
}

const addOrRefresh = (state, effect) => {
    const existing = state.status.find(e => e.type === effect.type);
    if (existing) {
        existing.duration = effect.duration;
    }
    else {
        state.status.push({ ...effect });
    }
}
const Effects = {
    burn: (state, effect) => {
        state.health -= effect.value;
        effect.duration--;
        if (!effect.duration) {
            state.status = [...state.status].filter(e => e != effect);
        }
    },
    poison: (state, effect) => {
        state.health -= effect.value;
        effect.duration--;
        if (!effect.duration) {
            state.status = [...state.status].filter(e => e != effect);
        }
    }
}

const AoE = {
    "hero": {
        heal: (state, effect) => {
            state.health += state.maxHP * effect.value;
        },
        spGain: (state, effect) => {
            state.shield += effect.value;
        },
        attack_up: (state, effect) => {
            state.status.push({ ...effect });
        }
    },
    "enemy": {
        attack_down: (state, effect) => {
            state.status.push({ ...effect });
        },
        burn: (state, effect) => {
            addOrRefresh(state, effect);
        },
        poison: (state, effect) => {
            addOrRefresh(state, effect);
        }
    }
}
export default async function status(hero, enemy, core, particle) {
    const data = await loadData();
    const core1 = data.core[core];
    const particle1 = data.particle[particle];

    enemy.status = enemy.status.filter(eff => {
        const handler = Effects[eff.type];
        if (handler) {
            handler(enemy, eff);
        }
        return eff.duration > 0;
    });

    const applyEffects = (target, targetName, effects) => {
        effects?.forEach(eff => {
            const handler = AoE[targetName]?.[eff.type];
            if (handler) {
                handler(target, eff);
            }
        })
    }
    applyEffects(hero, "hero", core1?.effect);
    applyEffects(hero, "hero", particle1?.effect);
    applyEffects(enemy, "enemy", core1?.effect);
    applyEffects(enemy, "enemy", particle1?.effect);
}