import Phaser from 'phaser'
import { scoreChanged } from '../score'
/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} totalWidth
 * @param {string} texture
 * @param {number} scrollFactor
 */
const createAligned = (scene, totalWidth, texture, scrollFactor) => {
  const getWidth = scene.textures.get(texture).getSourceImage().width
  const count = Math.ceil(totalWidth / getWidth) * scrollFactor
  let x = 0
  for (let i = 0; i < count; ++i) {
    const m = scene.add
      .image(x, scene.scale.height, texture)
      .setOrigin(0, 1)
      .setScrollFactor(scrollFactor)
    x += m.width
  }
}

let currentSceneScore = 0
let scoreText
let checkAmount = 0
let checkText
const checksToPass = '1'
const collectScore = (player, type) => {
  if (type.texture.key === 'react') {
    type.disableBody(true, true)
    currentSceneScore += 10
    scoreChanged(currentSceneScore)
    scoreText.setText('Score: ' + currentSceneScore)
    if (checkAmount == checksToPass) {
      canAsk = true
    }
  } else {
    type.disableBody(true, true)
    currentSceneScore += 20
    checkAmount += 1
    scoreChanged(currentSceneScore)
    scoreText.setText('Score: ' + currentSceneScore)
    checkText.setText('Trello: ' + checkAmount + ' / ' + checksToPass)
    if (checkAmount == checksToPass) {
      canAsk = true
    }
  }
}
let canAsk = false
let noQuestion
let duskSceneComplete = false
const askQuestion = () => {
  if (canAsk) {
    noQuestion.setText('Congrats, you have completed your trello card!')
    setTimeout(() => {
      duskSceneComplete = true
    }, 1000)
  } else {
    noQuestion.setText('Please come back with a complete trello card')
  }
}
let facing = ''
let react
let check
let tutor
let player
let platforms
let floor
let wall
let trigger
let bump

const worldWidth = 2000

export default class DuskScene extends Phaser.Scene {
  constructor () {
    super('dusk-scene')
  }

