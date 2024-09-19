const game = document.getElementById('game')

function startGame(game, count) {
    //Создаем массив чисел и перемешиваем
let cardArray = [];

let firstCard = null;
let secondCard = null;

for (i = 1; i <= count; i++) {
    cardArray.push(i);
    cardArray.push(i);
}

cardArray = cardArray.sort(() => Math.random() - 0.5);


//Создаем карточки

for (const cardNumber of cardArray) {
    let card = document.createElement('div')
    card.textContent = cardNumber
    card.classList.add('card')

//Клик по карточке
    card.addEventListener('click', function(){
        if(card.classList.contains('open') || card.classList.contains('succsess')){
            return
        }

        if(firstCard !== null && secondCard !== null) {
        firstCard.classList.remove('open')
        secondCard.classList.remove('open')
        firstCard = null
        secondCard = null
        }

        card.classList.add('open')

        if(firstCard === null) {
            firstCard = card
        } else {
            secondCard = card
        }

        if(firstCard !== null && secondCard !== null) {
            let firstCardNumber = firstCard.textContent
            let secondCardNumber = secondCard.textContent

            if(firstCardNumber === secondCardNumber) {
                firstCard.classList.add('success')
                secondCard.classList.add('success')
            }
        }
        if(cardArray.length === document.querySelectorAll('.success').length){
            setTimeout(function(){
                game.innerHTML = ''
                alert('Молодец,возьми с полки пирожок')
                let count = Number(prompt('Введите количесво карточек'))
                startGame(game, count)
            }, 400)
        }
    })

    game.append(card)
}
}

let count = Number(prompt('Введите количесво пар карточек'))
startGame(game, count)