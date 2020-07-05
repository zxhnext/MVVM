/*
 * @Author: your name
 * @Date: 2020-07-04 23:14:56
 * @LastEditTime: 2020-07-04 23:46:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MVVM/js/batcher.js
 */ 
class Batcher {
    constructor () {
        this.has = {}
        this.queue = []
        this.waiting = false
    }

    push(job) {
        let id = job.id
        if (!this.has[id]) {
            this.queue.push(job)
            //设置元素的ID
            this.has[id] = true
            if (!this.waiting) {
                this.waiting = true
                if ("Promise" in window) {
                    Promise.resolve().then( ()=> {
                        this.flush()
                    })
                } else {
                    setTimeout(() => {
                        this.flush()
                    }, 0)
                }
            }
        }
    }

    flush() {
        this.queue.forEach((job) => {
            job.cb(job.newValue)
        })
        this.reset()
    }

    reset() {
        this.has = {}
        this.queue = []
        this.waiting = false
    }
}
