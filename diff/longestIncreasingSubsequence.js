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
    const node1 = child1[e1]
    const node2 = child2[e2]
    if (isSameVnodeType(node1, node2)) {
      patch(node1.key)
    } else {
      break
    }
    e1--
    e2--
  }
  // * 3.旧节点没了，新节点还有
  if (i > e1) {
    if (i <= e2) {
      while (i <= e2) {
        const node2 = child2[i]
        mountElement(node2.key)
        i++
      }
    }
  }
}