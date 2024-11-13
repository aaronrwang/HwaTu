const cards = [
    { id: 1, type: 4, special: '' },
    { id: 2, type: 2, special: 'hongdan' },
    { id: 3, type: 1, special: '' },
    { id: 4, type: 1, special: '' },

    { id: 5, type: 3, special: 'godori' },
    { id: 6, type: 2, special: 'hongdan' },
    { id: 7, type: 1, special: '' },
    { id: 8, type: 1, special: '' },

    { id: 9, type: 4, special: '' },
    { id: 10, type: 2, special: 'hongdan' },
    { id: 11, type: 1, special: '' },
    { id: 12, type: 1, special: '' },

    { id: 13, type: 3, special: 'godori' },
    { id: 14, type: 2, special: 'chodan' },
    { id: 15, type: 1, special: '' },
    { id: 16, type: 1, special: '' },

    { id: 17, type: 3, special: '' },
    { id: 18, type: 2, special: 'chodan' },
    { id: 19, type: 1, special: '' },
    { id: 20, type: 1, special: '' },

    { id: 21, type: 3, special: '' },
    { id: 22, type: 2, special: 'cheongdan' },
    { id: 23, type: 1, special: '' },
    { id: 24, type: 1, special: '' },

    { id: 25, type: 3, special: '' },
    { id: 26, type: 2, special: 'chodan' },
    { id: 27, type: 1, special: '' },
    { id: 28, type: 1, special: '' },

    { id: 29, type: 4, special: '' },
    { id: 30, type: 3, special: 'godori' },
    { id: 31, type: 1, special: '' },
    { id: 32, type: 1, special: '' },

    { id: 33, type: 3, special: '' },
    { id: 34, type: 2, special: 'cheongdan' },
    { id: 35, type: 1, special: '' },
    { id: 36, type: 1, special: '' },

    { id: 37, type: 3, special: '' },
    { id: 38, type: 2, special: 'cheongdan' },
    { id: 39, type: 1, special: '' },
    { id: 40, type: 1, special: '' },

    { id: 41, type: 4, special: '' },
    { id: 42, type: 1, special: 'ssangpi' },
    { id: 43, type: 1, special: '' },
    { id: 44, type: 1, special: '' },

    { id: 45, type: 4, special: 'december' },
    { id: 46, type: 3, special: '' },
    { id: 47, type: 2, special: 'december' },
    { id: 48, type: 1, special: 'ssangpi' },
];


export class Game {
    constructor(room) {
        this.deck = []
        this.p1 = []
        this.p2 = []
        this.middle = []
        this.p1stock = []
        this.p2stock = []
        this.user1 = room.user1
        this.user2 = room.user2
    }

    dealCards() {
        // create deck
        this.deck = Array.from({ length: 48 }, (_, i) => (i + 1));

        // shuffle deck
        for (let i = 0; i < 100; i++) {
            let rand = Math.floor(Math.random() * 49)
            this.deck.splice(rand, 0, this.deck[0])
            this.deck.shift()
        }

        // deal middle
        for (let i = 0; i < 8; i++) {
            this.middle.push(this.deck.shift())
        }

        // deal p1
        for (let i = 0; i < 8; i++) {
            this.p1.push(this.deck.shift())
        }

        // deal p2
        for (let i = 0; i < 8; i++) {
            this.p2.push(this.deck.shift())
        }


    }
}