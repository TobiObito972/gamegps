document.addEventListener("DOMContentLoaded", () => {

    console.log("GameGPS loaded successfully 🎮");

    const gameCards = document.querySelectorAll(".game-card");

    gameCards.forEach((card) => {

        card.addEventListener("mouseenter", () => {
            card.style.cursor = "pointer";
        });

    });

});
