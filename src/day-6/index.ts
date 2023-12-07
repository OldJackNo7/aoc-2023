import * as fs from 'fs'

const calculateSolution = (times: number[], distances: number[]): number => {
    let solution = 1
    for (const [index, time] of times.entries()) {
        let count = 0
        for (let i = 1; i < time; i++) {
            if ((time - i) * i > distances[index]) {
                count++
            }
        }
        solution *= count
    }
    return solution
}

const parseInput = (input: string): string[] => {
    const lines = input.split('\n')
    const [, timesString] = lines[0].split(':')
    const [, distancesString] = lines[1].split(':')
    return [timesString, distancesString]
}

const splitString = (string: string, replaceValue: string): string[] => {
    return string.replaceAll(/\s+/g, replaceValue).trim().split(' ')
}

const partA = () => {
    const input = fs.readFileSync('./src/day-6/test-a.txt', 'utf-8')
    const [timesString, distancesString] = parseInput(input)
    const timesStringArray = splitString(timesString, ' ')
    const distancesStringArray = splitString(distancesString, ' ')
    const times = timesStringArray.map(Number)
    const distances = distancesStringArray.map(Number)

    const solution = calculateSolution(times, distances)
    console.log(`Result A: ${solution}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-6/test-a.txt', 'utf-8')
    const [timesString, distancesString] = parseInput(input)
    const timesStringArray = splitString(timesString, '')
    const distancesStringArray = splitString(distancesString, '')
    const times = timesStringArray.map(Number)
    const distances = distancesStringArray.map(Number)

    const solution = calculateSolution(times, distances)
    console.log(`Result B: ${solution}`)
}

partA()
partB()
