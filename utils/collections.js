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
    if (array1[index] !== array2[index]) {
      return false
    }
  }
  return true
}
