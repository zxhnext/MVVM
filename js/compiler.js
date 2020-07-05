/*
 * @Author: your name
 * @Date: 2020-07-02 21:04:06
 * @LastEditTime: 2020-07-04 23:49:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /MVVM/js/Compiler.js
 */ 
class Compiler {
    constructor (vm) {
        this.el = vm.$el
        this.vm = vm
        // 把当前节点中的元素获取到，放入内存中
        let fragment = this.node2fragment(this.el)
        // 编译模版
        this.compile(fragment)

        // 把编译后的内容替换原来页面
        this.el.appendChild(fragment)
    }

    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if(this.isTextNode(node)) {
                this.compileText(node)
            } else if(this.isElementNode(node)) {
                this.compileElement(node)
            }
            if(node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    compileElement(node) {
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // v-text --> text
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update(node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }

    textUpdater(node, value, key) {
        node.textContent = value
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }

    modelUpdater(node, value, key) {
        node.value = value

        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })

        // 双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }

    compileText(node) {
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if(reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }

    // 把节点移入到内存中
    node2fragment(node) {
        // 创建一个节点片段
        let fragment = document.createDocumentFragment()
        let firstChild;
        while (firstChild = node.firstChild) {
            // appendChild具有移动性
            fragment.appendChild(firstChild)
        }
        return fragment
    }

    // 判断元素属性是否是指令
    isDirective (attrName) {
        return attrName.startsWith('v-')
    }

    // 判断节点是否是文本节点
    isTextNode (node) {
        return node.nodeType === 3
    }
    // 判断节点是否是元素节点
    isElementNode (node) {
        return node.nodeType === 1
    }
}
