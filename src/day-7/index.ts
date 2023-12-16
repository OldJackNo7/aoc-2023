import * as fs from 'fs'

enum CARD {
    'TWO' = 2,
    'THREE' = 3,
    'FOUR' = 4,
    'FIVE' = 5,
    'SIX' = 6,
    'SEVEN' = 7,
    'EIGHT' = 8,
    'NINE' = 9,
    'T' = 10,
    'J' = 1,
    'Q' = 12,
    'K' = 13,
    'A' = 14,
}

interface HandWithBet {
    hand: CARD[]
    bet: number
}

interface GroupedCardsWithBets {
    fiveOfAKind: HandWithBet[]
    fourOfAKind: HandWithBet[]
    fullHouse: HandWithBet[]
    threeOfAKind: HandWithBet[]
    twoPair: HandWithBet[]
    onePair: HandWithBet[]
    highCard: HandWithBet[]
}

const mapCardToValue = (card: string): CARD => {
    switch (card) {
        case '2':
            return CARD.TWO
        case '3':
            return CARD.THREE
        case '4':
            return CARD.FOUR
        case '5':
            return CARD.FIVE
        case '6':
            return CARD.SIX
        case '7':
            return CARD.SEVEN
        case '8':
            return CARD.EIGHT
        case '9':
            return CARD.NINE
        case 'T':
            return CARD.T
        case 'J':
            return CARD.J
        case 'Q':
            return CARD.Q
        case 'K':
            return CARD.K
        case 'A':
            return CARD.A
    }
    return CARD.TWO
}

const mapHandToCards = (hand: string): CARD[] => {
    return hand.split('').map(mapCardToValue)
}

const hasFiveOfAKind = (cards: Map<CARD, number>): boolean => {
    for (const [, number] of cards) {
        if (number === 5) return true
    }
    return false
}

const hasFourOfAKind = (cards: Map<CARD, number>): boolean => {
    for (const [, number] of cards) {
        if (number === 4) return true
    }
    return false
}

// this will only work if we check the ones above first
const hasFullHouse = (cards: Map<CARD, number>): boolean => {
    return cards.size === 2
}

const hasThreeOfAKind = (cards: Map<CARD, number>): boolean => {
    for (const [, number] of cards) {
        if (number === 3) return true
    }
    return false
}

const hasTwoPair = (cards: Map<CARD, number>): boolean => {
    let numberOfPairs = 0
    for (const [, number] of cards) {
        if (number === 2) numberOfPairs++
    }
    return numberOfPairs === 2
}

// this will only work if we check the ones above first
const hasOnePair = (cards: Map<CARD, number>): boolean => {
    for (const [, number] of cards) {
        if (number === 2) return true
    }
    return false
}

const willFirstHandWinTie = (firstHand: CARD[], secondHand: CARD[]): number => {
    for (const [index, firstHandCard] of firstHand.entries()) {
        if (firstHandCard > secondHand[index]) return 1
        else if (firstHandCard < secondHand[index]) return -1
    }
    return -1
}

const constructCardMap = (cards: CARD[]): Map<CARD, number> => {
    const cardMap: Map<CARD, number> = new Map<CARD, number>()
    cards.forEach((card) => {
        cardMap.set(card, (cardMap.get(card) ?? 0) + 1)
    })
    return cardMap
}

const transformJokerAndConstructCardMap = (
    cards: CARD[]
): Map<CARD, number> => {
    const cardMap: Map<CARD, number> = new Map<CARD, number>()
    cards.forEach((card) => {
        cardMap.set(card, (cardMap.get(card) ?? 0) + 1)
    })
    if (cardMap.get(CARD.J) && cardMap.get(CARD.J) !== 5) {
        let maxNumber = -Infinity
        let maxCard = CARD.J
        for (const [card, number] of cardMap.entries()) {
            if (card === CARD.J) continue
            if (number > maxNumber) {
                maxNumber = number
                maxCard = card
            }
        }
        if (cardMap.get(maxCard)) {
            cardMap.set(maxCard, maxNumber + (cardMap.get(CARD.J) ?? 0))
            cardMap.delete(CARD.J)
        }
    }
    return cardMap
}

