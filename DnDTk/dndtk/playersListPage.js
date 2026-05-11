function updatePlayerIcons() {
    const playersContainer = document.getElementById("playersContainer");
    // Remove old icons
    for (const child of [...playersContainer.children]) {
        if (child.id === "newPlayerButton") continue;
        child.remove();
    }
    // Add new icons
    for (const [uuid, data] of Object.entries(characters)) {
        //console.log(data);
        const buttonEl = document.createElement("button");
        buttonEl.classList.add("playerButton");
        //buttonEl.dataset.uuid = uuid;
        buttonEl.addEventListener("click", () => {
            loadPlayerCreatorPage(uuid)
        });

        const imageEl = document.createElement("img");
        imageEl.src = imagesPath + data.data.character["character-icon"];

        const nameEl = document.createElement("p");
        nameEl.textContent = capitalizeAll(data.data.character["character-charactername"]);

        buttonEl.appendChild(imageEl);
        buttonEl.appendChild(nameEl);
        playersContainer.appendChild(buttonEl);
    }
}