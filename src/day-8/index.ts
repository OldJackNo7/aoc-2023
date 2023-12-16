import * as fs from 'fs'

interface MapNode {
    left: string
    right: string
}

const constructMapNode = (line: string): { current: string; node: MapNode } => {
    const [current, future] = line.replaceAll(/\s|\r|\(|\)/g, '').split('=')
    const [left, right] = future.split(',')
    return {
        current,
        node: {
            left,
            right,
        },
    }
}

const constructNetwork = (stringNetwork: string[]): Map<string, MapNode> => {
    const network: Map<string, MapNode> = new Map<string, MapNode>()
    for (const line of stringNetwork) {
        const lineResult = constructMapNode(line)
        network.set(lineResult.current, lineResult.node)
    }
    return network
}

const pickNextNode = (
    direction: string,
    currentLocation: string,
    network: Map<string, MapNode>
): string => {
    const currentLocationNodes = network.get(currentLocation)
    if (!currentLocationNodes) return currentLocation
    if (direction === 'L') return currentLocationNodes.left
    return currentLocationNodes.right
}

// For this to work we need to set node parameter --stack-size=4096
// const recursiveTravel = (
//     directions: string[],
//     directionIndex: number,
//     currentLocation: string,
//     network: Map<string, MapNode>
// ): number => {
//     if (directionIndex % 10 === 0)
//         console.log(`Arrived at ${directionIndex} ${currentLocation}`)
//     if (currentLocation === 'ZZZ') return 0
//     const directionToPick = directions[directionIndex % (directions.length - 1)]
//     const nextLocation = pickNextNode(directionToPick, currentLocation, network)
//     return (
//         1 +
//         recursiveTravel(directions, directionIndex + 1, nextLocation, network)
//     )
// }

const partACheckFinishFn = (position: string): boolean => {
    return position === 'ZZZ'
}

const partBCheckFinishFn = (position: string): boolean => {
    return position.endsWith('Z')
}

const iterativeTravel = (
    startPosition: string,
    checkFinishFn: (pos: string) => boolean,
    directions: string[],
    network: Map<string, MapNode>
): number => {
    let directionIndex = 0
    let currentPosition = startPosition
    while (!checkFinishFn(currentPosition)) {
        const directionToPick =
            directions[directionIndex % (directions.length - 1)]
        currentPosition = pickNextNode(
            directionToPick,
            currentPosition,
            network
        )
        directionIndex++
    }
    return directionIndex
}

const findStartPositions = (network: Map<string, MapNode>): string[] => {
    const nodes = Array.from(network.keys())
    return nodes.filter((node) => node.endsWith('A'))
}

const greatestCommonDivisor = (a: number, b: number): number => {
    return !b ? a : greatestCommonDivisor(b, a % b)
}

const leastCommonMultiple = (arr: number[]): number => {
    let multiple = arr[0]
    arr.forEach(function (n) {
        multiple = (multiple * n) / greatestCommonDivisor(multiple, n)
    })

    return multiple
}

const solvePartB = (
    directions: string[],
    network: Map<string, MapNode>
): number => {
    const positionsToCheck = findStartPositions(network)
    const resultArr: number[] = []
    for (const position of positionsToCheck) {
        const steps = iterativeTravel(
            position,
            partBCheckFinishFn,
            directions,
            network
        )
        resultArr.push(steps)
    }
    return leastCommonMultiple(resultArr)
}

const partA = () => {
    const input = fs.readFileSync('./src/day-8/test-a.txt', 'utf-8')
    const splitInput = input.split('\n')
    const directions = splitInput[0].split('')
    const network = constructNetwork(splitInput.slice(2))
    // const distanceTravelled = recursiveTravel(directions, 0, 'AAA', network)
    const distanceTravelled = iterativeTravel(
        'AAA',
        partACheckFinishFn,
        directions,
        network
    )

    console.log(`Result A: ${distanceTravelled}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-8/test-a.txt', 'utf-8')
    const splitInput = input.split('\n')
    const directions = splitInput[0].split('')
    const network = constructNetwork(splitInput.slice(2))
    const distanceTravelled = solvePartB(directions, network)
    console.log(`Result B: ${distanceTravelled}`)
}

partA()
partB()
