export function registerBeamAnimations(scene) {
    scene.anims.create({
        key: 'startBeam1-init',
        frames: scene.anims.generateFrameNumbers('pyroSrt', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: 0
    });
    scene.anims.create({
        key: 'startBeam1-rep',
        frames: scene.anims.generateFrameNumbers('pyroSrt', { start: 2, end: 5 }),
        frameRate: 6,
        repeat: -1
    })
    scene.anims.create({
        key: 'midBeam1',
        frames: scene.anims.generateFrameNumbers('pyroMid', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: -1
    })
    scene.anims.create({
        key: 'endBeam1',
        frames: scene.anims.generateFrameNumbers('pyroEnd', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })
}
