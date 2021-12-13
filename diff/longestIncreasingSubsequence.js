// child1：旧数组，child2：新数组
const diffArray = (child1, child2, { mountElement, unmount, patch, move }) => {
  const isSameVnodeType = (n1, n2) => {
    return n1.key === n2.key && n1.type === n2.type
  }

  const len1 = child1.length
  const len2 = child2.length

  const end1 = len1 - 1
  const end2 = len2 - 1

  // ! 双端校验
  // * 1.从首端（左边）开始按序查找，直到不匹配
  let i = 0
  while (i <= end1 && i <= end2) {
    const node1 = child1[i]
    const node2 = child2[i]
    if (isSameVnodeType(node1, node2)) {
      patch(node1.key)
    } else {
      break
    }
    i++
  }
  // * 2.从末端（右边）开始按序查找，直到不匹配
  while (i <= end1 && i <= end2) {
    const node1 = child1[end1]
    const node2 = child2[end2]
    if (isSameVnodeType(node1, node2)) {
      patch(node1.key)
    } else {
      break
    }
    end1--
    end2--
  }
  // * 3.旧节点没了，新节点还有
  if (i > end1) {
    if (i <= end2) {
      while (i <= end2) {
        const node = child2[i]
        mountElement(node.key)
        i++
      }
    }
  // * 4.新节点没了，旧节点还有
  } else if (i > end2) {
    while (i <= end1) {
      const node = child1[i]
      unmount(node.key)
      i++
    }
  // * 5.新旧节点都还有，且乱序
  } else {
    const start1 = i
    const start2 = i
    // ! 1. 新的VDOM做成Map,方便查找，修改
    const keyToNewIndexMap = new Map()
    for (i = start2; i <= end2; i++) {
      const node = child2[i]
      keyToNewIndexMap.set(node.key, i)
    }
    // ! 2. 遍历旧的VDOM，在Map中找到则patch，否则unmount
    for (i = start1; i <= end1; i++) {
      const prevChild = child1[i]
      let newIndex = keyToNewIndexMap.get(prevChild.key)
      if (newIndex === undefined) {
        unmount(prevChild.key)
      } else {
        patch(prevChild.key)
      }
    }
  }
}