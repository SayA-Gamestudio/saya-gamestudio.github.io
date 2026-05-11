function toBase64(file) {
    return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
    });
}

function downloadCharacter(character, filename) {
    //console.log("Downloading");
    const jsonstring = JSON.stringify(character);
    const blob = new Blob([jsonstring], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `${character.name || 'character'}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url) , 100);
}

function capitalize(str) {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
}

function capitalizeAll(str) {
    if (!str) return "";
    return str.split(" ").map(capitalize).join(" ");
}

function newuuid() {
    return crypto.randomUUID();
}