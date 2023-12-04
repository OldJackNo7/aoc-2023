import * as fs from 'fs'

const MAX_RED = 12
const MAX_GREEN = 13
const MAX_BLUE = 14

const partA = () => {
    const input = fs.readFileSync('./src/day-2/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    let gameIdsSum = 0
    for (const line of lines) {
        let gamePossible = true
        const splitLine = line.split(': ')
        const gameId = Number(splitLine[0].split(' ')[1])
        const hands = splitLine[1].split('; ')
        for (const hand of hands) {
            const cubes = hand.split(', ')
            const RGBs = [0, 0, 0]
            cubes.forEach((cube) => {
                const cubeParts = cube.split(' ')
                const color = cubeParts[1]
                const numberOfCubes = Number(cubeParts[0])
                switch (color) {
                    case 'red':
                        RGBs[0] += numberOfCubes
                        break
                    case 'green':
                        RGBs[1] += numberOfCubes
                        break
                    case 'blue':
                        RGBs[2] += numberOfCubes
                }
            })
            if (
                RGBs[0] > MAX_RED ||
                RGBs[1] > MAX_GREEN ||
                RGBs[2] > MAX_BLUE
            ) {
                gamePossible = false
                break
            }
        }
        if (!gamePossible) {
            // console.log(`${gameId} - IMPOSSIBLE`)
        } else {
            // console.log(`${gameId} - POSSIBLE`)
            gameIdsSum += gameId
        }
    }
    console.log(`Result A: ${gameIdsSum}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-2/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    let totalPower = 0
    for (const line of lines) {
        const splitLine = line.split(': ')
        const hands = splitLine[1].split('; ')
        let gamePower = 0
        const RGBs = [0, 0, 0]
        for (const hand of hands) {
            const cubes = hand.split(', ')
            cubes.forEach((cube) => {
                const cubeParts = cube.split(' ')
                const color = cubeParts[1]
                const numberOfCubes = Number(cubeParts[0])
                switch (color) {
                    case 'red':
                        RGBs[0] = Math.max(RGBs[0], numberOfCubes)
                        break
                    case 'green':
                        RGBs[1] = Math.max(RGBs[1], numberOfCubes)
                        break
                    case 'blue':
                        RGBs[2] = Math.max(RGBs[2], numberOfCubes)
                }
            })
        }
        gamePower = RGBs[0] * RGBs[1] * RGBs[2]
        // console.log(`Power ${gamePower} -- ${RGBs}`)
        totalPower += gamePower
    }
    console.log(`Result B: ${totalPower}`)
}

partA()
partB()
