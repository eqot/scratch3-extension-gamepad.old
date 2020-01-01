const ArgumentType = require('scratch-vm/src/extension-support/argument-type')
const BlockType = require('scratch-vm/src/extension-support/block-type')
const Cast = require('scratch-vm/src/util/cast')

const config = require('./config.js')

class GamepadBlocks {
  constructor(runtime) {
    this.runtime = runtime

    this.gamepadIndex = null

    window.addEventListener('gamepadconnected', event => {
      console.log('Gamepad has been connected')
      this.gamepadIndex = event.gamepad.index
    })
    window.addEventListener('gamepaddisconnected', () => {
      console.log('Gamepad has been disconnected')
      this.gamepadIndex = null
    })
  }

  static get gui() {
    return {
      name: config.name,
      extensionId: config.id,
      collaborator: config.author,
      iconURL: config.image,
      insetIconURL: config.imageSmall,
      description: config.description,
      featured: true,
      disabled: false,
      internetConnectionRequired: false,
      bluetoothRequired: false,
      helpLink: config.url
    }
  }

  static get vm() {
    return { [config.id]: () => GamepadBlocks }
  }

  getInfo() {
    return {
      id: config.id,
      name: config.name,
      menuIconURI: config.menuIcon,
      blockIconURI: config.blockIcon,
      color1: config.colors && config.colors[0],
      color2: config.colors && config.colors[1],
      color3: config.colors && config.colors[2],
      blocks: [
        {
          opcode: 'whatButtonPressed',
          blockType: BlockType.HAT,
          text: 'when [BUTTON] is pressed',
          arguments: {
            BUTTON: {
              type: ArgumentType.NUMBER,
              menu: 'buttons',
              defaultValue: 0
            }
          }
        },
        {
          opcode: 'isButtonPressed',
          blockType: BlockType.BOOLEAN,
          text: '[BUTTON] is pressed',
          arguments: {
            BUTTON: {
              type: ArgumentType.NUMBER,
              menu: 'buttons',
              defaultValue: 0
            }
          },
          func: 'whatButtonPressed'
        }
      ],
      menus: {
        buttons: {
          acceptReporters: true,
          items: [
            {
              text: '✕',
              value: 0
            },
            {
              text: '○',
              value: 1
            },
            {
              text: '□',
              value: 2
            },
            {
              text: '△',
              value: 3
            }
          ]
        }
      }
    }
  }

  whatButtonPressed(args) {
    if (this.gamepadIndex === null) {
      return false
    }

    const gamepad = navigator.getGamepads()[this.gamepadIndex]
    if (!gamepad) {
      return false
    }

    const buttonIndex = Cast.toNumber(args.BUTTON)
    return gamepad.buttons[buttonIndex].pressed
  }
}

module.exports = GamepadBlocks
