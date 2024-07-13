import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }

    makeMove(socket: WebSocket, move: string) {
        // Check if the move is from the correct player
        if ((this.board.turn() === 'w' && socket !== this.player1) || (this.board.turn() === 'b' && socket !== this.player2)) {
            return;
        }

        try {
            this.board.move(move);
        } catch (error) {
            return;
        }

        // Check if the game is over
        if (this.board.isGameOver()) {
            const winner = this.board.turn() === 'w' ? 'Black' : 'White';
            const message = JSON.stringify({
                type: GAME_OVER,
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
            type: MOVE,
            payload: move
        });

        this.player1.send(message);
        this.player2.send(message);
    }
}
