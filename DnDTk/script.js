const itemList = document.getElementById("itemList");

const items = {
    "dndtk/":                   "Players Creator",
    "search/classsearch/":      "Class search",
    "search/racesearch/":       "Race/Species search",
    "search/backgroundsearch/": "Background search",
    "search/monstersearch/":    "Monster search",
    "search/itemsearch/":       "Item search with info",
    "search/spellsearch/":      "Spell search with info"
};

function populateItemList() {
    for (const link in items) {
        const html = `
        <a href="${link}">
            <div class="link">${items[link]}</div>
        </a>
        `;
        itemList.insertAdjacentHTML("beforeend", html);
    }
}

populateItemList();