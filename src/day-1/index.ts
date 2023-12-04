import * as fs from 'fs'

const updateSpelledDigit = (str: string): string => {
    // all of this because of 'oneight`
    const spelledNumberRegex =
        /(one|two|three|four|five|six|seven|eight|nine|zero)/
    let copy = str
    while (spelledNumberRegex.test(copy)) {
        copy = copy.replace('one', 'o1ne')
        copy = copy.replace('two', 't2wo')
        copy = copy.replace('three', 't3hree')
        copy = copy.replace('four', 'f4our')
        copy = copy.replace('five', 'f5ive')
        copy = copy.replace('six', 's6ix')
        copy = copy.replace('seven', 's7even')
        copy = copy.replace('eight', 'e8ight')
        copy = copy.replace('nine', 'n9ine')
    }
    return copy
}

const partA = () => {
    const input = fs.readFileSync('./src/day-1/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    let sum = 0
    const numberRegex = /(\d)/g
    for (const line of lines) {
        const results = Array.from(line.matchAll(numberRegex))
        const firstDigit = results[0][0]
        const secondDigit = results[results.length - 1][0]
        const actualNumber = Number(`${firstDigit + secondDigit}`)
        sum += actualNumber
        // console.log(`${line} - ${firstDigit} ${secondDigit} -- ${actualNumber} -> ${sum}`)
    }
    console.log(`Result A --> ${sum}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-1/test-a.txt', 'utf-8')
    const lines = input.split('\n')
    let sum = 0
    const numberRegex = /(\d)/g
    for (const line of lines) {
        const toCheck = updateSpelledDigit(line)
        const results = Array.from(toCheck.matchAll(numberRegex))
        const firstDigit = Number(results[0][0])
        const secondDigit = Number(results[results.length - 1][0])
        const actualNumber = firstDigit * 10 + secondDigit
        sum += actualNumber
        // console.log(`${line} - ${firstDigit} ${secondDigit} -- ${actualNumber} -> ${sum}`)
    }
    console.log(`Result B --> ${sum}`)
}

partA()
partB()
