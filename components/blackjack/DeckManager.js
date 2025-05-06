// components/blackjack/DeckManager.js
export default class DeckManager {
  constructor() {
    this.resetDeck();
  }

  resetDeck() {
    const naipes = ['♠', '♥', '♦', '♣'];
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.deck = [];

    // Duas vezes o baralho (2 baralhos completos = 104 cartas)
    for (let i = 0; i < 2; i++) {
      for (let naipe of naipes) {
        for (let valor of valores) {
          this.deck.push({ valor, naipe });
        }
      }
    }

    this.shuffle();
  }

  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  sortearCarta() {
    if (this.deck.length === 0) {
      this.resetDeck();
    }

    return this.deck.pop(); // Remove e retorna a última carta (já embaralhada)
  }

  getCartasRestantes() {
    return this.deck.length;
  }
}
