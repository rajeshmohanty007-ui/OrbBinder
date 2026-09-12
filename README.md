# OrbBinder

**OrbBinder** is an elemental alchemy action-platformer built with **Phaser 3** and **Vite**. Step into the boots of a dungeon warrior traversing procedural dungeon depths, encountering menacing elemental creatures, and forging customized elemental magic beams to vanquish foes.

---

## 🎮 Game Overview

In **OrbBinder**, combat is not about simple sword slashes—it is about **alchemical engineering**:
1. **Dungeon Traversal:** Run and sprint through the dungeon ruins.
2. **Combat Encounters:** Approaching an enemy locks the camera into a cinematic encounter view and launches the **Beam Maker** interface.
3. **Beam Crafting (Core + Particle + Ring):** Assemble an energy beam using your available coins. Match elements for massive synergy multipliers, apply status ailments (Burn, Attack Down, SP Gain, Shield Break), and unleash devastating elemental attacks.
4. **Gradual Damage & Shield System:** Attacks deal damage across enemy Shield Points (SP) and Health Points (HP) with dynamic visual health bar animations.
5. **Dungeon Progression:** Defeat enemies to earn currency bounties and trigger real-time chunk reconstruction to press deeper into the dungeon.

---

## 🕹️ Controls & How to Play

### Platforming Controls
| Action | Keybinding |
| :--- | :--- |
| **Move Left** | `A` or `Left Arrow` |
| **Move Right / Sprint** | `D` or `Right Arrow` |
| **Jump** | `Spacebar` |
| **Pause Game** | Click the **Pause Coin** icon (Top-Left) |

### Combat & Beam Crafting
When you get close to an enemy, combat initiates and the **Beam Maker** appears:
- **Core (1st slot):** Select 1 Core element (Fire, Water, Wind, Earth, etc.) as the base energy of your beam.
- **Particle (2nd slot):** Select 1 Particle modifier to enhance damage and trigger special effects. Matching the particle element to the core element grants bonus synergy damage!
- **Ring (3rd slot):** Select a Catalyst Ring to amplify beam damage and effects.
- **Refresh:** Click the Refresh buttons if you want to re-roll available Cores or Particles.
- **Coin Budget:** Every component costs coins. Keep an eye on your coin wallet in the top bar!
- **Firing:** Once all three components are slotted, the beam automatically charges and fires across the screen.

---

## 🧪 Elemental System & Synergies

- **Elemental Matching:** Combining a Core and Particle of the same element grants bonus elemental damage scaling and synergy multipliers.
- **Status Effects:**
  - **Burn:** Deals lingering damage over time.
  - **SP Gain:** Recharges Shield Points.
  - **Shield Break:** Strips enemy defenses.
  - **Heal:** Restores vital health.
  - **Attack Down:** Softens incoming enemy offensive strength.

---

## 🚀 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` (bundled with Node.js)

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rajeshmohanty007-ui/OrbBinder.git
   cd OrbBinder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Play the game:**
   Open your web browser and navigate to `http://localhost:5173` (or the URL printed in your terminal).

### Production Build
To create a production-ready bundle:
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 🛠️ Built With
- **[Phaser 3](https://phaser.io/)** (v3.90.0) - Fast, lightweight 2D HTML5 game framework (Arcade Physics, Scenes, Tweens, Animations).
- **[Vite](https://vitejs.dev/)** (v7) - Next-generation frontend build tooling and hot module replacement.