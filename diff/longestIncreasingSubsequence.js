// child1：旧数组，child2：新数组
const diffArray = (child1, child2, { mountElement, unmount, patch, move }) => {
  const isSameVnodeType = (n1, n2) => {
    return n1.key === n2.key && n1.type === n2.type
  }

  const getSequence = (arr) => {
    const recordIndexOfI = arr.slice()
    const result = [0]
    const len = arr.length

    let resultLastIndex
    let resultLast

    for (let i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        // result最后一个元素
        resultLastIndex = result.length - 1;
        resultLast = result[resultLastIndex];
        if (arr[resultLast] < arrI) {
          recordIndexOfI[i] = resultLast;
          result.push(i);
          continue;
        }
        let left = 0,
          right = resultLastIndex;
        while (left < right) {
          const mid = (left + right) >> 1;
          if (arr[result[mid]] < arrI) {
            left = mid + 1;
          } else {
            right = mid;
          }
        }

        if (arrI < arr[result[left]]) {
          if (left > 0) {
            recordIndexOfI[i] = result[left - 1];
          }
          result[left] = i;
        }
      }
    }

    //  recordIndexOfI记录了正确的索引 result 进而找到最终正确的索引
    resultLastIndex = result.length - 1;
    resultLast = result[resultLastIndex];

    while (resultLastIndex >= 0) {
      result[resultLastIndex] = resultLast;
      resultLast = recordIndexOfI[resultLast];
      resultLastIndex--;
    }

    return result
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
    // ! 5-1. 新的VDOM做成Map,方便查找，修改
    const keyToNewIndexMap = new Map()
    for (i = start2; i <= end2; i++) {
      const node = child2[i]
      keyToNewIndexMap.set(node.key, i)
    }
    // ! 5-2. 遍历旧的VDOM，在Map中找到则patch，否则unmount
    
    const toBePatched = end2 - start2 + 1
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0)  // * 下标为新元素的相对索引，值为旧元素索引

    // ! 用来标记是否需要移动
    let moved = false
    let maxNewIndexSoFar = 0

    for (i = start1; i <= end1; i++) {
      const prevChild = child1[i]
      let newIndex = keyToNewIndexMap.get(prevChild.key)
      if (newIndex === undefined) {
        unmount(prevChild.key)
      } else {
        newIndexToOldIndexMap[newIndex - start2] = i + 1
        patch(prevChild.key)

        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex
        } else {
          moved = true
        }
      }
    }

    // * 最长递增子序列，移动最少更新
    const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : []

    let lastIndex = increasingNewIndexSequence.length - 1


    // ! 5-3. 遍历新的VDOM，如果在旧的中没有找到mount，找到位置变化则move
    for (let i = toBePatched - 1;i >= 0; i--) {
      const nextIndex = start2 + i
      const nextChild = child2[nextIndex]
      if (newIndexToOldIndexMap[i] === 0) {
        mountElement(nextChild.key)
      } else if (moved) {
        // ! 如果当前节点在最长递增子序列中则不需要移动，否则移动
        if (lastIndex < 0 || i !== increasingNewIndexSequence[lastIndex]) {
          move(nextChild.key)
        } else {
          lastIndex--
        }
      }
    }
  }
}