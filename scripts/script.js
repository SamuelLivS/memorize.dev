const FRONT = 'cardFront'
const BACK = 'cardBack'
const CARD = 'card'
const ICON = 'icon'
let motions = 0
let dataPlayer = {}

document.getElementById('playButton').addEventListener('click', (e) => {
    e.preventDefault()
    let playerName = document.getElementById('playerName').value.trim()
    if (playerName !== '') {
        let startGameLayer = document.getElementById('startGameView')
        startGameLayer.style.display = 'none'
        dataPlayer.id = generateIdPlayer(playerName)
        dataPlayer.name = playerName
        dataPlayer.motions = null
        startGame()
    } else {
        alert('Por favor, digite um nome!')
    }
})

function startGame() {
    initializeCards(game.createCardsFromTechs())
}

function initializeCards(cards) {
    let gameBoard = document.getElementById('gameBoard')
    gameBoard.innerHTML = ''
    game.cards.forEach(card => {
        let cardElement = document.createElement('div')
        cardElement.id = card.id
        cardElement.classList.add(CARD)
        cardElement.dataset.icon = card.icon
        createCardContent(card, cardElement)
        cardElement.addEventListener('click', flipCard)
        gameBoard.appendChild(cardElement)
    })
}

function createCardContent(card, cardElement) {
    createCardFace(FRONT, card, cardElement)
    createCardFace(BACK, card, cardElement)
}

function createCardFace(face, card, element) {
    let cardElementFace = document.createElement('div')
    cardElementFace.classList.add(face)
    if (face === FRONT) {
        let iconElement = document.createElement('img')
        iconElement.classList.add(ICON)
        iconElement.src = `./assets/images/${card.icon}.png`
        cardElementFace.appendChild(iconElement)
    } else {
        cardElementFace.innerHTML = '&lt;/&gt;'
    }
    element.appendChild(cardElementFace)
}

function flipCard() {
    if (game.setCard(this.id)) {
        this.classList.add('flip')
        if (game.secondCard) {
            motions++
            if (game.checkMatch()) {
                game.clearCards()
                if (game.checkGameOver()) {
                    recoverPlayerScore()
                    let gameOverLayer = document.getElementById('gameOverView')
                    gameOverLayer.style.display = 'flex'
                }
            } else {
                setTimeout(() => {
                    let firstCardView = document.getElementById(game.firstCard.id)
                    let secondCardView = document.getElementById(game.secondCard.id)

                    firstCardView.classList.remove('flip')
                    secondCardView.classList.remove('flip')
                    game.unflipCards()
                }, 1000)
            }
        }
    }
}

function restart() {
    game.clearCards()
    startGame()
    let gameOverLayer = document.getElementById('gameOverView')
    gameOverLayer.style.display = 'none'
    motions = 0
}

function generateIdPlayer(name) { //Adaptar e juntar com o createIdWithTechs
    return name + parseInt(Math.random() * 1000)
}

function recoverPlayerScore() {
    let scores = []
    // dataPlayer.motions = motions
    dataPlayer = {
        name: 'sam',
        id: generateIdPlayer(this.name),
        motions: 17
    }

    //VERIFICA E RECUPERA
    if (localStorage.length !== 0) {
        while (scores.length !== localStorage.length) {
            let score = JSON.parse(localStorage.getItem(scores.length + 1))
            scores.push(score)
        }
    }

    if (localStorage.length < 5) {
        //adiciona player atual
        scores.push(dataPlayer)
    } else {
        scores.reverse() //Organizar na ordem decrescente
        for(let i=0; i < scores.length; i++){
            //Verifica se algum motions é menor que o outro
            console.log(scores[i])
            if(dataPlayer.motions < scores[i].motions){
                scores.splice(i,1,dataPlayer)
                break
            }
        }
    }

    organizeArray(scores)
    savePlayers(scores)
}

function organizeArray(arrScores){
    arrScores.sort((a,b) => a.motions - b.motions)
}

function savePlayers(arrScores){
    localStorage.clear()
    arrScores.forEach((score, i) => {
        localStorage.setItem(i+1, JSON.stringify(score))
    })
}
// recoverPlayerScore()