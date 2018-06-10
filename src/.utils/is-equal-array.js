function isEqualArray(arrayA, arrayB, offset) {
    const lengthA = arrayA == null ? 0 : arrayA.length
    const lengthB = arrayB == null ? 0 : arrayB.length

    if (lengthA !== lengthB) {
        return false
    }
    let index = offset !== undefined ? offset - 1 : -1
    while (++index < lengthA) {
        if (arrayA[index] !== arrayB[index]) {
            return false
        }
    }
    return true
}

export default isEqualArray
