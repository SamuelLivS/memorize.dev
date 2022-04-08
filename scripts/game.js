let game = {
    lockMode: false,
    firstCard: null,
    secondCard: null,
    cards: null,
    techs: [
        'bootstrap',
        'css',
        'electron',
        'firebase',
        'html',
        'javascript',
        'jquery',
        'mongo',
        'node',
        'react'
    ],
    setCard(id) {
        let card = this.cards.filter(card => card.id === id)[0]
        if (card.flipped || this.lockMode) {
            return false
        }

        if (!this.firstCard) {
            this.firstCard = card
            this.firstCard.flipped = true
            return true
        } else {
            this.secondCard = card
            this.secondCard.flipped = true
            this.lockMode = true
            return true
        }
    },
    checkMatch() {
        return (!this.firstCard || !this.secondCard) ? false : this.firstCard.icon === this.secondCard.icon
    },
    unflipCards() {
        this.firstCard.flipped = false
        this.secondCard.flipped = false
        this.clearCards()
    },
    checkGameOver() {
        return this.cards.filter(card => !card.flipped).length === 0
    },
    clearCards() {
        this.firstCard = null
        this.secondCard = null
        this.lockMode = null
    },
    createCardsFromTechs() {
        this.cards = []

        for (let tech of this.techs) {
            this.cards.push(this.createPairFromTech(tech))
        }

        this.cards = this.cards.flatMap(pair => pair)
        this.shuffleCards()

        return this.cards
    },

    createPairFromTech(tech) {
        return [{
            id: this.createId(tech),
            icon: tech,
            flipped: false
        }, {
            id: this.createId(tech),
            icon: tech,
            flipped: false
        }]
    },

    createId(txt) {
        return txt + parseInt(Math.random() * 1000)
    },

    shuffleCards() {
        let currentIndex = this.cards.length
        let randomIndex = 0

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            [this.cards[randomIndex], this.cards[currentIndex]] = [this.cards[currentIndex], this.cards[randomIndex]]
        }
    }
}