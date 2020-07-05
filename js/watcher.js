let uid = 0
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key
        this.cb = cb
        this.id = ++uid
        // 把watcher对象记录到Dep类的静态属性target
        Dep.target = this
        // 触发get方法，在get方法中会调用addSub
        this.oldValue = vm[key]
        this.newValue = ''
        Dep.target = null
    }

    update() {
        this.newValue = this.vm[this.key]
        if(this.oldValue !== this.newValue) {
            if(!batcher){
                batcher = new Batcher()
            }
            batcher.push(this)
        }
    }
}
