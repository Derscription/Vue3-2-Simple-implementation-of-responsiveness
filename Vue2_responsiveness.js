let effect = null
// 依赖对象
class Depend {
	constructor() {
		this.reactiveFns = new Set()
	}

	depend() {
		if (!effect) return
		this.reactiveFns.add(effect)
	}

	notify() {
		this.reactiveFns.forEach(fn => fn())
	}
}

// 响应式函数
function watch(fn) {
	effect = fn
	fn()
	effect = null
}

// 收集依赖对象
let targetWeakMap = new WeakMap()
function getDepend(target, key) {
	let map = targetWeakMap.get(target)
	if (!map) {
		map = new Map()
		targetWeakMap.set(target, map)
	}

	let depend = map.get(key)
	if (!depend) {
		depend = new Depend()
		map.set(key, depend)
	}

	return depend
}

// 监听对象变化
const reactive = function (obj) {
	Object.keys(obj).forEach(key => {
		let value = obj[key]
		Object.defineProperty(obj, key, {
			get() {
				const depend = getDepend(obj, key)
				depend.depend()

				return value
			},
			set(newValue) {
				value = newValue
				const depend = getDepend(obj, key)
				depend.notify()
			},
		})
	})

	return obj
}

// 案例
const obj = reactive({
	name: "west",
	age: 18,
})

watch(() => {
	console.log(obj.name)
	console.log("----------")
})

obj.name = "coder"
