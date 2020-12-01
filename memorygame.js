// memorygame.js
// (c) Gernot Lenkner 2020

class MemoryGame {
    constructor() {
        this.turnSpeed = "0.5s";
        this.waitTime = "1000";

        this.busy = true;
        this.root = document.querySelector("#memory-game");
        this.msgElement = document.querySelector("#memory-msg");
        this.bgimage = document.querySelector("#memory-bg");
        this.images = this.root.querySelectorAll(".memory-img");
        this.transitionHide = "left " + this.turnSpeed + " ease-in, width " + this.turnSpeed + " ease-in";
        this.transitionShow = "left ".concat(this.turnSpeed, " ease-out ", this.turnSpeed, ", width ", this.turnSpeed, " ease-out ", this.turnSpeed);
        this.transitionVanish = "opacity ".concat(this.turnSpeed, ", visibility ", this.turnSpeed, " linear ", this.turnSpeed);
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
        element.style.transition = memorygame.transitionShow;
        element.style.width = "100%";
        element.style.left = "0%";
    }

    turnToHide(element) {
        element.style.transition = memorygame.transitionHide;
        element.style.width = "0%";
        element.style.left = "50%";
    }

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

    hideField(fieldElement) {
        fieldElement.style.transition = memorygame.transitionVanish;
        fieldElement.style.opacity = "0";
        fieldElement.style.visibility = "hidden";
    }


    fixColumnCount() {
        var cssProp = 'auto '.repeat(this.fieldSize).trim();
        this.root.style.gridTemplateColumns = cssProp;
    }

    onClickField(data) {
        if (memorygame.busy) return;
        var fieldElement = data.target.parentElement;
        if ((memorygame.turnedFields.length == 1) && (memorygame.turnedFields[0] == fieldElement)) return;
        memorygame.turnedFields.push(fieldElement);
        memorygame.busy = true;
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
        this.remainingCards = this.images.length;
        for (const element of this.images) {
            imglist.push(element);
            imglist.push(element.cloneNode());
        }
        imglist.sort(this.shuffle);
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
        for (const field of memorygame.turnedFields) {
            memorygame.hideCard(field);
        }
        window.setTimeout(function () {
            memorygame.turnedFields = [];
            memorygame.returnToPlay();
        }, memorygame.waitTime);
    }

    hideFoundCards() {
        for (const field of memorygame.turnedFields) {
            memorygame.hideField(field);
        }
        memorygame.remainingCards--;
        window.setTimeout(function () {
            memorygame.turnedFields = [];
            memorygame.returnToPlay();
        }, memorygame.waitTime);
    }

    returnToPlay() {
        memorygame.writeGameStatus();
        memorygame.busy = false;
    }

    writeGameStatus() {
        if (memorygame.turnedFields.length == 1) {
            memorygame.setGameMsg("Wähle eine weitere Karte!");
        } else {
            if (memorygame.remainingCards == 0) {
                memorygame.setGameMsg("Du hast gewonnen! Noch ein Spiel ?");
            } else {
                memorygame.setGameMsg(" Du hast ".concat(memorygame.remainingCards," übrige(s) Kartenpaar(e) und bis jetzt ", memorygame.usedTurns, " Versuch(e) gebraucht."));
            }
        }
    }

    setGameMsg(text) {
        memorygame.msgElement.textContent = text;
    }

    checkGame() {
        if (memorygame.turnedFields.length !== 2) {
            memorygame.returnToPlay();
            return;
        }
        memorygame.usedTurns++;
        var src1 = memorygame.turnedFields[0].querySelector('.memory-card').src;
        var src2 = memorygame.turnedFields[1].querySelector('.memory-card').src;
        if (src1 == src2) {
            // match
            memorygame.setGameMsg("Treffer!");
            window.setTimeout(function () {
                memorygame.hideFoundCards();
            }, memorygame.waitTime);
        } else {
            // no match
            memorygame.setGameMsg("diese Karten passen nicht zusammen...");
            window.setTimeout(function () {
                memorygame.resetTurnedCards();
            }, memorygame.waitTime);
        }
    }

    isValidGame() {
        var sqr = Math.sqrt(memorygame.images.length * 2);
        this.fieldSize = Math.floor(sqr);
        return (this.fieldSize > 1);
    }

    reset() {
        memorygame.turnedFields = [];
        memorygame.remainingCards = 0;
        memorygame.usedTurns = 0;
        for (const img of memorygame.images) {
            img.style.width = "0%";
            img.style.left = "50%";
        }
    }

    init() {
        if (this.isValidGame()) {
            memorygame.reset();
            this.generatePlayingField();
            this.bgimage.style.visibility = "hidden";
            this.setGameMsg("Bereit, wenn du es bist! Wähle eine Karte!");
            this.busy = false;
        }
        else {
            console.log("Error: You need at least 2 Images!");
        }
    }
}

const memorygame = new MemoryGame();

Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
    document.querySelector("#memory-reset").onclick = function() {
        if (memorygame.busy) return;
        memorygame.init();
    };
    memorygame.init();
//    console.log(memorygame);
});