  preload () {
    // invis walls/triggers
    this.load.image('triggerBlock', 'assets/blocksTriggers/triggerBlock.png')
    this.load.image('base', '/assets/blocksTriggers/base.png')
    this.load.image('wallBlock', '/assets/blocksTriggers/wallBlock.png')
    // dusk assets
    this.load.image('background', '/assets/Dusk/dusk-bg.png')
    this.load.image('far-mount', '/assets/Dusk/dusk-far-mount.png')
    this.load.image('near-mount', '/assets/Dusk/dusk-near-mount.png')
    this.load.image('far-trees', '/assets/Dusk/dusk-far-trees.png')
    this.load.image('near-trees', '/assets/Dusk/dusk-near-trees.png')
    // assets
    this.load.image('don', '/assets/man/lache.png')
    this.load.image('reactText', '/assets/coinsText.png')
    this.load.image('checkText', '/assets/checkText.png')
    this.load.image('check', '/assets/check.png')
    this.load.image('react', '/assets/reactCoinP.png')
    this.load.image('platform', '/assets/Dusk/platform.png')
    this.load.image('bump', '/assets/Jungle/bump.png')
    this.load.image('sky', '/assets/Jungle/sky.png')
    this.load.image('mountain', '/assets/Jungle/mountains.png')
    this.load.image('plateau', '/assets/Jungle/plateau.png')
    this.load.image('ground', '/assets/Dusk/duskGround.png')
    this.load.image('arrow-keys', '/assets/left-right-keys.png')
    this.load.image('up-key', '/assets/up-key.png')
    this.load.image(
      'platform',
      '/assets/airpack/PNG/Environment/ground_grass.png'
    )
    this.load.image('plants', '/assets/Jungle/plant.png')
    this.load.image('spring', '/assets/airpack/PNG/Items/spring.png')
    // player assets
    this.load.spritesheet('jumpRight', '/assets/man/jumpRight.png', {
      frameWidth: 60,
      frameHeight: 105
    })
    this.load.spritesheet('jumpLeft', '/assets/man/jumpLeft.png', {
      frameWidth: 60,
      frameHeight: 105
    })
    this.load.spritesheet('runLeft', '/assets/man/runLeft.png', {
      frameWidth: 63,
      frameHeight: 99
    })
    this.load.spritesheet('runRight', '/assets/man/runRight.png', {
      frameWidth: 63,
      frameHeight: 99
    })
    this.load.spritesheet('idleRight', '/assets/man/idleRight.png', {
      frameWidth: 57,
      frameHeight: 102
    })
    this.load.spritesheet('idleLeft', '/assets/man/idleLeft.png', {
      frameWidth: 57,
      frameHeight: 102
    })
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create (prevScore) {
    currentSceneScore = prevScore
    this.input.keyboard.on('keydown-' + 'LEFT', function (event) {
      facing = 'left'
    })
    this.input.keyboard.on('keydown-' + 'RIGHT', function (event) {
      facing = 'right'
    })
    const width = this.scale.width
    const height = this.scale.height
    const totalWidth = width * 10
    this.add.image(width * 0.5, height * 0.5, 'background').setScale(5).setScrollFactor(0)
    this.add.image(800, 300, 'far-mount').setScale(4).setScrollFactor(0)
    this.add.image(700, 400, 'near-mount').setScale(3).setScrollFactor(0.05)
    this.add.image(800, 300, 'far-trees').setScale(4.5).setScrollFactor(0.4)
    createAligned(this, totalWidth, 'ground', 1)
    this.add.image(1200, 230, 'near-trees').setScale(5).setScrollFactor(0.7)
    // this.add.image(width * 0.5, height * 1, 'platform').setScrollFactor(0)
    // Collider floor & platforms
    wall = this.physics.add.staticGroup()
    wall.create(-10, 0, 'wallBlock')
    wall.create(worldWidth, 0, 'wallBlock')
    floor = this.physics.add.staticGroup()
    floor.create(2010, 650, 'base').setScrollFactor(0)
    platforms = this.physics.add.staticGroup()
    platforms.create(800, 500, 'platform').setScale(0.4).refreshBody()
    platforms.children.entries.forEach(platform => {
      return ((platform.body.checkCollision.left = false),
      (platform.body.checkCollision.right = false),
      (platform.body.checkCollision.down = false))
    })
    // background images
    // Character sprites
    // Tutor
    tutor = this.physics.add.sprite(1700, 535, 'don')
    tutor.setScale(0.3)
    // Tutor trigger
    const spot = tutor.body.position
    trigger = this.physics.add.sprite(spot.x, spot.y, 'triggerBlock')
    // Player sprite
    player = this.physics.add.sprite(100, 580, 'idleRight')
    // player.setScale(3)
    player.body.setGravityY(80)
    player.setCollideWorldBounds(false)
    // player.onWorldBounds = true
    player.body.checkCollision.up = false
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('runLeft', {
        start: 7,
        end: 0
      }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('runRight', {
        start: 0,
        end: 7
      }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'idleRight',
      frames: this.anims.generateFrameNumbers('idleRight', {
        start: 0,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'idleLeft',
      frames: this.anims.generateFrameNumbers('idleLeft', {
        start: 0,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: 'jumpLeft',
      frames: this.anims.generateFrameNumbers('jumpLeft', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    })
    this.anims.create({
      key: 'jumpRight',
      frames: this.anims.generateFrameNumbers('jumpRight', {
        start: 0,
        end: 2
      }),
      frameRate: 5,
      repeat: -1
    })
    // Interactive Sprites
    // coin and collection
    react = this.physics.add.staticGroup()
    react.create(550, 600, 'react').setScale(0.05).refreshBody()
    react.create(850, 600, 'react').setScale(0.05).refreshBody()
    this.physics.add.overlap(player, react, collectScore, null, this)
    check = this.physics.add.staticGroup()
    check.create(1000, 550, 'check').setScale(0.08).refreshBody()
    this.physics.add.overlap(player, check, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)
    check = this.physics.add.staticGroup()
    check.create(1400, 550, 'check').setScale(0.08).refreshBody()
    this.physics.add.overlap(player, check, collectScore, null, this)
    this.physics.add.overlap(player, trigger, askQuestion, null, this)
    // camera follow
    this.cameras.main.setBounds(0, 0, worldWidth, 0)
    this.cameras.main.startFollow(player)
    // text
    scoreText = this.add
      .text(16, 16, 'Score: ' + currentSceneScore, {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '20px',
        fill: 'white'
      })
      .setScrollFactor(0)
    checkText = this.add
      .text(width - 300, 16, 'Trello: 0 / ' + checksToPass, {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: '20px',
        fill: 'white'
      })
      .setScrollFactor(0)
    noQuestion = this.add.text(spot.x - 250, spot.y + 100, '', {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: '12px',
      fill: 'white'
    })
    // colliders
    this.physics.add.collider([floor, bump], [player, react, tutor, trigger])
    this.physics.add.collider(player, [platforms, wall, bump])
  }

  update () {
    const cam = this.cameras.main
    const speed = 15
    if (this.cursors.left.isDown) {
      // facing = 'left'
      player.setVelocityX(-300)
      cam.scrollX -= speed
      if (!player.body.touching.down) {
        player.anims.play('jumpLeft', true)
      } else {
        player.anims.play('left', true)
      }
    } else if (this.cursors.right.isDown) {
      // facing = 'right'
      player.setVelocityX(300)
      cam.scrollX += speed
      if (!player.body.touching.down) {
        player.anims.play('jumpRight', true)
      } else {
        player.anims.play('right', true)
      }
    } else if (!player.body.touching.down && facing === 'left') {
      player.anims.play('jumpLeft', true)
    } else if (!player.body.touching.down && facing === 'right') {
      player.anims.play('jumpRight', true)
    } else if (facing === 'left') {
      player.setVelocityX(0)
      player.anims.play('idleLeft', true)
    } else {
      player.setVelocityX(0)
      player.anims.play('idleRight', true)
    }
    if (this.cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-600)
      if (facing === 'left') {
        player.anims.play('jumpLeft', true)
      } else player.anims.play('jumpRight', true)
    }
    if (duskSceneComplete) {
      this.scene.start('city-scene', currentSceneScore)
    }
  }
}
