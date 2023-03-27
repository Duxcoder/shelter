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

const sliderModule = () => {

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
            this.cardsOnPage = [];
            this.$cardsOnPage = [];
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
                console.log('FirstCardsOnPage:' + ' ', firstCardsOnPage);
                console.log('cardsOnPage:' + ' ', this.cardsOnPage);
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
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}



/// Hamburger
const hamburgerModule = () => {
    const btn = document.querySelector(".menu-wrapper");
    const handler = function () {
        this.classList.toggle('animate');
    }
    btn.onclick = handler
}



/// Pagination
const paginationModule = () => {
    async function getData() {
        const response = await fetch('../cards.json');
        const data = await response.json();
        return data
    }



    class Pagination {
        constructor(parentContainerClass) {
            this.$parentContainer = document.querySelector(parentContainerClass);
            this.cards = [];
            this.pages = {};
            this.places = null;
            this.currentNumberPage = 1;
        }
        start = (places) => {
            this.places = places
            this.createPagesCards();
            this.renderPage(this.currentNumberPage);
        }
        createCardsArray = () => {
            while (this.cards.length < 48) {
                this.cards = this.cards.concat(cards.createRandomCards(8))
            }
        }
        createPagesCards = () => {
            this.pages = {}
            const copyCards = Array.from(this.cards)
            const numAllPages = Math.ceil(this.cards.length / this.places);
            for (let i = 0; i < numAllPages; i++) {
                if (copyCards.length > this.places) {
                    this.pages[i + 1] = copyCards.splice(0, this.places);
                } else {
                    this.pages[i + 1] = copyCards
                }
            }
        }
        getCards = () => {
            return this.cards
        }
        getPages = () => {
            return this.pages
        }
        createHtmlCard(card) {
            const { picture, name, link, alt } = card
            const $card = document.createElement('div');
            $card.classList.add('slider__item', 'card');
            $card.innerHTML = `
            <img src="../${picture}" alt="${alt}" class="card__pic" />
            <div class="card__title">${name}</div>
            <button data-showCard="${link}" class="btn btn__transparent">Learn more</button>
            `
            return $card
        }
        renderPage = (numPage) => {
            this.$parentContainer.innerHTML = '';
            this.pages[numPage].forEach(card => {
                const $card = this.createHtmlCard(card);
                this.$parentContainer.append($card);
            })
        }

    }
    const cards = new Cards();
    const pagination = new Pagination('.our-friends__cards');
    getData().then(function (data) {
        data.forEach(card => {
            cards.add(card);
        });
        pagination.createCardsArray();
        pagination.start(placesForCards)

        // document.addEventListener('click', () => {
        //     console.log(pagination.getCards())
        // })
    })
    let placesForCards = 8;

    const checkWindowSize = (places) => {
        switch (true) {
            case document.documentElement.clientWidth < 640: places = 3
                break
            case document.documentElement.clientWidth < 1280: places = 6
                break
            default: places = 8
        }
        return places
    }
    placesForCards = checkWindowSize()
    window.addEventListener('resize', (e) => {
        let prevPlaces = placesForCards;
        placesForCards = checkWindowSize()
        prevPlaces !== placesForCards && (pagination.start(placesForCards))
    });
    class PaginationControls {
        constructor(btnCurrent) {
            this.btnCurrent = btnCurrent
            this.currentNumberPage = 1;
        }
        submitToRender = () => {
            pagination.renderPage(this.currentNumberPage);
            this.btnCurrent.textContent = this.currentNumberPage;
        }
        first = () => {
            this.currentNumberPage = 1;
            this.submitToRender();
        }
        prev = () => {
            this.currentNumberPage--;
            this.submitToRender();
        }
        next = () => {
            this.currentNumberPage++;
            this.submitToRender();
        }
        last = () => {
            this.currentNumberPage = Object.keys(pagination.getPages()).length
            this.submitToRender();
        }
        getCurrentPageNumber = () => {
            return this.currentNumberPage
        }
    }
    const $parentControls = document.querySelector('.our-friends__pagination');
    const $btnControls = $parentControls.querySelectorAll('[data-btn]');
    const btnFirst = $btnControls[0];
    const btnPrev = $btnControls[1];
    const btnCurrent = $btnControls[2];
    const btnNext = $btnControls[3];
    const btnLast = $btnControls[4];
    const paginationControls = new PaginationControls(btnCurrent)
    const activeBtns = (btns) => {
        btns.forEach(btn => {
            btn.classList.remove('btn-circle__inactive');
        })
    }
    const inactiveBtns = (btns) => {
        btns.forEach(btn => {
            btn.classList.add('btn-circle__inactive');
            btn.onclick = null
        })
    }
    const clickFirst = function () {
        paginationControls.first();
        if (!btnNext.onclick) btnNext.onclick = clickNext;
        if (!btnLast.onclick) btnLast.onclick = clickLast;
        inactiveBtns([btnFirst, btnPrev]);
        activeBtns([btnLast, btnNext])
    }
    const clickPrev = function () {
        paginationControls.prev();
        if (!btnNext.onclick) btnNext.onclick = clickNext;
        if (!btnLast.onclick) btnLast.onclick = clickLast;
        if (paginationControls.getCurrentPageNumber() === 1) {
            inactiveBtns([btnFirst, btnPrev]);
        }
        activeBtns([btnLast, btnNext])
    }
    const clickNext = function () {
        paginationControls.next();
        if (!btnPrev.onclick) btnPrev.onclick = clickPrev;
        if (!btnFirst.onclick) btnFirst.onclick = clickFirst;
        if (paginationControls.getCurrentPageNumber() === Object.keys(pagination.getPages()).length) {
            inactiveBtns([btnLast, btnNext])
        }
        activeBtns([btnFirst, btnPrev])
    }
    const clickLast = function () {
        paginationControls.last();
        if (!btnPrev.onclick) btnPrev.onclick = clickPrev;
        if (!btnFirst.onclick) btnFirst.onclick = clickFirst;
        inactiveBtns([btnLast, btnNext]);
        activeBtns([btnFirst, btnPrev]);
    }

    btnNext.onclick = clickNext;
    btnLast.onclick = clickLast;
}
hamburgerModule();
document.querySelector('.slider__items') && sliderModule();
document.querySelector('.our-friends__cards') && paginationModule();