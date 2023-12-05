import * as fs from 'fs'

const computeLineScore = (line: string): number => {
    const gameCard = line.replaceAll(/\s+/g, ' ').split(': ')
    const numbers = gameCard[1].split(' | ')
    const winningNumbers = numbers[0].split(' ').map(Number)
    const trialNumbers = numbers[1].split(' ').map(Number)
    const intersection = trialNumbers.filter((trial) =>
        winningNumbers.includes(trial)
    )
    return intersection.length
}

const partA = () => {
    const input = fs.readFileSync('./src/day-4/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    let pileSum = 0
    for (const line of lines) {
        const lineScore = computeLineScore(line)
        const gameScore = lineScore > 0 ? 2 ** (lineScore - 1) : 0
        pileSum += gameScore
    }
    console.log(`Result A: ${pileSum}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-4/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    const cards: number[] = Array(lines.length).fill(0)
    let index = 0
    for (const line of lines) {
        if (!cards[index]) cards[index] = 1
        else cards[index]++
        const lineScore = computeLineScore(line)
        for (let cnt = 0; cnt < cards[index]; cnt++) {
            for (
                let i = 0;
                i < lineScore && i + index + 1 < lines.length;
                i++
            ) {
                cards[i + index + 1] = cards[index + i + 1] + 1
            }
        }
        index++
    }
    const result = cards.reduce((acc, value) => acc + value, 0)
    console.log(`Result B: ${result}`)
}

partA()
partB()
