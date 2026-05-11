const fieldsContainer = document.getElementById("playerCreatorPageFieldsContainer");
const classOptions = ["Barbarian", "Bard", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"];
const raceOptions = [ "Dragonborn", "Hill Dwarf", "Mountain Dwarf", "High Elf", "Wood Elf", "Dark Elf (Drow)", "Forest Gnome", "Rock Gnome", "Half-Elf", "Half-Orc", "Lightfoot Halfling", "Stout Halfling", "Human", "Tiefling"];

let imageOptions = [];
let editingUuid = null;

function setupAutocomplete(input, options) {
    const dropdown = input.parentElement.querySelector(".autocomplete-dropdown");

    input.addEventListener("input", () => {
        const val = input.value.toLowerCase();
        const matches = options.filter(o => o.toLowerCase().includes(val));
        dropdown.innerHTML = "";
        if (!val || matches.length === 0) {
            dropdown.style.display = "none";
            return;
        }
        matches.forEach(match => {
            const item = document.createElement("div");
            item.textContent = match;
            item.addEventListener("mousedown", () => {
                input.value = match;
                dropdown.style.display = "none";
            });
            dropdown.appendChild(item);
        });
        dropdown.style.display = "block";
    });

    input.addEventListener("blur", () => {
        dropdown.style.display = "none";
    });
}

function loadPlayerCreatorPage(uuid) {
    switchToPage("playerCreatorPage");
    editingUuid = uuid;
    const data = characters[uuid].data;
    for (const fields of fieldsContainer.children) {
        const fieldType = fields.dataset.type;
        if (!fieldType) continue;
        for (const input of fields.querySelectorAll("[data-id]")) {
            if (input instanceof HTMLSelectElement) {
                input.value = imagesPath + data[fieldType][input.dataset.id] ?? "";
                continue;
            }
            input.value = data[fieldType][input.dataset.id] ?? "";
        }
    }
    loadImage(uuid);
}

function loadImage(uuid) {
    document.getElementById("selected-image").innerHTML = `<img src="${imagesPath}${characters[uuid].data.character["character-icon"]}">`;
}

function clearPlayerCreatorPage() {
    for (const fields of fieldsContainer.children) {
        for (const input of fields.querySelectorAll("[data-id]")) {
            if (input.type === "file") {
                input.value = null;
            } else {
                input.value = "";
            }
        }
    }
}

async function savePlayerCreatorPage(uuid="") {
    const data = characters[uuid]?.data ?? {};
    for (const fields of fieldsContainer.children) {
        const fieldType = fields.dataset.type;
        if (!fieldType) continue;
        data[fieldType] = {};
        for (const input of fields.querySelectorAll("[data-id]")) {
            data[fieldType][input.dataset.id] = input.value;
        }
    }
    characters[uuid] = { uuid, data }; // Reference by character name
    //console.log(characters);
}

async function loadImageOptions() {
    const res = await fetch(`${imagesPath}paths.json`);
    const json = await res.json();
    return json.paths.map(name => `${imagesPath}${name}`);
}

async function populateImageSelect() {
    const imageOptions = await loadImageOptions();
    const wrapper = document.querySelector(".images-dropdown");
    const hidden = wrapper.querySelector("input");
    const selected = wrapper.querySelector(".image-selected");
    const dropdown = wrapper.querySelector(".dropdown-content");

    selected.addEventListener("click", () => {
        dropdown.style.display = dropdown.style.display === "grid" ? "none" : "grid";
    });

    for (const path of imageOptions) {
        const item = document.createElement("button");
        item.classList.add("image-item");
        item.innerHTML = `<img src="${path}"><span>${path.split("/").pop().replace(/\.[^.]+$/, "")}</span>`;
        item.addEventListener("click", () => {
            hidden.value = path.split("/").pop();
            selected.innerHTML = `<img src="${path}">`;
            dropdown.style.display = "none";
        });
        dropdown.appendChild(item);
    }
}
/*
async function populateImageSelect() {
    const imageOptions = await loadImageOptions();
    const select = document.querySelector("[data-id='character-icon']");
    for (const path of imageOptions) {
        const option = document.createElement("option");
        option.value = path;
        option.textContent = path.split("/").pop().replace(/\.[^.]+$/, "");
        select.appendChild(option);
    }
}
*/