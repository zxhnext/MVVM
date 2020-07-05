class Vue {
    constructor (options) {
        // 1. 通过属性保存选项的数据
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

        // 2. 把data中的成员转换成getter和setter，注入到vue实例中
        this._proxyData(this.$data)
        this._proxyComputed(this.$options.computed)
        this._proxyMethod(this.$options.methods)
        // 3. 调用observer对象，监听数据的变化
        new Observer(this.$data)
        // 4. 调用compiler对象，解析指令和差值表达式
        new Compiler(this)
    }

    _proxyComputed(computed) {
        for (let key in computed) {
            Object.defineProperty(this, key, {
                get: (data) => {
                    return computed[key].call(this, data)
                }
            })
        }
    }

    _proxyMethod(methods) {
        for (let key in methods) {
            Object.defineProperty(this, key, {
                get() {
                    return methods[key]
                }
            })
        }
    }

    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newValue) {
                    if(newValue !== data[key]) {
                        data[key] = newValue
                    }
                }
            })
        })
    }
}
  