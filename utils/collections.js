export function findLastIndex (array, predicate) {
  for (let index = array.length - 1; index >= 0; index -= 1) {
    if (predicate(array[index], index, array)) {
      return index
    }
  }
  return -1
}

export function zipMap (array1, array2, predicate) {
  const output = []
  const length = Math.max(array1.length, array2.length)
  for (let index = 0; index < length; index += 1) {
    output.push(predicate(array1[index], array2[index], index, array1, array2))
  }
  return output
}

export function subarrayEquals (array1, array2, startIndex, count) {
  const length = startIndex + count
  for (let index = startIndex; index < length; index += 1) {
    const item1 = array1[index]
    const item2 = array2[index]
    if (item1 instanceof Date && item2 instanceof Date) {
      if (item1.getTime() !== item2.getTime()) {
        return false
      }
    } else if (item1 !== item2) {
      return false
    }
  }
  return true
}
