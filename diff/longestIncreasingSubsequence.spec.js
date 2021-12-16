describe('Array Diff', () => {
  it('1. 左边查找', () => {
    const mountElement = jest.fn()
    const unmount = jest.fn()
    const patch = jest.fn()
    const move = jest.fn()
    const { diffArray } = require('./longestIncreasingSubsequence')
    diffArray(
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
      [{ key: 'a' }, { key: 'b' }, { key: 'd' }, { key: 'e' }],
      {
        mountElement,
        unmount,
        patch,
        move
      }
    )
    expect(patch.mock.calls.length).toBe(2)
    expect(patch.mock.calls[0][0]).toBe('a')
    expect(patch.mock.calls[1][0]).toBe('b')
  })
  it('2. 右边查找', () => {
    const mountElement = jest.fn()
    const unmount = jest.fn()
    const patch = jest.fn()
    const move = jest.fn()
    const { diffArray } = require('./longestIncreasingSubsequence')
    diffArray(
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
      [{ key: 'd' }, { key: 'e' }, { key: 'b' }, { key: 'c' }],
      {
        mountElement,
        unmount,
        patch,
        move
      }
    )
    expect(patch.mock.calls.length).toBe(2)
    expect(patch.mock.calls[0][0]).toBe('c')
    expect(patch.mock.calls[1][0]).toBe('b')
  })
  it('3. 旧节点没了，新节点还有', () => {
    const mountElement = jest.fn()
    const unmount = jest.fn()
    const patch = jest.fn()
    const move = jest.fn()
    const { diffArray } = require('./longestIncreasingSubsequence')
    diffArray(
      [{ key: 'a' }, { key: 'b' }],
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
      {
        mountElement,
        unmount,
        patch,
        move
      }
    )
    expect(patch.mock.calls.length).toBe(2)
    expect(patch.mock.calls[0][0]).toBe('a')
    expect(patch.mock.calls[1][0]).toBe('b')
    expect(mountElement.mock.calls[0][0]).toBe('c')
  })
  it('4. 新节点没了，旧节点还有', () => {
    const mountElement = jest.fn()
    const unmount = jest.fn()
    const patch = jest.fn()
    const move = jest.fn()
    const { diffArray } = require('./longestIncreasingSubsequence')
    diffArray(
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }],
      [{ key: 'a' }, { key: 'b' }],
      {
        mountElement,
        unmount,
        patch,
        move
      }
    )
    expect(patch.mock.calls.length).toBe(2)
    expect(patch.mock.calls[0][0]).toBe('a')
    expect(patch.mock.calls[1][0]).toBe('b')
    expect(unmount.mock.calls[0][0]).toBe('c')
  })
  it('5. 新旧节点都有，且乱序', () => {
    const mountElement = jest.fn()
    const unmount = jest.fn()
    const patch = jest.fn()
    const move = jest.fn()
    const { diffArray } = require('./longestIncreasingSubsequence')
    diffArray(
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }, { key: 'f' }, { key: 'g' }],
      [{ key: 'a' }, { key: 'b' }, { key: 'e' }, { key: 'd' }, { key: 'c' }, { key: 'h' }, { key: 'f' }, { key: 'g' }],
      {
        mountElement,
        unmount,
        patch,
        move
      }
    )
    expect(patch.mock.calls.length).toBe(7)
    expect(patch.mock.calls[0][0]).toBe('a')
    expect(patch.mock.calls[1][0]).toBe('b')
    expect(patch.mock.calls[2][0]).toBe('g')
    expect(patch.mock.calls[3][0]).toBe('f')
    expect(patch.mock.calls[4][0]).toBe('c')
    expect(patch.mock.calls[5][0]).toBe('d')
    expect(patch.mock.calls[6][0]).toBe('e')
    expect(unmount.mock.calls.length).toBe(0)
    expect(mountElement.mock.calls[0][0]).toBe('h')
    expect(move.mock.calls[0][0]).toBe('d')
    expect(move.mock.calls[1][0]).toBe('e')
  })
  it('6. 新旧节点都有，且乱序，最长递增', () => {
    const mountElement = jest.fn()
    const unmount = jest.fn()
    const patch = jest.fn()
    const move = jest.fn()
    const { diffArray } = require('./longestIncreasingSubsequence')
    diffArray(
      [{ key: 'a' }, { key: 'b' }, { key: 'c' }, { key: 'd' }, { key: 'e' }, { key: 'f' }, { key: 'g' }],
      [{ key: 'a' }, { key: 'b' }, { key: 'e' }, { key: 'c' }, { key: 'd' }, { key: 'h' }, { key: 'f' }, { key: 'g' }],
      //   0  1  2  3  4  5  6  7
      //   a  b [c  d  e] f  g
      //   a  b [e  c  d  h] f  g
      //        [5, 3, 4, 0]  ->  newIndexToOldIndexMap     
      {
        mountElement,
        unmount,
        patch,
        move
      }
    )
    expect(patch.mock.calls.length).toBe(7)
    expect(patch.mock.calls[0][0]).toBe('a')
    expect(patch.mock.calls[1][0]).toBe('b')
    expect(patch.mock.calls[2][0]).toBe('g')
    expect(patch.mock.calls[3][0]).toBe('f')
    expect(patch.mock.calls[4][0]).toBe('c')
    expect(patch.mock.calls[5][0]).toBe('d')
    expect(patch.mock.calls[6][0]).toBe('e')
    expect(unmount.mock.calls.length).toBe(0)
    expect(mountElement.mock.calls[0][0]).toBe('h')
    expect(move.mock.calls[0][0]).toBe('d')
    expect(move.mock.calls[1][0]).toBe('e')
  })
})