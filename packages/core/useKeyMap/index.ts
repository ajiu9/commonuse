import { isArray } from '@ajiu9/shared'
import { aliases, keyCodeToKeyName } from './_configurable'

type KeyHandler = (event: KeyboardEvent, keyId: string) => any

class Keymap {
  private target: string
  private map: { [key: string]: { [key: string]: KeyHandler } }

  private static readonly DEFAULT_TARGET = 'default'
  private static readonly keyCodeToKeyName = keyCodeToKeyName

  private static readonly aliases = aliases

  constructor(element: HTMLElement) {
    this.target = Keymap.DEFAULT_TARGET
    this.map = {
      [Keymap.DEFAULT_TARGET]: {},
    }
    if (element)
      this.install(element)
  }

  // 绑定指定的按键标识符和指定的处理程序函数
  bind(key: string | string[], func: KeyHandler, target?: string): void {
    target = target || this.target
    if (!this.map[target]) this.map[target] = {}
    if (isArray(key)) {
      key.forEach((keyItem) => {
        this.map[target][Keymap.normalize(keyItem)] = func
      })
    }
    else
      this.map[target][Keymap.normalize(key)] = func
  }

  // 删除指定按键标识符的绑定
  unbind(key: string | string[], target?: string): void {
    target = target || this.target
    if (isArray(key)) {
      key.forEach((keyItem) => {
        delete this.map[target][Keymap.normalize(keyItem)]
      })
    }
    else
      delete this.map[target][Keymap.normalize(key)]
  }

  // 删除对象下所有指定按键标识符的绑定
  unbindTarget(target: string = Keymap.DEFAULT_TARGET): void {
    delete this.map[target]
  }

  // 绑定切换对象
  bindTarget(target: string = Keymap.DEFAULT_TARGET): void {
    this.target = target
  }

  // 在指定 HTML 元素上配置 Keymap
  install(element: HTMLElement): void {
    const handler = (event: KeyboardEvent) => {
      return this.dispatch(event, element)
    }

    if (element.addEventListener) element.addEventListener('keydown', handler, false)
    else if ((element as any).attachEvent) (element as any).attachEvent('onkeydown', handler)
  }

  // 分派事件
  dispatch(event: KeyboardEvent, element: HTMLElement): any {
    const mapTarget = this.map[this.target]
    const mapDefaultTarget = this.map[Keymap.DEFAULT_TARGET]
    let modifiers = ''
    let keyId = ''
    let keyName = null

    if (!mapTarget && !mapDefaultTarget) return

    // 按照标准的小写字母顺序构建辅助键字符串
    if (event.altKey) modifiers += 'alt_'
    if (event.ctrlKey) modifiers += 'ctrl_'
    if (event.metaKey) modifiers += 'meta_'
    if (event.shiftKey) modifiers += 'shift_'

    // 如果实现 3 级 DOM 规范的 key 属性，获取 key
    if (event.key) keyName = event.key
    // 在 Safari 和 Chrome 上用 keyIdentifier 获取功能键键名
    else if ('keyIdentifier' in event && (event as any).keyIdentifier.substring(0, 2) !== 'U+')
      keyName = (event as any).keyIdentifier
    else keyName = Keymap.keyCodeToKeyName[event.keyCode]

    // 如果不能找出键名，只能返回并忽略这个事件
    if (!keyName) return

    // 标准的按键 id 是辅助键加上按键名
    keyId = modifiers + keyName.toLowerCase()

    // 查看按键标识符是否绑定了任何东西
    const handler = (mapTarget && mapTarget[keyId]) || (mapDefaultTarget && mapDefaultTarget[keyId])
    if (handler) {
      // 调用处理函数
      const retVal = handler.call(element, event, keyId)

      // 如果处理程序返回 false，取消默认操作并阻止冒泡
      if (retVal === false) {
        if (event.stopPropagation) event.stopPropagation() // DOM 模型
        else event.cancelBubble = true // IE 模型

        if (event.preventDefault) event.preventDefault() // DOM
        else event.returnValue = false // IE
      }

      return retVal
    }
  }

  // 用于把按键标识符转换成标准形式的工具函数
  // 在非 Mac 硬件，把“meta”映射到“ctrl”
  // 这样在“mac”中“Meta+C”将变成“Command+C”，其他都是“Ctrl+C”
  private static normalize(keyId: string): string {
    let words = []
    let keyName = ''

    keyId = keyId.toLowerCase() // 一切都是小写
    words = keyId.split(/\s|[-+_]/) // 分割辅助键和键名
    keyName = words.pop() || '' // 键名是最后一个
    keyName = Keymap.aliases[keyName] || keyName
    words.sort() // 排序剩下的辅助键
    words.push(keyName) // 添加到序列化名字后面
    return words.join('_') // 把它们拼接起来
  }
}

export function useKeyMap(element: HTMLElement): Keymap {
  return new Keymap(element)
}
