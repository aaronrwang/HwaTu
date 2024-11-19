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

// rewrite stocks like how i did for the other one. Display them all by one.

export class Game {
    constructor(room) {
        console.log("Game was made");
        this.deck = Array.from({ length: 48 }, (_, i) => (i + 1));
        this.hand = [[], []];
        this.stock = [[[[], []], [[], [], [], []], [[], []], []], [[[], []], [[], [], [], []], [[], []], []]];
        this.middle = Array.from({ length: 12 }, () => []);
        this.scores = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        this.dealCards();
        this.user1 = room.user1;
        this.user2 = room.user2;
        this.active = 0;
        this.part2 = 0;
        this.activeCard = 0;
        this.passiveCard = 0;
    }

    getPile(card) {
        return Math.floor((card - 1) / 4);
    }

    getStockPile(card) {
        const type = cards[card - 1].type - 1;
        const special = cards[card - 1].special;
        const stock = this.stock[this.active]
        if (type === 0) {
            if (special == 'ssangpi') {
                return stock[type][1]
            } else {
                return stock[type][0]
            }
        } else if (type === 1) {
            if (special == 'hongdan') {
                return stock[type][0];
            } else if (special == 'chodan') {
                return stock[type][1];
            } else if (special == 'cheongdan') {
                return stock[type][2];
            } else if (special == 'december') {
                return stock[type][3];
            } else {
                alert("ERROR RIBBON TYPE")
            }
        } else if (type === 2) {
            if (special == 'godori') {
                return stock[type][1];
            } else {
                return stock[type][0];
            }
        } else if (type === 3) {
            return stock[type];
        }
        alert('error');
    }

    dealCards() {
        // shuffle deck
        for (let i = 0; i < 100; i++) {
            let rand = Math.floor(Math.random() * 49)
            this.deck.splice(rand, 0, this.deck[0])
            this.deck.shift()
        }

        // deal middle
        for (let i = 0; i < 8; i++) {
            let temp = this.deck.shift()
            let tempIndex = Math.floor((temp - 1) / 4);
            this.middle[tempIndex].push(temp)
        }

        // deal p1 and p2
        for (let i = 0; i < 10; i++) {
            this.hand[0].push(this.deck.shift())
            this.hand[1].push(this.deck.shift())
        }
    }

    // start turn
    move(activeCard) {
        let pile = this.getPile(activeCard);

        let l = (this.middle[pile]).length;
        let index = this.hand[this.active].indexOf(activeCard);
        this.hand[this.active].splice(index, 1);
        this.activeCard = activeCard;
        // only make active card and dont pass option straight up call move2 and then move3?
        if (l === 0) {
            this.move2(0);
        } else if (l === 1) {
            this.move2(0);
        } else if (l === 3) {
            this.move2(0);
        }
        // if it is 2 they have to choose again
    }

    // first pick
    move2(activeCard) {
        let pile = this.getPile(this.activeCard);;
        let l = (this.middle[pile]).length;
        this.part2 = 1;
        let topcard = this.deck.shift();
        let topcardpile = this.getPile(topcard);
        if (topcardpile === pile) {
            if (l == 0) {
                // move card and topcard to stock
                this.moveCard(this.activeCard, null, this.getStockPile(this.activeCard));
                this.moveCard(topcard, null, this.getStockPile(topcard));
                this.stealJunk();
            } else if (l == 1) {
                // move card and top card to middle ppeok
                this.moveCard(this.activeCard, null, this.middle[pile]);
                this.moveCard(topcard, null, this.middle[pile]);
            } else if (l == 2) {
                // move all 4 to stock
                this.moveCard(this.activeCard, null, this.getStockPile(this.activeCard));
                this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
                this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
                this.moveCard(topcard, null, this.getStockPile(topcard));
                this.stealJunk();

            }
            this.activeCard = 0;
            this.active = (this.active + 1) % 2;
            this.part2 = 0;
            // end turn;
        } else {
            // deal with active and then move 3 is for topcard
            if (l == 0) {
                // move active to middle
                this.moveCard(this.activeCard, null, this.middle[pile]);
            } else if (l == 1) {
                // move active and middle to stock
                this.moveCard(this.activeCard, null, this.getStockPile(this.activeCard));
                this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
            } else if (l == 2) {
                // move active and selected card to stock
                this.moveCard(this.activeCard, null, this.getStockPile(this.activeCard));
                this.moveCard(activeCard, this.middle[pile], this.getStockPile(activeCard));
            } else if (l == 3) {
                //move all 4 cards to stock
                this.moveCard(this.activeCard, null, this.getStockPile(this.activeCard));
                this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
                this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
                this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
            }
            l = (this.middle[topcardpile]).length;
            this.activeCard = topcard;
            if (l !== 2) {
                this.move3(0);
            }
        }
    }

