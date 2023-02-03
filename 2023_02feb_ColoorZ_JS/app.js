// Variables
const colorDivs = document.querySelectorAll('.color');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const generateButton = document.querySelector('.generate');
const adjustButton = document.querySelectorAll('.adjust');
const lockButton = document.querySelectorAll('.lock');
const closeAdjustments = document.querySelectorAll('.close-adjustment');
const sliderContainers = document.querySelectorAll('.sliders');
let initialColors;

// Local storage
let savedPalettes = [];

// EventListeners
generateButton.addEventListener("click", () => {
    randomColors();
});
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls);
});
colorDivs.forEach((div,index) => {
   div.addEventListener('change', () => {
       updateText(index);
   })
});
currentHexes.forEach(hex => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    });
});
popup.addEventListener('transitionend', () => {
    const popupBox = popup.children[0];
    popup.classList.remove('active');
    popupBox.classList.remove('active');
});
lockButton.forEach((button,index) => {
    button.addEventListener('click', () => {
        const div = colorDivs[index];
        div.classList.toggle('locked');
        if (div.classList.contains('locked')) {
            console.log(button.children[0]);
            button.innerHTML = '<i class="fa-solid fa-lock"></i>'
        } else {
            button.innerHTML = '<i class="fa-solid fa-lock-open"></i>'
        }
    });
});
adjustButton.forEach((button,index) => {
    button.addEventListener('click', () => {
        openAdjustmentPanel(index);
    });
});
closeAdjustments.forEach((button,index) => {
    button.addEventListener('click', () => {
        closeAdjustmentPanel(index);
    });
});

// Fonctions
// Set a new set of colors
function randomColors(){
    initialColors = [];
    colorDivs.forEach((div,index) =>{
        const hexText = div.children[0];
        const randomColor = chroma.random();

        if (div.classList.contains('locked')) {
            initialColors.push(hexText);
            return;
        } else {
            initialColors.push(chroma(randomColor).hex());
        }

        // Set the style from generated color
        const icons = div.querySelectorAll('.controls button');
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;
        for (icon of icons) {
            checkTextContrast(randomColor, icon);
        }

        // Check luminance for text color
        checkTextContrast(randomColor, hexText);

        // Initialize color parameters
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input");
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color, hue, brightness, saturation);
    });
    resetInputs();
}


function colorizeSliders(color, hue, brightness, saturation) {
    // Scale Saturation
    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat,color, fullSat]);
    saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(0)},${scaleSat(1)})`

    // Scale Brightness
    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(["black", midBright, "white"]);
    brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(0)},${scaleBright(0.5)},${scaleBright(1)})`

    // Scale Hue
    //hue.style.backgroundImage = `linear-gradient(to right,rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
    hue.style.backgroundImage = `linear-gradient(to right,rgb(234,75,75),rgb(234,234,75),rgb(75,234,75),rgb(75,234,234),rgb(75,75,234),rgb(234,75,234),rgb(234,75,75))`;

}

// Check the contrast and adjust the text color
function checkTextContrast(color, text){
    const luminance = chroma(color).luminance();
    if (luminance > 0.5){
        text.style.color = '#0F0F0F'
    } else {
        text.style.color = '#FFFFFF'
    }
}

function hslControls(e) {
    const index =
        e.target.getAttribute('data-bright') ||
        e.target.getAttribute('data-sat') ||
        e.target.getAttribute('data-hue');

    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    const bgColor = initialColors[index];

    let color = chroma(bgColor)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value)
        .set('hsl.h', hue.value);

    // Change background and inputs color
    colorDivs[index].style.backgroundColor = color;
    colorizeSliders(color, hue, brightness, saturation);
}

function updateText(index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll('.controls button');
    textHex.innerText = color.hex();
    checkTextContrast(color, textHex);
    for (icon of icons) {
        checkTextContrast(color, icon);
    }
}

