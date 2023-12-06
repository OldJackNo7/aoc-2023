import * as fs from 'fs'

const partA = () => {
    const input = fs.readFileSync('./src/day-6/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    const times: number[] = []
    const distances: number[] = []
    const [, timesString] = lines[0].split(':')
    const [, distancesString] = lines[1].split(':')
    const timesStringArray = timesString
        .replaceAll(/\s+/g, ' ')
        .trim()
        .split(' ')
    const distancesStringArray = distancesString
        .replaceAll(/\s+/g, ' ')
        .trim()
        .split(' ')
    for (let i = 0; i < timesStringArray.length; i++) {
        times.push(Number(timesStringArray[i]))
        distances.push(Number(distancesStringArray[i]))
    }

    let solution = 1
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const timeIndex in times) {
        let count = 0
        const time = times[timeIndex]
        for (let i = 1; i < time; i++) {
            if ((time - i) * i > distances[timeIndex]) {
                count++
            }
        }
        solution *= count
    }
    console.log(`Result A: ${solution}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-6/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    const times: number[] = []
    const distances: number[] = []
    const [, timesString] = lines[0].split(':')
    const [, distancesString] = lines[1].split(':')
    const timesStringArray = timesString
        .replaceAll(/\s+/g, '')
        .trim()
        .split(' ')
    const distancesStringArray = distancesString
        .replaceAll(/\s+/g, '')
        .trim()
        .split(' ')
    for (let i = 0; i < timesStringArray.length; i++) {
        times.push(Number(timesStringArray[i]))
        distances.push(Number(distancesStringArray[i]))
    }

    let solution = 1
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const timeIndex in times) {
        let count = 0
        const time = times[timeIndex]
        for (let i = 1; i < time; i++) {
            if ((time - i) * i > distances[timeIndex]) {
                count++
            }
        }
        solution *= count
    }
    console.log(`Result B: ${solution}`)
}

partA()
partB()
