// memorygame.js
// (c) Gernot Lenkner 2020

class MemoryGame {
    init() {
        console.log('init');
    }
}

const memorygame = new MemoryGame();

Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
    console.log('images finished loading');
});
