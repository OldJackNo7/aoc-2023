import * as fs from 'fs'

const NUMBER_REGEX = /\d+/g

const stringHasSymbol = (toCheck: string): boolean => {
    return toCheck.replace(/\.|\d/g, '').length > 0
}

const stringHasGear = (toCheck: string): number => {
    if (Array.from(toCheck.matchAll(/\*/g)).length > 1) {
        console.log('BUBA!')
    }
    return toCheck.indexOf('*')
}

const hasSymbolAdjacent = (
    schematic: string[],
    lineIndex: number,
    startIndex: number,
    length: number
): boolean => {
    const rowStartIndex = startIndex === 0 ? startIndex : startIndex - 1
    const rowEndIndex =
        startIndex + length === schematic[lineIndex].length - 1
            ? startIndex + length
            : startIndex + length + 1
    for (let i = lineIndex - 1; i <= lineIndex + 1; i++) {
        if (i < 0 || i >= schematic.length) continue
        const toCheck = schematic[i].slice(rowStartIndex, rowEndIndex)
        if (stringHasSymbol(toCheck)) return true
    }
    return false
}

const addToGearArray = (
    schematic: string[],
    lineIndex: number,
    startIndex: number,
    length: number,
    gears: Map<string, number[]>,
    partNumber: number
): boolean => {
    const rowStartIndex = startIndex === 0 ? startIndex : startIndex - 1
    const rowEndIndex =
        startIndex + length === schematic[lineIndex].length - 1
            ? startIndex + length
            : startIndex + length + 1
    for (let i = lineIndex - 1; i <= lineIndex + 1; i++) {
        if (i < 0 || i >= schematic.length) continue
        const toCheck = schematic[i].slice(rowStartIndex, rowEndIndex)
        const gearIndex = stringHasGear(toCheck)
        const gearKey = `${i}:${rowStartIndex + gearIndex}`
        if (gearIndex !== -1) {
            if (gears.has(gearKey)) {
                // @ts-expect-error I have no idea what is going wrong here
                gears.get(gearKey).push(partNumber)
            } else {
                gears.set(gearKey, [partNumber])
            }
        }
    }
    return false
}

const partA = () => {
    const input = fs.readFileSync('./src/day-3/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    const height = lines.length
    let partSum = 0
    for (let i = 0; i < height; i++) {
        const numbersMatchArray = Array.from(lines[i].matchAll(NUMBER_REGEX))
        numbersMatchArray.forEach((numberMatch) => {
            const partNumber = Number(numberMatch[0])
            const partNumberLength = numberMatch[0].length
            const partNumberStartIndex = numberMatch.index ?? 0
            const hasSymbol = hasSymbolAdjacent(
                lines,
                i,
                partNumberStartIndex,
                partNumberLength
            )
            // console.log(`${i} -> ${partNumber} -> ${hasSymbol}`)
            if (hasSymbol) {
                partSum += partNumber
            }
        })
    }
    console.log(`Result A: ${partSum}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-3/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    const height = lines.length
    let gearRatioSum = 0
    const gears = new Map<string, number[]>()
    for (let i = 0; i < height; i++) {
        const numbersMatchArray = Array.from(lines[i].matchAll(NUMBER_REGEX))
        numbersMatchArray.forEach((numberMatch) => {
            const partNumber = Number(numberMatch[0])
            const partNumberLength = numberMatch[0].length
            const partNumberStartIndex = numberMatch.index ?? 0
            addToGearArray(
                lines,
                i,
                partNumberStartIndex,
                partNumberLength,
                gears,
                partNumber
            )
        })
    }
    const gearValues = gears.values()
    for (const partNumbers of gearValues) {
        if (partNumbers.length === 2) {
            gearRatioSum += partNumbers[0] * partNumbers[1]
        }
    }
    console.log(`Result B: ${gearRatioSum}`)
}

partA()
partB()
