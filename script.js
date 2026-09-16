// ==========================================
// GAMEGPS — MULTI-GAME CORE V1
// ==========================================

const GAMEGPS_GAMES = {
    warframe: {
        id: "warframe",
        name: "Warframe",
        page: "warframe.html",
        status: "active",
        features: ["resources", "characters", "weapons", "progression", "relics", "assistant"],
        api: "https://api.warframestat.us"
    },
    palworld: {
        id: "palworld",
        name: "Palworld",
        page: "palworld.html",
        status: "planned",
        features: ["pals", "resources", "map", "builds", "progression"]
    },
    animo: {
        id: "animo",
        name: "Animo",
        page: "animo.html",
        status: "planned",
        features: ["guides", "exploration", "progression"]
    }
};

const GameGPS = {
    currentGame: null,

    init() {
        this.currentGame = document.body.dataset.game || this.detectGame();
        this.bindCards();
        this.bindNavigation();
        this.restoreProgress();
        console.log(`GameGPS Core loaded${this.currentGame ? ` • ${this.currentGame}` : ""}`);
    },

    detectGame() {
        const page = window.location.pathname.split("/").pop().toLowerCase();
        const game = Object.values(GAMEGPS_GAMES).find(entry => entry.page === page);
        return game?.id || null;
    },

    getGame(gameId = this.currentGame) {
        return GAMEGPS_GAMES[gameId] || null;
    },

    openGame(gameId) {
        const game = this.getGame(gameId);
        if (!game) return;

        if (game.status !== "active") {
            this.showToast(`${game.name} GPS arrive bientôt.`);
            return;
        }

        window.location.href = game.page;
    },

    bindCards() {
        document.querySelectorAll(".game-card").forEach(card => {
            card.style.cursor = "pointer";

            const title = card.querySelector("h3")?.textContent?.trim().toLowerCase();
            if (!title || !GAMEGPS_GAMES[title]) return;

            card.dataset.game = title;
            card.addEventListener("click", event => {
                if (event.target.closest("a, button")) return;
                this.openGame(title);
            });
        });
    },

    bindNavigation() {
        document.querySelectorAll("[data-game-link]").forEach(element => {
            element.addEventListener("click", event => {
                event.preventDefault();
                this.openGame(element.dataset.gameLink);
            });
        });
    },

    saveProgress(key, value, gameId = this.currentGame) {
        if (!gameId) return;
        const data = this.getProgress(gameId);
        data[key] = value;
        localStorage.setItem(`gamegps:${gameId}:progress`, JSON.stringify(data));
    },

    getProgress(gameId = this.currentGame) {
        if (!gameId) return {};
        try {
            return JSON.parse(localStorage.getItem(`gamegps:${gameId}:progress`)) || {};
        } catch {
            return {};
        }
    },

    restoreProgress() {
        if (!this.currentGame) return;
        document.dispatchEvent(new CustomEvent("gamegps:progress", {
            detail: this.getProgress()
        }));
    },

    showToast(message) {
        let toast = document.querySelector(".gamegps-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.className = "gamegps-toast";
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
    }
};

window.GameGPS = GameGPS;
window.GAMEGPS_GAMES = GAMEGPS_GAMES;

document.addEventListener("DOMContentLoaded", () => GameGPS.init());
