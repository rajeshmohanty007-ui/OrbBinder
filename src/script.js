import StartScene from "./scenes/start.js"
import LevelsScene from "./scenes/levels.js";
import InitialGameScene from "./scenes/level1/initialGame.js";
import Level2Scene from "./scenes/level2/level2Scene.js";
import Transition from "./scenes/level1/transition.js";
import BeamScene from "./scenes/level1/beam.js";
import EnemyReactScene from "./scenes/level1/EnemyReact.js";
import EndScene from "./scenes/level1/end.js";
import PauseScene from "./scenes/level1/pause.js";
import uiScene from "./scenes/level1/uiScene.js";

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    pixelArt: true,
    antialias: false,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 800 }, debug: false }
    },
    scene: [
        StartScene,
        LevelsScene,
        InitialGameScene,
        Level2Scene,
        uiScene,
        Transition,
        BeamScene,
        EnemyReactScene,
        EndScene,
        PauseScene
    ]
};
new Phaser.Game(config);

