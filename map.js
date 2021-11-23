class GMap {
  constructor () {
    this.size = 0
    this.bucket = new Array(8)

    for (let i=0;i<8;i++) {
      this.bucket[i] = {}
      this.bucket[i].next = null
    }
  }

  set(key, value) {
    const i = this.hash(key)
    let target = this.bucket[i]
    while (target.next) {
      if (target.next.key === key) {
        target.next.value = value
        return this
      }
      target = target.next
    }
    target.next = {key, value, next: null}
    this.size++
    return this
  }

  get(key) {
    const i = this.hash(key)
    let target = this.bucket[i]
    while (target.next) {
      if (target.next.key === key) {
        return target.next.value
      }
      target = target.next
    }
  }

  has(key) {
    const i = this.hash(key)
    let target = this.bucket[i]
    while (target.next) {
      if (target.next.key === key) {
        return true
      }
      target = target.next
    }
    return false
  }

  delete(key) {
    const i = this.hash(key)
    let target = this.bucket[i]
    while (target.next) {
      if (target.next.key === key) {
        target.next = target.next.next
        return true
      }
      target = target.next
    }
    return false
  }

  hash(key) {
    let index = 0
    if (typeof key === 'object') {
      index = 0
    } else if (typeof key === 'number') {
      index = key % this.bucket.length
    } else if (typeof key === 'undefined') {
      index = 1
    } else if (typeof key === 'boolean') {
      index = 2
    } else if (typeof key === 'string') {
      for (let i=0;i<10;i++) {
        index += isNaN(key.charCodeAt(i)) ? 0 : key.charCodeAt(i)
      }
    }
    index = index % this.bucket.length
    return index
  }
}

const o = {}
const map = new GMap([
  ['key1', 'value1'],
  ['key1', 'value1']
])

map
  .set('key2', 'value2')
  .set(o, 'object1')
  .set(o, 'object2')

console.log(map)
console.log(map.get(o))
console.log(map.has('a'))
map.delete(o)
console.log(map.has(o))
