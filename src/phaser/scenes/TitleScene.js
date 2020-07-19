import Phaser from 'phaser'

/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('title-scene')
  }

  preload () {
    // this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('dark-forest', '/assets/Game/dark-forest.png')
    this.load.image('start', '/assets/Game/start.png')
    this.load.image('click-here', '/assets/Game/click-here.png')
  }

  create (score) {
    // console.log(score)
    console.log(window.innerWidth)
    this.add.image(500, 300, 'dark-forest').setScale(2.5)
    this.add.image((window.innerWidth / 2.1), 400, 'click-here').setScale(0.5)

    this.input.once(
      'pointerdown',
      function () {
        // console.log('From Title to Level 1')
        // this.scene.start('tut-level')
        // this.scene.start('city-scene')
        this.scene.start('dusk-scene')
        // this.scene.start('jump-scene')
      },
      this
    )
  }
}
