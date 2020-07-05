/*
 * @Author: your name
 * @Date: 2020-07-03 10:20:42
 * @LastEditTime: 2020-07-04 17:36:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MVVM/js/dep.js
 */ 
class Dep {
    constructor() {
        this.subs = []
    }

    addSub(sub) {
        if(sub && sub.update) {
            this.subs.push(sub)
        }
    }

    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}
