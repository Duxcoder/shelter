'use strict'
class Cards {
    constructor() {
        this.cards = []
    }
    add(options) {
        this.cards.push(options)
    }
    getCard(i) {
        return this.cards[i]
    }

    getRandomCards(n) {

    }

    createRandomCards(n, last = []) {
        if (this.cards.length === 0) {
            console.log('Cards not found')
            return null
        } else {
            let cards = [];
            let lengthCards = cards.length
            let i = 0
            while (cards.length < n) {
                i++
                if (i > 1000) return console.log('error loop', cards)
                const num = Math.floor(Math.random() * ((this.cards.length - 1) + 1));
                console.log(num)
                if (n > this.cards.length && cards.length >= this.cards.length - 1) {
                    cards.push(cards.at(-lengthCards))
                    lengthCards = cards.length - 1;
                }
                if (!cards.includes(this.cards[num]) && !last.includes(this.cards[num])) {
                    cards.push(this.cards[num]);
                }
            }
            return cards
        }
    }

    getCards() {
        return this.cards
    }
}

const cards = new Cards()

let placesForCards = 9;

const checkWindowSize = (places) => {
    switch (true) {
        case document.documentElement.clientWidth < 768: places = 3
            break
        case document.documentElement.clientWidth < 1280: places = 6
            break
        default: places = 9
    }
    return places
}
placesForCards = checkWindowSize()
window.addEventListener('resize', (e) => {
    let prevPlaces = placesForCards;
    placesForCards = checkWindowSize()
    prevPlaces !== placesForCards && (console.log('change', placesForCards))
});

class Slider {
    constructor(parentContainerClass) {
        this.$parentContainer = document.querySelector(parentContainerClass);
        this.$cardsOnPage = [];
        this.cardsOnPage = [];
        this.width = 0;
        this.translateX = 0;
    }
    startSlider(cards) {
        this.$parentContainer.innerHTML = '';

        cards.forEach((card) => {
            this.renderCard(card)
        })
    }

    createHtmlCard(card) {
        const { picture, name, link, alt } = card
        const $card = document.createElement('div');
        $card.classList.add('slider__item', 'card');
        $card.innerHTML = `
        <img src="${picture}" alt="${alt}" class="card__pic" />
        <div class="card__title">${name}</div>
        <button data-showCard="${link}" class="btn btn__transparent">Learn more</button>
        `
        return $card
    }
    renderCard(card) {
        const $card = this.createHtmlCard(card)
        this.cardsOnPage.push(card);
        this.$cardsOnPage.push($card);
        this.$parentContainer.append($card)
    }

    nextCard() {
        // const addOne = () => {
        //     const lastCard = this.cardsOnPage.at(-1)
        //     let index = cards.getCards().findIndex( item => item === lastCard)
        //     index === cards.getCards().length - 1 ? index = 0 : index++
        //     const newCard = cards.getCard(index);
        //     this.renderCard(newCard)

        // }
        // const lastCard = this.cardsOnPage.at(-1)
        ///
        // let index = cards.getCards().findIndex(item => item === lastCard)
        // index === cards.getCards().length - 1 ? index = 0 : index++
        // const newCard1 = cards.getCard(index);
        // index === cards.getCards().length - 1 ? index = 0 : index++
        // const newCard2 = cards.getCard(index);
        // index === cards.getCards().length - 1 ? index = 0 : index++
        // const newCard3 = cards.getCard(index);
        ///
        const setTranslate = (translateX, width) => {
            this.translateX -= translateX
            this.width = this.$parentContainer.clientWidth + width
            this.$parentContainer.style.transform = `translateX(${this.translateX}px)`
        }
        const renderNextCard = (nLastCards) => {
            const lastCardsOnPage = this.cardsOnPage.slice(-nLastCards)
            console.log(lastCardsOnPage)
            const newCards = cards.createRandomCards(nLastCards, lastCardsOnPage);
            newCards.forEach(card => this.renderCard(card))
            for (let i = 0; i < nLastCards; i++) {
                this.$cardsOnPage.shift();
                const firstCard = this.$parentContainer.firstChild
                this.$parentContainer.removeChild(firstCard)
                this.cardsOnPage.shift();
            }
        }
        // if (placesForCards === 3) setTranslate(360, 1000)
        // if (placesForCards === 6) setTranslate(720, 1600)
        if (placesForCards === 9) setTranslate(1080, 2160)


        setTimeout(() => {
            this.$parentContainer.style.width = this.width + 'px'
            this.$parentContainer.style.transition = 'none';
            // this.renderCard(newCard1)
            // this.renderCard(newCard2)
            // this.renderCard(newCard3)
            // if (placesForCards === 3) renderNextCard(1)
            // if (placesForCards === 6) renderNextCard(2)
            if (placesForCards === 9) renderNextCard(3)
            // const $card1 = this.$cardsOnPage.shift();
            // const $card2 = this.$cardsOnPage.shift();
            // const $card3 = this.$cardsOnPage.shift();
            // this.$parentContainer.removeChild($card1);
            // this.$parentContainer.removeChild($card2);
            // this.$parentContainer.removeChild($card3);
            // this.cardsOnPage.shift();
            // this.cardsOnPage.shift();
            // this.cardsOnPage.shift();
        }, 700)
        this.$parentContainer.style.transition = 'all 0.7s ease-in-out';

    }



    prevCard() {

    }
}

const slider = new Slider('.slider__items')

fetch('cards.json')
    .then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            response.json().then(function (data) {
                data.forEach(card => {
                    cards.add(card);
                })
                slider.startSlider(cards.createRandomCards(placesForCards))
                console.log(cards.getCards())
            });
        }
    )
    .catch(function (err) {
        console.log('Fetch Error :-S', err);
    });

const arrowRight = document.querySelector('.arrow-right')

arrowRight.onclick = function () {
    slider.nextCard()
}