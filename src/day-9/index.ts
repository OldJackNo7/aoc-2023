import * as fs from 'fs'

const isEverythingZero = (values: number[]): boolean => {
    return values.every((val) => val === 0)
}

const computeSequence = (values: number[]): number[] => {
    const nextSequence: number[] = []
    for (let i = 0; i < values.length - 1; i++) {
        nextSequence.push(values[i + 1] - values[i])
    }
    return nextSequence
}

const predictEndValue = (values: number[]): number => {
    let prediction = 0
    const allSequences: number[][] = []
    let currentSequence = values
    while (!isEverythingZero(currentSequence)) {
        allSequences.push(currentSequence)
        currentSequence = computeSequence(currentSequence)
    }
    allSequences.push(currentSequence)
    allSequences.reverse()
    allSequences.forEach((sequence) => {
        prediction += sequence[sequence.length - 1]
    })
    return prediction
}

const predictStartValue = (values: number[]): number => {
    let prediction = 0
    const allSequences: number[][] = []
    let currentSequence = values
    while (!isEverythingZero(currentSequence)) {
        allSequences.push(currentSequence)
        currentSequence = computeSequence(currentSequence)
    }
    allSequences.push(currentSequence)
    allSequences.reverse()
    allSequences.forEach((sequence) => {
        prediction = sequence[0] - prediction
    })
    return prediction
}

const computeAllEndPredictions = (histories: number[][]): number => {
    let predictionSum = 0
    for (const history of histories) {
        predictionSum += predictEndValue(history)
    }
    return predictionSum
}

const computeAllStartPredictions = (histories: number[][]): number => {
    let predictionSum = 0
    for (const history of histories) {
        predictionSum += predictStartValue(history)
    }
    return predictionSum
}

const partA = () => {
    const input = fs.readFileSync('./src/day-9/test-a.txt', 'utf-8')
    const histories = input
        .split('\n')
        .map((history) => history.split(' ').map(Number))
    const predictionSum = computeAllEndPredictions(histories)

    console.log(`Part A: ${predictionSum}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-9/test-a.txt', 'utf-8')
    const histories = input
        .split('\n')
        .map((history) => history.split(' ').map(Number))
    const predictionSum = computeAllStartPredictions(histories)

    console.log(`Part B: ${predictionSum}`)
}

partA()
partB()
