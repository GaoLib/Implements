class GMap {
  constructor () {
    this.size(0)
    this.bucket = new Array(8)
  }

  hash(key) {
    let index
    if (typeof key === 'string') {
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
    return index
  }
}
