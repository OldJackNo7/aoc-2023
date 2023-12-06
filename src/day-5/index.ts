import * as fs from 'fs'

interface PositionChangeA extends PositionA {
    destinationStartRange: number
}

interface PositionA {
    sourceStartRange: number
    rangeLength: number
}

const isStateChangeLine = (line: string): boolean => {
    if (line.includes('seeds')) return true
    if (line.includes('seed-to-soil')) return true
    if (line.includes('soil-to-fertilizer')) return true
    if (line.includes('fertilizer-to-water')) return true
    if (line.includes('water-to-light')) return true
    if (line.includes('light-to-temperature')) return true
    if (line.includes('temperature-to-humidity')) return true
    return line.includes('humidity-to-location')
}

const updateSeedsPosition = (
    seeds: number[],
    positionChanges: PositionChangeA[]
): number[] => {
    return seeds.map((seed) => {
        for (const positionChange of positionChanges) {
            const { destinationStartRange, sourceStartRange, rangeLength } =
                positionChange
            if (
                seed >= sourceStartRange &&
                seed < sourceStartRange + rangeLength
            ) {
                const offset = seed - sourceStartRange
                return destinationStartRange + offset
            }
        }
        return seed
    })
}
//
const partA = () => {
    const input = fs.readFileSync('./src/day-5/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    let seeds: number[] = []
    const positionChanges: PositionChangeA[] = []
    for (const line of lines) {
        if (!line) continue
        if (line.includes('seeds')) {
            const [, seedsStr] = line.split(': ')
            seeds.push(...seedsStr.split(' ').map(Number))
            continue
        }
        if (isStateChangeLine(line)) {
            seeds = updateSeedsPosition(seeds, positionChanges)
            positionChanges.splice(0, positionChanges.length)
            // console.log(`End of state -> ${seeds.toString()}`)
            continue
        }
        const [destinationStartRange, sourceStartRange, rangeLength] = line
            .split(' ')
            .map(Number)
        positionChanges.push({
            destinationStartRange,
            sourceStartRange,
            rangeLength,
        })
    }
    seeds = seeds = updateSeedsPosition(seeds, positionChanges)
    // console.log(`End of state -> ${seeds.toString()}`)
    console.log(`Result A: ${Math.min(...seeds)}`)
}

interface Position {
    start: number
    end: number
    length: number
}

interface PositionChange {
    destination: number
    start: number
    length: number
}

const positionInsideOrEqualToChange = (
    seed: Position,
    change: PositionChange
): Position[] => {
    const changeStart = change.start
    const changeEnd = change.start + change.length - 1
    if (seed.start >= changeStart && seed.end <= changeEnd) {
        const offset = seed.start - changeStart
        const newStart = change.destination + offset
        const newEnd = newStart + seed.length - 1
        return [{ start: newStart, end: newEnd, length: seed.length }]
    }
    return []
}

const positionStartsOutsideAndEndsInsideChange = (
    seed: Position,
    change: PositionChange
): Position[] => {
    const changeStart = change.start
    const changeEnd = change.start + change.length - 1
    if (
        seed.start < changeStart &&
        seed.end >= changeStart &&
        seed.end <= changeEnd
    ) {
        const frontEnd = changeStart - 1
        const frontLength = frontEnd - seed.start + 1
        const newLength = seed.end - changeStart + 1
        const newStart = change.destination
        const newEnd = newStart + newLength - 1
        return [
            {
                start: newStart,
                end: newEnd,
                length: newLength,
            },
            {
                start: seed.start,
                end: frontEnd,
                length: frontLength,
            },
        ]
    }
    return []
}

const positionStartsInsideAndEndsOutsideChange = (
    seed: Position,
    change: PositionChange
): Position[] => {
    const changeStart = change.start
    const changeEnd = change.start + change.length - 1
    if (
        seed.start >= changeStart &&
        seed.start <= changeEnd &&
        seed.end > changeEnd
    ) {
        const offset = seed.start - changeStart
        const newStart = change.destination + offset
        const newLength = change.length - offset
        const newEnd = newStart + newLength - 1
        const endStart = changeEnd + 1
        const endLength = seed.end - endStart + 1
        return [
            {
                start: newStart,
                end: newEnd,
                length: newLength,
            },
            {
                start: endStart,
                end: seed.end,
                length: endLength,
            },
        ]
    }
    return []
}

const positionContainsChange = (
    seed: Position,
    change: PositionChange
): Position[] => {
    const changeStart = change.start
    const changeEnd = change.start + change.length - 1
    if (seed.start < changeStart && seed.end > changeEnd) {
        const frontStart = seed.start
        const frontEnd = changeStart - 1
        const frontLength = frontEnd - frontStart + 1
        const middleStart = change.destination
        const middleEnd = middleStart + change.length - 1
        const middleLength = change.length
        const endStart = changeEnd + 1
        const endEnd = seed.end
        const endLength = endEnd - endStart + 1
        return [
            {
                start: frontStart,
                end: frontEnd,
                length: frontLength,
            },
            {
                start: middleStart,
                end: middleEnd,
                length: middleLength,
            },
            {
                start: endStart,
                end: endEnd,
                length: endLength,
            },
        ]
    }
    return []
}

const computePositionUpdate = (
    seed: Position,
    positionChange: PositionChange
): Position[] => {
    let result = positionInsideOrEqualToChange(seed, positionChange)
    if (result.length > 0) return result
    result = positionStartsOutsideAndEndsInsideChange(seed, positionChange)
    if (result.length > 0) return result
    result = positionStartsInsideAndEndsOutsideChange(seed, positionChange)
    if (result.length > 0) return result
    result = positionContainsChange(seed, positionChange)
    if (result.length > 0) return result
    return []
}

const updatePositions = (
    seedPositions: Position[],
    changeArr: PositionChange[]
): Position[] => {
    const newSeeds: Position[] = []
    const copy = [...seedPositions]
    for (let i = 0; i < copy.length; i++) {
        const position = copy[i]
        let hasChanged = false
        for (const posChange of changeArr) {
            const possibleChanges = computePositionUpdate(position, posChange)
            if (possibleChanges.length > 0) {
                if (possibleChanges.length === 2) {
                    newSeeds.push(possibleChanges[0])
                    copy.push(possibleChanges[1])
                } else if (possibleChanges.length === 3) {
                    copy.push(possibleChanges[0])
                    newSeeds.push(possibleChanges[1])
                    copy.push(possibleChanges[2])
                } else {
                    newSeeds.push(possibleChanges[0])
                }
                hasChanged = true
                break
            }
        }
        if (!hasChanged) {
            newSeeds.push(position)
        }
    }
    return newSeeds
}

const partB = () => {
    const input = fs.readFileSync('./src/day-5/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    let seedPositions: Position[] = []
    const positionChanges: PositionChange[] = []
    for (const line of lines) {
        if (!line) continue
        if (line.includes('seeds')) {
            const [, seedsRangeStr] = line.split(': ')
            const seedsRange = seedsRangeStr.split(' ').map(Number)
            for (let i = 0; i < seedsRange.length; i += 2) {
                seedPositions.push({
                    start: seedsRange[i],
                    end: seedsRange[i] + seedsRange[i + 1] - 1,
                    length: seedsRange[i + 1],
                })
            }
            continue
        }
        if (isStateChangeLine(line)) {
            seedPositions = updatePositions(seedPositions, positionChanges)
            positionChanges.splice(0, positionChanges.length)
            continue
        }
        const [destination, start, length] = line.split(' ').map(Number)
        const positionChange = {
            destination,
            start,
            length,
        }
        positionChanges.push(positionChange)
    }
    seedPositions = updatePositions(seedPositions, positionChanges)

    let minPosition = Infinity
    seedPositions.forEach((position) => {
        if (position.start < minPosition) minPosition = position.start
    })

    console.log(`Result B: ${minPosition}`)
}
partA()
partB()