function resetInputs() {
    const sliders = document.querySelectorAll('.sliders input');
    sliders.forEach(slider => {
        if (slider.name === 'hue') {
            const hueColor = initialColors[slider.getAttribute('data-hue')];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if (slider.name === 'brightness') {
            const brightColor = initialColors[slider.getAttribute('data-bright')];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;
        }
        if (slider.name === 'saturation') {
            const satColor = initialColors[slider.getAttribute('data-sat')];
            const satValue = chroma(satColor).hsl()[1];
            slider.value = Math.floor(satValue * 100) / 100;
        }
    });
}

function copyToClipboard(hex) {
    // Put value in clipboard using textarea
    const copyArea = document.createElement('textarea');
    copyArea.value = hex.innerText;
    document.body.appendChild(copyArea);
    copyArea.select();
    document.execCommand('copy');
    document.body.removeChild(copyArea);

    // Show popup
    const popupBox = popup.children[0];
    popup.classList.add("active");
    popupBox.classList.add("active");
}

function openAdjustmentPanel(index) {
    sliderContainers[index].classList.toggle('active');
}
function closeAdjustmentPanel(index) {
    sliderContainers[index].classList.remove('active');
}

// Save palette and local storage
const saveBtn = document.querySelector('.save');
const submitSave = document.querySelector('.submit-save');
const closeSave = document.querySelector('.close-save');
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-container input');
const libraryContainer = document.querySelector('.library-container');
const libraryBtn = document.querySelector('.library');
const closeLibraryBtn = document.querySelector('.close-library');

// Event Listeners
saveBtn.addEventListener('click', openPalette);
closeSave.addEventListener('click', closePalette);
submitSave.addEventListener('click', savePalette);
libraryBtn.addEventListener('click', openLibrary);
closeLibraryBtn.addEventListener('click', closeLibrary);

function openPalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.add('active');
    popup.classList.add('active');
}
function closePalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove('active');
    popup.classList.remove('active');
}
function savePalette(e) {
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
    const name = saveInput.value;
    const colors = [];
    currentHexes.forEach(hex => {
       colors.push(hex.innerText);
    });

    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    let paletteNr = savedPalettes.length;
    if (paletteObjects) {
        paletteNr = paletteObjects.length;
    }


    const paletteObj = {name, colors, nr: paletteNr}
    savedPalettes.push(paletteObj);
    saveToLocal(paletteObj);
    saveInput.value = '';

    // Create elements for the library
    createLibraryPalette(paletteObj, savedPalettes);
}
function saveToLocal(paletteObj) {
    let localPalettes;
    if (localStorage.getItem('palettes') === null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem('palettes', JSON.stringify(localPalettes));
}
function openLibrary(e) {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add('active');
    popup.classList.add('active');
}
function closeLibrary(e) {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove('active');
    popup.classList.remove('active');
}
function getLocal() {
    if (localStorage.getItem('palettes') === null) {
        localPalettes = [];
    } else {
        const paletteObjects = JSON.parse(localStorage.getItem('palettes'));
        savedPalettes = [...paletteObjects];
        paletteObjects.forEach(paletteObj => {
            createLibraryPalette(paletteObj, paletteObjects);
        });
    }
}
function createLibraryPalette(paletteObj, paletteObjects) {
    const palette = document.createElement('div');
    palette.classList.add('custom-palette');
    const title = document.createElement('h4');
    title.innerText = paletteObj.name;
    const preview = document.createElement('div');
    preview.classList.add('small-preview');
    paletteObj.colors.forEach(smallColor => {
        const smallDiv = document.createElement('div');
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
    })

    // Creating select button
    const paletteBtn = document.createElement('button');
    paletteBtn.classList.add('pick-palette-btn');
    paletteBtn.classList.add(paletteObj.nr);
    const selectIcon = document.createElement('i');
    selectIcon.classList.add('fa-solid');
    selectIcon.classList.add('fa-check');
    paletteBtn.appendChild(selectIcon);

    // Attach event to the "Sélectionner" button
    paletteBtn.addEventListener('click', e => {
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        paletteObjects[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color);
            colorDivs[index].style.backgroundColor = color;
            const text = colorDivs[index].children[0];
            checkTextContrast(color, text);
            updateText(index);
        });
        resetInputs();
    });

    // Append to library
    palette.appendChild(preview);
    palette.appendChild(title);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
}
getLocal();
randomColors();

//localStorage.clear();