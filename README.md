<!DOCTYPE html><html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pintu-Zero Puzzle Game</title>
    <style>
        body { text-align: center; font-family: Arial, sans-serif; }
        .game-container { display: flex; justify-content: space-around; }
        .board { display: grid; grid-template-columns: repeat(3, 100px); grid-gap: 5px; }
        .cell { width: 100px; height: 100px; font-size: 24px; text-align: center; line-height: 100px; border: 1px solid black; cursor: pointer; }
        #coinDisplay, #userIdDisplay { margin-top: 20px; }
        .share-container { margin-top: 20px; }
    </style>
    <script>
        function checkInternet() {
            if (!navigator.onLine) {
                document.body.innerHTML = "<h1>Internet Connection Required</h1><p>Please connect to the internet to play this game.</p>";
            }
        }
        window.onload = checkInternet;
        window.addEventListener("offline", checkInternet);
    </script>
</head>
<body>
    <h1>Pintu-Zero Puzzle Game</h1>
    <h3 id="userIdDisplay"></h3>
    <div class="game-container">
        <div>
            <h2>User Board</h2>
            <div class="board" id="userBoard"></div>
        </div>
        <div>
            <h2>AI Board</h2>
            <div class="board" id="aiBoard"></div>
        </div>
    </div>
    <h3 id="coinDisplay">Coins: 0</h3>
    <div class="share-container">
        <input type="text" id="receiverId" placeholder="Enter Receiver's User ID">
        <input type="number" id="sendAmount" placeholder="Enter Coin Amount">
        <button onclick="sendCoins()">Send Coins</button>
    </div>
    <script>
        let userBoard = document.getElementById("userBoard");
        let aiBoard = document.getElementById("aiBoard");
        let userMoves = Array(9).fill(null);
        let aiMoves = Array(9).fill(null);
        let coins = localStorage.getItem("coins") ? parseInt(localStorage.getItem("coins")) : 0;
        let userId = localStorage.getItem("userId");
        if (!userId) {
            userId = Math.floor(1000000000 + Math.random() * 9000000000);
            localStorage.setItem("userId", userId);
        }
        document.getElementById("userIdDisplay").innerText = "Your Unique ID: " + userId;
        document.getElementById("coinDisplay").innerText = "Coins: " + coins;function createBoard(boardElement, isAI) {
        for (let i = 0; i < 9; i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.addEventListener("click", function() {
                if (!isAI && !userMoves[i]) {
                    cell.innerText = "X";
                    userMoves[i] = "X";
                    checkWin(userMoves, "User");
                    aiMove();
                }
            });
            boardElement.appendChild(cell);
        }
    }

    function aiMove() {
        let emptyCells = aiMoves.map((val, index) => val === null ? index : null).filter(val => val !== null);
        if (emptyCells.length > 0) {
            let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            aiMoves[randomCell] = "O";
            aiBoard.children[randomCell].innerText = "O";
            checkWin(aiMoves, "AI");
        }
    }

    function checkWin(moves, player) {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        for (let pattern of winPatterns) {
            if (moves[pattern[0]] && moves[pattern[0]] === moves[pattern[1]] && moves[pattern[0]] === moves[pattern[2]]) {
                alert(player + " wins!");
                resetGame();
                return;
            }
        }
        if (!moves.includes(null)) {
            alert("It's a draw!");
            resetGame();
        }
    }

    function resetGame() {
        userMoves.fill(null);
        aiMoves.fill(null);
        [...userBoard.children, ...aiBoard.children].forEach(cell => cell.innerText = "");
        coins++;
        localStorage.setItem("coins", coins);
        document.getElementById("coinDisplay").innerText = "Coins: " + coins;
        generateBlockchainCode();
    }

    function generateBlockchainCode() {
        let uniqueCode = "BC-" + Math.floor(100000 + Math.random() * 900000);
        alert("Blockchain Code Generated: " + uniqueCode);
        localStorage.setItem("blockchainCode", uniqueCode);
    }

    function sendCoins() {
        let receiverId = document.getElementById("receiverId").value;
        let amount = parseInt(document.getElementById("sendAmount").value);
        if (!receiverId || isNaN(amount) || amount <= 0 || amount > coins) {
            alert("Invalid transaction");
            return;
        }
        coins -= amount;
        localStorage.setItem("coins", coins);
        document.getElementById("coinDisplay").innerText = "Coins: " + coins;
        alert("Sent " + amount + " coins to User ID: " + receiverId);
    }

    createBoard(userBoard, false);
    createBoard(aiBoard, true);
</script>

</body>
</html>
