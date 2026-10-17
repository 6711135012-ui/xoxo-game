import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDD9SOBQWllCVgVHarjDauk_jNijZegoI",
    authDomain: "xoxo-battle-eccbc.firebaseapp.com",
    databaseURL: "https://xoxo-battle-eccbc-default-rtdb.firebaseio.com",
    projectId: "xoxo-battle-eccbc",
    storageBucket: "xoxo-battle-eccbc.appspot.com",
    messagingSenderId: "960030009765",
    appId: "1:960030009765:web:902d6613a17279c78a204c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentRoom = null;
let myRole = null;
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const playerRoleText = document.getElementById('player-role');
const roomInfoText = document.getElementById('room-info');
const restartBtn = document.getElementById('restart-btn');

document.getElementById('create-room').addEventListener('click', () => {
    const roomCode = Math.random().toString(36).substring(2, 8);
    currentRoom = roomCode;
    myRole = 'X';

    const initialData = {
        board: Array(9).fill(""),
        turn: 'X',
        winner: null,
        players: { X: true, O: false }
    };

    set(ref(db, 'rooms/' + roomCode), initialData).then(() => {
        enterGameUI(roomCode, 'X');
        listenToGame(roomCode);
    }).catch((error) => {
        alert("เกิดข้อผิดพลาดในการสร้างห้อง: " + error.message);
    });
});

document.getElementById('join-room').addEventListener('click', () => {
    const roomCode = document.getElementById('room-code-input').value.trim();
    if (!roomCode) return alert('กรุณากรอกรหัสห้อง');

    const roomRef = ref(db, 'rooms/' + roomCode);
    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            alert('ไม่พบห้องนี้!');
            return;
        }

        if (!data.players.O) {
            currentRoom = roomCode;
            myRole = 'O';
            update(ref(db, `rooms/${roomCode}/players`), { O: true });
            enterGameUI(roomCode, 'O');
            listenToGame(roomCode);
        } else if (data.players.O && myRole !== 'O') {
            alert('ห้องนี้เต็มแล้ว!');
        }
    }, { onlyOnce: true });
});

function enterGameUI(code, role) {
    document.getElementById('room-setup').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    roomInfoText.innerText = `รหัสห้อง: ${code}`;
    playerRoleText.innerText = `คุณคือผู้เล่น: ${role}`;
}

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        if (!currentRoom) return;

        const roomRef = ref(db, 'rooms/' + currentRoom);
        onValue(roomRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            if (data.turn === myRole && data.board[index] === "" && !data.winner) {
                data.board[index] = myRole;
                const nextTurn = myRole === 'X' ? 'O' : 'X';
                let winner = checkWinner(data.board);

                update(ref(db, 'rooms/' + currentRoom), {
                    board: data.board,
                    turn: winner ? null : nextTurn,
                    winner: winner
                });
            }
        }, { onlyOnce: true });
    });
});

function listenToGame(roomCode) {
    const roomRef = ref(db, 'rooms/' + roomCode);
    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        data.board.forEach((val, idx) => {
            cells[idx].innerText = val;
        });

        if (data.winner) {
            if (data.winner === 'Draw') {
                statusText.innerText = 'เกมจบลงด้วยผลเสมอ!';
            } else {
                statusText.innerText = `ผู้เล่น ${data.winner} ชนะแล้ว!`;
            }
            restartBtn.style.display = 'block';
        } else {
            statusText.innerText = data.turn === myRole ? 'ตาของคุณ!' : `รอตาของผู้เล่น ${data.turn}...`;
        }
    });
}

function checkWinner(board) {
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (!board.includes("")) return 'Draw';
    return null;
}

restartBtn.addEventListener('click', () => {
    if (!currentRoom) return;
    set(ref(db, 'rooms/' + currentRoom), {
        board: Array(9).fill(""),
        turn: 'X',
        winner: null,
        players: { X: true, O: true }
    });
    restartBtn.style.display = 'none';
});