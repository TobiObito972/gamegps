// GAMEGPS — WARFRAME MODULE V1
const WARFRAME_API = "https://api.warframestat.us";

const WarframeGPS = {
    currentItem: null,

    init() {
        this.input = document.getElementById("warframeSearchInput");
        this.button = document.getElementById("warframeSearchButton");
        this.results = document.getElementById("warframeSearchResults");
        if (!this.input || !this.button || !this.results) return;
        this.button.addEventListener("click", () => this.search());
        this.input.addEventListener("keydown", event => {
            if (event.key === "Enter") this.search();
        });
    },

    normalize(text) {
        return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    },

    escape(text) {
        return String(text ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
    },

    normalizeResults(data) {
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.items)) return data.items;
        if (data && typeof data === "object") return [data];
        return [];
    },

    async search() {
        const query = this.input.value.trim();
        if (!query) return this.message("Entre le nom d'une ressource, Warframe ou arme.");
        this.results.innerHTML = `<div class="wf-status">Analyse GPS de <strong>${this.escape(query)}</strong>...</div>`;
        try {
            let items = [];
            const direct = await fetch(`${WARFRAME_API}/items/search/${encodeURIComponent(query)}`);
            if (direct.ok) items = this.normalizeResults(await direct.json());
            if (!items.length) {
                const response = await fetch(`${WARFRAME_API}/items`);
                if (response.ok) {
                    const all = this.normalizeResults(await response.json());
                    const q = this.normalize(query);
                    items = all.filter(item => item?.name && this.normalize(item.name).includes(q));
                }
            }
            if (!items.length) return this.message(`Aucun résultat pour « ${query} ».`);
            const q = this.normalize(query);
            this.currentItem = items.find(item => this.normalize(item.name) === q) || items[0];
            this.render(this.currentItem);
        } catch (error) {
            console.error("GameGPS Warframe:", error);
            this.message("Impossible de récupérer les données Warframe pour le moment.");
        }
    },

    getDrops(item) {
        const drops = [];
        if (Array.isArray(item?.drops)) drops.push(...item.drops);
        if (Array.isArray(item?.dropLocations)) item.dropLocations.forEach(d => drops.push(typeof d === "string" ? {location:d} : d));
        return drops;
    },

    location(drop) {
        return drop?.location || drop?.place || drop?.node || drop?.mission || "Destination inconnue";
    },

    percent(value) {
        const n = Number(value);
        if (!Number.isFinite(n)) return 0;
        return n <= 1 ? n * 100 : n;
    },

    chance(drop) {
        return this.percent(drop?.chance);
    },

    bestDrop(drops) {
        return [...drops].sort((a,b) => this.chance(b) - this.chance(a))[0] || null;
    },

    formatChance(drop) {
        const value = this.chance(drop);
        return value ? `${value.toFixed(2)} %` : "Non précisée";
    },

    score(drop) {
        if (!drop) return 0;
        const chance = Math.min(this.chance(drop), 70);
        const location = this.normalize(this.location(drop));
        let speed = 10;
        if (location.includes("capture")) speed = 30;
        else if (location.includes("exterminate")) speed = 25;
        else if (location.includes("disruption")) speed = 22;
        else if (location.includes("survival")) speed = 15;
        else if (location.includes("defense")) speed = 12;
        return Math.min(100, Math.round(chance + speed));
    },

    render(item) {
        const name = item?.name || "Objet inconnu";
        const type = item?.category || item?.type || item?.productCategory || "Warframe";
        const description = item?.description || "Aucune description disponible.";
        const image = item?.imageName ? `https://cdn.warframestat.us/img/${item.imageName}` : "";
        const drops = this.getDrops(item);
        const best = this.bestDrop(drops);
        const components = Array.isArray(item?.components) ? item.components : [];

        this.results.innerHTML = `<article class="wf-result-card">
            <div class="wf-result-head">
                ${image ? `<img src="${image}" alt="${this.escape(name)}">` : ""}
                <div><span class="wf-kicker">GAMEGPS / WARFRAME</span><h3>${this.escape(name)}</h3><small>${this.escape(type)}</small></div>
            </div>
            <p class="wf-description">${this.escape(description)}</p>
            ${best ? `<div class="wf-route"><div><span>DESTINATION GPS</span><strong>${this.escape(this.location(best))}</strong><small>Chance : ${this.formatChance(best)}</small></div><div class="wf-score"><span>GPS SCORE</span><strong>${this.score(best)}/100</strong></div></div>` : `<div class="wf-route"><div><span>GPS</span><strong>Aucun drop direct identifié</strong></div></div>`}
            ${components.length ? `<div class="wf-components"><h4>COMPOSANTS</h4>${components.map(c => `<div class="wf-row"><span>${this.escape(c.name || "Composant")}</span><strong>x${c.itemCount || c.quantity || c.count || 1}</strong></div>`).join("")}</div>` : ""}
            ${drops.length ? `<details class="wf-drops"><summary>Voir les destinations disponibles</summary>${[...drops].sort((a,b)=>this.chance(b)-this.chance(a)).slice(0,10).map(d => `<div class="wf-row"><span>${this.escape(this.location(d))}</span><strong>${this.formatChance(d)}</strong></div>`).join("")}</details>` : ""}
        </article>`;
    },

    message(text) {
        if (this.results) this.results.innerHTML = `<div class="wf-status">${this.escape(text)}</div>`;
    }
};

window.WarframeGPS = WarframeGPS;
document.addEventListener("DOMContentLoaded", () => WarframeGPS.init());
