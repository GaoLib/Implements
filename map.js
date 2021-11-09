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
    }
    return index
  }
}
