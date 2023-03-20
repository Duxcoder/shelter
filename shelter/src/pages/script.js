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
    createRandomCards(n, exclusionCards = []) {
        let cards = [];
        const rNum = () => Math.floor(Math.random() * this.cards.length);
        let random = rNum();
        while (cards.length < Math.min(n, this.cards.length)) {
            if (!cards.includes(this.cards[random])) {
                cards.push(this.cards[random]);
            }
            random = rNum();
        }
        for (let i = 0; cards.length < n; i++) {
            cards.push(cards[i])
        }
        const hasMatch = exclusionCards.some(card => cards.includes(card));

        if (hasMatch) {
            return this.createRandomCards(n, exclusionCards)
        }
        return cards
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
    prevPlaces !== placesForCards && (slider.startSlider(cards.createRandomCards(placesForCards)))
});

const arrowRight = document.querySelector('.arrow-right')
const arrowLeft = document.querySelector('.arrow-left')

class Slider {
    constructor(parentContainerClass) {
        this.$parentContainer = document.querySelector(parentContainerClass);
        this.$cardsOnPage = [];
        this.cardsOnPage = [];
        this.left = 0;
        this.translateX = 0;
    }
    startSlider(cards) {
        this.$parentContainer.innerHTML = '';
        this.$parentContainer.style.transform = `translateX(${this.translateX}px)`

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
    renderCard(card, next = true) {
        const $card = this.createHtmlCard(card)
        next ? this.cardsOnPage.push(card) : this.cardsOnPage.unshift(card);
        next ? this.$cardsOnPage.push($card) : this.$cardsOnPage.unshift($card);
        next ? this.$parentContainer.append($card) : this.$parentContainer.prepend($card)

    }

    nextCard() {
        const setTranslate = (translateX, left) => {
            this.translateX -= translateX
            this.left += left;
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
        if (placesForCards === 3) setTranslate(360, 360)
        if (placesForCards === 6) setTranslate(620, 620)
        if (placesForCards === 9) setTranslate(1080, 1080)
        const tmpFun = arrowRight.onclick
        arrowRight.onclick = null
        setTimeout(() => {
            this.$parentContainer.style.left = this.left + 'px'
            this.$parentContainer.style.transition = 'none';
            if (placesForCards === 3) renderNextCard(1)
            if (placesForCards === 6) renderNextCard(2)
            if (placesForCards === 9) renderNextCard(3)
            arrowRight.onclick = tmpFun
        }, 700)
        this.$parentContainer.style.transition = 'all 0.7s ease-in-out';
    }

    prevCard() {
        const setTranslate = (translateX, left) => {
            this.translateX += translateX
            this.left -= left;
            this.$parentContainer.style.transform = `translateX(${this.translateX}px)`
        }
        const renderPrevCard = (nFirstCards) => {
            const firstCardsOnPage = this.cardsOnPage.slice(0, 3);
            console.log('FirstCardsOnPage:' + ' ', firstCardsOnPage)
            const newCards = cards.createRandomCards(nFirstCards, firstCardsOnPage);
            newCards.forEach(card => this.renderCard(card, false))
            for (let i = 0; i < nFirstCards; i++) {
                this.$cardsOnPage.pop();
                const lastCard = this.$parentContainer.lastChild;
                this.$parentContainer.removeChild(lastCard);
                this.cardsOnPage.pop();
            }
        }
        if (placesForCards === 3) setTranslate(360, 360);
        if (placesForCards === 6) setTranslate(620, 620);
        if (placesForCards === 9) setTranslate(1080, 1080);

        const tmpFun = arrowLeft.onclick
        arrowLeft.onclick = null
        setTimeout(() => {
            this.$parentContainer.style.left = this.left + 'px'
            this.$parentContainer.style.transition = 'none';
            if (placesForCards === 3) renderPrevCard(1)
            if (placesForCards === 6) renderPrevCard(2)
            if (placesForCards === 9) renderPrevCard(3)
            arrowLeft.onclick = tmpFun
        }, 700)
        this.$parentContainer.style.transition = 'all 0.7s ease-in-out';

    }
}

const slider = new Slider('.slider__items')

const next = function () {
    slider.nextCard()
}
const prev = function () {
    slider.prevCard()
}
arrowRight.onclick = next;
arrowLeft.onclick = prev;

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

