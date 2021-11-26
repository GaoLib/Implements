// array1：旧数组，array2：新数组
const diffArray = (array1, array2, { mountElement, unmount, patch, move }) => {
  const isSameVnodeType = (n1, n2) => {
    return n1.key === n2.key && n1.type === n2.type
  }

  const len1 = array1.length
  const len2 = array2.length

  const end1 = len1 - 1
  const end2 = len2 - 1

  let i = 0
  // ! 双端校验
  // * 1.从首端（左边）开始按序查找，直到不匹配
  while (i < end1 && 1 < end2) {
    const node1 = array1[i]
    const node2 = array2[i]
    if (isSameVnodeType(node1, node2)) i++
  }
}