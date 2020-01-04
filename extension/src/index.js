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
          opcode: 'getAxes',
          blockType: BlockType.REPORTER,
          text: '[AXIS] value for [STICK] stick',
          arguments: {
            AXIS: {
              type: ArgumentType.NUMBER,
              menu: 'axes',
              defaultValue: '0'
            },
            STICK: {
              type: ArgumentType.NUMBER,
              menu: 'sticks',
              defaultValue: '0'
            }
          }
        },
        {
          opcode: 'whenButtonPressed',
          blockType: BlockType.HAT,
          text: 'when [BUTTON] button pressed',
          arguments: {
            BUTTON: {
              type: ArgumentType.NUMBER,
              menu: 'buttons',
              defaultValue: '12'
            }
          }
        },
        {
          opcode: 'isButtonPressed',
          blockType: BlockType.BOOLEAN,
          text: '[BUTTON] button pressed?',
          arguments: {
            BUTTON: {
              type: ArgumentType.NUMBER,
              menu: 'buttons',
              defaultValue: '12'
            }
          },
          func: 'whenButtonPressed'
        }
      ],
      menus: {
        sticks: {
          acceptReporters: true,
          items: [
            {
              text: 'left',
              value: '0'
            },
            {
              text: 'right',
              value: '1'
            }
          ]
        },
        axes: {
          acceptReporters: true,
          items: [
            {
              text: 'X',
              value: '0'
            },
            {
              text: 'Y',
              value: '1'
            }
          ]
        },
        buttons: {
          acceptReporters: true,
          items: [
            {
              text: 'up',
              value: '12'
            },
            {
              text: 'down',
              value: '13'
            },
            {
              text: 'right',
              value: '15'
            },
            {
              text: 'left',
              value: '14'
            },
            {
              text: 'cross',
              value: '0'
            },
            {
              text: 'circle',
              value: '1'
            },
            {
              text: 'square',
              value: '2'
            },
            {
              text: 'triangle',
              value: '3'
            },
            {
              text: 'left stick',
              value: '10'
            },
            {
              text: 'right stick',
              value: '11'
            },
            {
              text: 'left shoulder',
              value: '4'
            },
            {
              text: 'right shoulder',
              value: '5'
            },
            {
              text: 'left trigger',
              value: '6'
            },
            {
              text: 'right trigger',
              value: '7'
            },
            {
              text: 'share',
              value: '8'
            },
            {
              text: 'options',
              value: '9'
            },
            {
              text: 'touch pad',
              value: '17'
            },
            {
              text: 'PS',
              value: '16'
            }
          ]
        }
      }
    }
  }

  getAxes(args) {
    if (this.gamepadIndex === null) {
      return false
    }

    const gamepad = navigator.getGamepads()[this.gamepadIndex]
    if (!gamepad) {
      return false
    }

    const stickIndex = Cast.toNumber(args.STICK)
    const axisIndex = Cast.toNumber(args.AXIS)
    const sign = axisIndex === 0 ? 1 : -1

    return gamepad.axes[stickIndex * 2 + axisIndex] * sign
  }

  whenButtonPressed(args) {
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