const groupHands = (
    handsAndBets: HandWithBet[],
    constructFn: (cards: CARD[]) => Map<CARD, number>
): GroupedCardsWithBets => {
    const groupedCardsAndBets: GroupedCardsWithBets = {
        fiveOfAKind: [],
        fourOfAKind: [],
        fullHouse: [],
        threeOfAKind: [],
        twoPair: [],
        onePair: [],
        highCard: [],
    }
    handsAndBets.forEach((handWithBet) => {
        const cardMap = constructFn(handWithBet.hand)
        if (hasFiveOfAKind(cardMap))
            groupedCardsAndBets.fiveOfAKind.push(handWithBet)
        else if (hasFourOfAKind(cardMap))
            groupedCardsAndBets.fourOfAKind.push(handWithBet)
        else if (hasFullHouse(cardMap))
            groupedCardsAndBets.fullHouse.push(handWithBet)
        else if (hasThreeOfAKind(cardMap))
            groupedCardsAndBets.threeOfAKind.push(handWithBet)
        else if (hasTwoPair(cardMap))
            groupedCardsAndBets.twoPair.push(handWithBet)
        else if (hasOnePair(cardMap))
            groupedCardsAndBets.onePair.push(handWithBet)
        else groupedCardsAndBets.highCard.push(handWithBet)
    })
    return groupedCardsAndBets
}

const sortFunctionWrapper = (
    first: HandWithBet,
    second: HandWithBet
): number => {
    return willFirstHandWinTie(first.hand, second.hand)
}

const sortGroupedCardsWithBets = (
    initial: GroupedCardsWithBets
): GroupedCardsWithBets => {
    initial.fiveOfAKind.sort(sortFunctionWrapper)
    initial.fourOfAKind.sort(sortFunctionWrapper)
    initial.fullHouse.sort(sortFunctionWrapper)
    initial.threeOfAKind.sort(sortFunctionWrapper)
    initial.twoPair.sort(sortFunctionWrapper)
    initial.onePair.sort(sortFunctionWrapper)
    initial.highCard.sort(sortFunctionWrapper)
    return initial
}

const computeWinnings = (sorted: GroupedCardsWithBets): number => {
    let index = 1
    let totalWinnings = 0
    sorted.highCard.forEach(({ bet }) => {
        totalWinnings += bet * index++
    })
    sorted.onePair.forEach(({ bet }) => {
        totalWinnings += bet * index++
    })
    sorted.twoPair.forEach(({ bet }) => {
        totalWinnings += bet * index++
    })
    sorted.threeOfAKind.forEach(({ bet }) => {
        totalWinnings += bet * index++
    })
    sorted.fullHouse.forEach(({ bet }) => {
        totalWinnings += bet * index++
    })
    sorted.fourOfAKind.forEach(({ bet }) => {
        totalWinnings += bet * index++
    })
    sorted.fiveOfAKind.forEach(({ bet }) => {
        totalWinnings += bet * index++
    })
    return totalWinnings
}

const partA = () => {
    const input = fs.readFileSync('./src/day-7/test-a.txt', 'utf-8')
    const handsAndBets: HandWithBet[] = input.split('\n').map((line) => {
        const [hand, bet] = line.split(' ')
        return { hand: mapHandToCards(hand), bet: Number(bet) }
    })
    const groupedCardsWithBets = groupHands(handsAndBets, constructCardMap)
    const sortedAndGroupedCardsWithBets =
        sortGroupedCardsWithBets(groupedCardsWithBets)
    const totalWinning = computeWinnings(sortedAndGroupedCardsWithBets)

    console.log(`Result A: ${totalWinning}`)
}

const partB = () => {
    const input = fs.readFileSync('./src/day-7/test-a.txt', 'utf-8')
    const handsAndBets: HandWithBet[] = input.split('\n').map((line) => {
        const [hand, bet] = line.split(' ')
        return { hand: mapHandToCards(hand), bet: Number(bet) }
    })
    const groupedCardsWithBets = groupHands(
        handsAndBets,
        transformJokerAndConstructCardMap
    )
    const sortedAndGroupedCardsWithBets =
        sortGroupedCardsWithBets(groupedCardsWithBets)
    const totalWinning = computeWinnings(sortedAndGroupedCardsWithBets)

    console.log(`Result B: ${totalWinning}`)
}

partA()
partB()
