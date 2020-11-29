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

    createElement(type, classname, child) {
        var el = document.createElement(type);
        if (typeof classname !== 'undefined') {
            el.className = classname;
        }
        if (typeof child !== 'undefined') {
            el.appendChild(child);
        }
        return el;
    }

    createDiv(classname, child) {
        return this.createElement('div', classname, child);
    }

    fixColumnCount(length) {
        var count = Math.floor(Math.sqrt(length));
        var cssProp = 'auto '.repeat(count).trim();
        this.root.style.backgroundColor = "red";
        this.root.style.gridTemplateColumns = cssProp;
    }

    onClickField(data) {
        var fieldElement = data.target.parentElement
        console.log(fieldElement);
        fieldElement.style.visibility = "hidden";
    }

    generatePlayingField() {
        var imglist = [];
        var i = 0;
        for (const element of this.images) {
            imglist.push(element);
            imglist.push(element.cloneNode());
        };
        imglist.sort(this.shuffle);
        //        console.log(imglist);
        this.fixColumnCount(imglist.length);
        this.removeAllChildNodes(this.root);
        for (const element of imglist) {
            var space = this.createDiv('memory-space', element);
            space.dataset.mgId = i;
            space.onclick = this.onClickField;
            this.root.appendChild(space);
            i++;
        }
    }

    isValidGame() {
        var sqr = Math.sqrt(this.images.length * 2);
        console.log(sqr);
        return (Math.floor(sqr) == sqr);
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
