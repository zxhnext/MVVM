// defineReactive
class Observer {
    constructor (data) {
        this.walk(data)
    }
    
    walk(data) {
        // 1. 判断data是否是对象
        if (!data || typeof data !== 'object') {
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(data, key, val) {
        let _self = this
        let dep = new Dep()
        this.walk(val)
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newValue) {
                if(newValue !== val) {
                    val = newValue
                    _self.walk(newValue)
                    dep.notify()
                }
            }
        })
    }
}
