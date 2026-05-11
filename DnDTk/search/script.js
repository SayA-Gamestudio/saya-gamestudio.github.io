let items = [];
let fields = [];

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

async function loadData(file) {
    try {
        const res = await fetch(`${file}.formatted.json`);
        const data = await res.json();
        items = data || [];
    } catch (e) {
        items = [];
        console.warn(`Could not load ${file}.json:`, e);
    }
    init();
}

function init() {
    document.getElementById("searchInput").addEventListener("input", (e) => {
        search(e.target.value);
    });
}

function fuzzyMatch(str, pattern) {
    str = str.toLowerCase();
    pattern = pattern.toLowerCase();
    let si = 0, pi = 0, score = 0;
    while (si < str.length && pi < pattern.length) {
        if (str[si] === pattern[pi]) { score++; pi++; }
        si++;
    }
    return pi === pattern.length ? score / str.length : -1;
}

function search(query) {
    const list = document.getElementById("results");
    if (!query) { list.innerHTML = ""; return; }

    const results = items
        .map(item => ({ item, score: fuzzyMatch(item.name, query) }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score);

    list.innerHTML = results
        .map(({ item }) => `
            <li>
                <button onclick="openPopup('${item.name}')">
                    ${item.name}
                </button>
            </li>
        `)
        .join("");
}

function openPopup(itemName) {
    const item = items.find(s => s.name === itemName);
    let text = "";
    for (const field of fields) {
        text += field + ":\n";
        text += item[field] ?? "";
        text += "\n\n";
    }
    document.getElementById("popupText").textContent = text;
    document.getElementById("overlay").classList.add("active");
}

function closePopup() {
    document.getElementById("overlay").classList.remove("active");
}

// Close if clicking outside the popup
document.getElementById("overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closePopup();
});

async function load(file, fieldsData) {
    await loadData(file);
    fields = fieldsData;
}

// Always call loadData(fileType)