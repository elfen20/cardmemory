// memorygame.js
// (c) Gernot Lenkner 2020

class MemoryGame {
    constructor() {
        this.busy = true;
        this.root = document.getElementById("memory-game");
        this.bgimage = document.getElementById("memory-bg");
        this.images = this.root.getElementsByClassName("memory-img");
        this.turnedFields = [];
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

    turnToShow(element) {
        element.style.transition = "left 1s ease-out 1s, width 1s ease-out 1s"
//        element.style.visibility = "visible";
        element.style.width = "100%";
        element.style.left = "0%";
    }

    turnToHide(element) {
        element.style.transition = "left 1s ease-in, width 1s ease-in"
        element.style.width = "0%";
        element.style.left = "50%";
    }

/*
    turnCard(elementToHide, elementToShow) {
        memorygame.turnToHide(elementToHide);
        memorygame.turnToShow(elementToShow);
        window.setTimeout(function() {memorygame.checkGame(); }, 1000);
    }
    */

    showCard(fieldElement) {
        var cardImage = fieldElement.querySelector('.memory-card');
        var bgImage = fieldElement.querySelector('.memory-card-back');
        memorygame.turnToHide(bgImage);
        memorygame.turnToShow(cardImage);
        window.setTimeout(memorygame.checkGame, 1000);
    }

    hideCard(fieldElement) {
        var cardImage = fieldElement.querySelector('.memory-card');
        var bgImage = fieldElement.querySelector('.memory-card-back');
        memorygame.turnToHide(cardImage);
        memorygame.turnToShow(bgImage);
    }


    fixColumnCount() {
        var cssProp = 'auto '.repeat(this.fieldSize).trim();
        //        this.root.style.backgroundColor = "red";
        this.root.style.gridTemplateColumns = cssProp;
    }

    onClickField(data) {
        if (memorygame.busy) return;
        var fieldElement = data.target.parentElement
        console.log(fieldElement);
        if ((memorygame.turnedFields.length == 1) && (memorygame.turnedFields[0] == fieldElement)) return;
        memorygame.turnedFields.push(fieldElement);
        memorygame.busy = true;        
        //fieldElement.style.visibility = "hidden";
        //memorygame.fadeOut(fieldElement);
        memorygame.showCard(fieldElement);
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
    resetTurnedCards() {
        memorygame.hideCard(memorygame.turnedFields[0]);
        memorygame.hideCard(memorygame.turnedFields[1]);
        window.setTimeout(function() { 
            memorygame.turnedFields = [];
            memorygame.busy=false; 
        }, 1000);
    }


    checkGame() {
        if (memorygame.turnedFields.length !== 2) {
            memorygame.busy = false;
            return;
        } 
        // no match
        window.setTimeout(function() { 
            memorygame.resetTurnedCards();
        }, 3000);
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
            this.busy = false;
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