    // second pick
    move3(activeCard) {
        this.part2 = 0;
        let pile = this.getPile(this.activeCard);
        let l = (this.middle[pile]).length;

        if (l == 0) {
            this.moveCard(this.activeCard, null, this.middle[pile]);
        } else if (l == 1) {
            this.moveCard(this.activeCard, null, this.getStockPile(this.activeCard));
            this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
        } else if (l == 2) {
            this.moveCard(this.activeCard, null, this.getStockPile(this.activeCard));
            this.moveCard(activeCard, this.middle[pile], this.getStockPile(activeCard));
        } else if (l == 3) {
            this.moveCard(this.activeCard, null, this.getStockPile(this.activeCard));
            this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
            this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
            this.moveCard(this.middle[pile][0], this.middle[pile], this.getStockPile(this.middle[pile][0]));
        }
        this.activeCard = 0;
        this.active = (this.active + 1) % 2;
    }

    moveCard(card, from, to) {
        if (from) {
            let index = from.indexOf(card);
            from.splice(index, 1);
        }
        to.push(card);
    }
    stealJunk() {
        const opp = (this.active + 1) % 2
        if ((this.stock[opp][0][0]).length !== 0) {
            this.moveCard(this.stock[opp][0][0][0], this.stock[opp][0][0], this.stock[this.active][0][0])
        }
    }

    calculateScore() {
        const scores = this.scores;
        const tabledCards = this.stock;
        for (let i = 0; i < 2; i++) {

            //for junk one; double junk two; need 10 for first point
            scores[i][1] = 0
            scores[i][1] += tabledCards[i][0][0].length
            scores[i][1] += tabledCards[i][0][1].length * 2
            scores[i][1] -= 9
            if (scores[i][1] < 0) {
                scores[i][1] = 0
            }

            //for ribbon Five = 1 points +1 up to 5 for 9 and 3 sets for 3 points
            scores[i][2] = -4
            let sets = 0;
            tabledCards[i][1].forEach((set) => {
                let setLength = set.length
                scores[i][2] += setLength
                if (setLength == 3) {
                    sets++;
                }
            })

            if (scores[i][2] < 0) {
                scores[i][2] = 0
            }
            scores[i][2] += sets * 3

            //for animals Five = 1 points +1 up to 5 for 9 and 1 set for 5 points
            scores[i][3] = tabledCards[i][2][0].length + tabledCards[i][2][1].length - 4
            if (scores[i][3] < 0) {
                scores[i][3] = 0
            }
            if (tabledCards[i][2][1].length == 3) {
                scores[i][3] += 5
            }

            //for brights if 3 and decemebr 2, if 3 no december 3, if 4 then 4, if 5 then 15
            let brightCount = tabledCards[i][3].length
            if (brightCount == 3) {
                scores[i][4] = 3
                tabledCards[i][3].forEach((card) => {
                    if (card.special == 'december') {
                        scores[i][4]--
                    }
                })
            } else if (brightCount == 4) {
                scores[i][4] = 4
            } else if (brightCount == 5) {
                scores[i][4] == 15
            }
            //total score is all added together
            scores[i][0] = scores[i][1] + scores[i][2] + scores[i][3] + scores[i][4]
        }
        if (scores[0][0] >= 7) {
            return 0
        } else if (scores[1][0] >= 7) {
            return 1;
        }
        return -1;
    }
}