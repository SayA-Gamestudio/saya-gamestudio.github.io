const playersListPage = document.getElementById("playersListPage");
const playerCreatorPage = document.getElementById("playerCreatorPage");
const battlePage = document.getElementById("battlePage");
const errorPage = document.getElementById("errorPage");

const imagesPath = "assets/images/characters/"

let currentPage;
let previousPage;

const fields = document.querySelectorAll(".fields");

const characters = {};

const pageTitles = {
    playersListPage: "Create Players",
    playerCreatorPage: "Create New Player",
    battlePage: "Battle",
    errorPage: "An Error Occurred",
};

function switchToPage(pageId) {
    previousPage = currentPage;
    currentPage = pageId;
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    document.getElementById("pageTitle").textContent = pageTitles[pageId] ?? "";
    checkScroll();
}

function checkScroll() {
    document.querySelectorAll(".fields").forEach(f => {
        f.classList.toggle("scrollable", f.scrollHeight > f.clientHeight);
    });
}

async function save() {
    await savePlayerCreatorPage(editingUuid ?? "");
    updatePlayerIcons();
}

function openNewPlayer() {
    editingUuid = newuuid();
    clearPlayerCreatorPage();
    switchToPage("playerCreatorPage");
}

function readFileAsJSON() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return reject(new Error('No file selected'));

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    resolve(json);
                } catch (err) {
                    reject(new Error('Invalid JSON: ' + err.message));
                }
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsText(file, 'UTF-8');
        };

        input.click();
    });
}

async function exportCharacter() {
    await save();
    const character = characters[editingUuid];
    //console.log(editingUuid, characters);
    downloadCharacter(character, character.data.character["character-charactername"]);
}

async function importCharacter() {
    const data = await readFileAsJSON();
    characters[data.uuid] = { uuid: data.uuid, data: data.data };
    loadPlayerCreatorPage(data.uuid);
}

function checkTextareas() {
    const areas = document.querySelectorAll("textarea");
    for (const textarea of areas) {
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        });
    }
}

function connectSaveButtons() {
    const buttons = document.querySelectorAll(".saveButton");
    for (const btn of buttons) {
        btn.addEventListener("click", () => {
            save();
            clearPlayerCreatorPage();
            switchToPage(previousPage);
        });
    }
}

function connectImportExportButtons() {
    const exportButtons = document.querySelectorAll(".exportButton");
    const importButtons = document.querySelectorAll(".importButton");
    for (const btn of exportButtons) {
        btn.addEventListener("click", () => {
            exportCharacter();
        });
    }
    for (const btn of importButtons) {
        btn.addEventListener("click", () => {
            importCharacter();
        });
    }
}

function addEventListeners() {
    //checkTextareas();
    connectSaveButtons();
    connectImportExportButtons();
    document.getElementById("newPlayerButton").addEventListener("click", () => openNewPlayer());
}

async function init() {
    switchToPage('playersListPage');
    addEventListeners();
    setupAutocomplete(document.querySelector("[data-id='character-class']"), classOptions);
    setupAutocomplete(document.querySelector("[data-id='character-race']"), raceOptions);
    await populateImageSelect();
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        init();
    } catch (e) {
        switchToPage("errorPage");
    }
});