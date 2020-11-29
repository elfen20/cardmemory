// memorygame.js
// (c) Gernot Lenkner 2020

class MemoryGame {
    constructor() {
        this.busy = true;
        this.root = document.getElementById("memory-game");
        this.bgimage = document.getElementById("memory-bg");
        this.images = this.root.getElementsByClassName("memory-img");
        this.fieldSpaces = [];
    }

    shuffle(a, b) {
        return 0.5 - Math.random();
    }

    removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    createElement(type, classname) {
        var el = document.createElement(type);
        if (typeof classname !== 'undefined') {
            el.className = classname;
        }
        return el;
    }

    createDiv(classname) {
        return this.createElement('div', classname);
    }

    fadeOut(element, callBack) {
        element.style.opacity = "0";
    }

    turnOn(element) {
        element.style.visibility = "visible";
        element.style.width = "100%";
        element.style.left = "0%";
    }

    turnOff(element) {
        element.style.width = "0%";
        element.style.left = "50%";
    }

    turnCardFront(cardImage, bgImage) {
        memorygame.turnOff(bgImage);
        window.setTimeout(function() {memorygame.turnOn(cardImage); }, 1000);
    }

    turnCardBack(fieldElement) {
        var cardImage = fieldElement.querySelector('.memory-card');
        var bgImage = fieldElement.querySelector('.memory-card-back');

    }


    fixColumnCount() {
        var cssProp = 'auto '.repeat(this.fieldSize).trim();
        //        this.root.style.backgroundColor = "red";
        this.root.style.gridTemplateColumns = cssProp;
    }

    onClickField(data) {
        var fieldElement = data.target.parentElement
        console.log(fieldElement);
        var cardImage = fieldElement.querySelector('.memory-card');
        var bgImage = fieldElement.querySelector('.memory-card-back');
        //fieldElement.style.visibility = "hidden";
        //memorygame.fadeOut(fieldElement);
        memorygame.turnCardFront(cardImage, bgImage);
    }

    generateCardBack(index) {
        var cb = this.createElement('img', 'memory-card-back');
        cb.src = this.bgimage.src;
        return cb;
    }

    generatePlayingField() {
        var imglist = [];
        var i = 0;
        for (const element of this.images) {
            imglist.push(element);
            imglist.push(element.cloneNode());
        };
        imglist.sort(this.shuffle);
        console.log(imglist);
        this.fixColumnCount(this.fieldSize);
        this.removeAllChildNodes(this.root);
        for (const element of imglist) {
            var space = this.createDiv('memory-space');
            space.dataset.mgId = i;
            space.onclick = this.onClickField;
            element.className = 'memory-card';
            space.appendChild(element);
            space.appendChild(this.generateCardBack(i));
            this.root.appendChild(space);
            i++;
        }
    }

    isValidGame() {
        var sqr = Math.sqrt(this.images.length * 2);
        this.fieldSize = Math.floor(sqr);
        console.log(this.fieldSize);
        return (this.fieldSize == sqr);
    }

    init() {
        if (this.isValidGame()) {
            this.generatePlayingField();
            this.bgimage.style.visibility = "hidden";
        }
        else {
            console.log("Error: Image count has to be a half of a square number!")
        }
    }
}

const memorygame = new MemoryGame();

Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
    console.log('images finished loading');
    memorygame.init();
    console.log(memorygame);
});
