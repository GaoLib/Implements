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
    while(target.next) {
      if (target.next.key === key) {
        target.next.value = value
        return this
      }
      target = target.next
    }
    target.next = {key, value, next: null}
    return this
  }

  hash(key) {
    let index
    if (typeof key === 'string') {
      index = 0
    } else if (typeof key === 'number') {
      index = key % this.bucket.length
    } else if (typeof key === 'undefined') {
      index = 1
    } else if (typeof key === 'object') {
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
