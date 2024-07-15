"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        // Check if the move is from the correct player
        if ((this.board.turn() === 'w' && socket !== this.player1) || (this.board.turn() === 'b' && socket !== this.player2)) {
            return;
        }
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        // Check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === 'w' ? 'Black' : 'White';
            const message = JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: winner
                }
            });
            this.player1.send(message);
            this.player2.send(message);
            return;
        }
        // Notify both players of the move
        const message = JSON.stringify({
            type: messages_1.MOVE,
            payload: move
        });
        this.player1.send(message);
        this.player2.send(message);
    }
}
exports.Game = Game;
