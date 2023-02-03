// Variables
const colorDivs = document.querySelectorAll('.color');
const generateButton = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;

// EventListeners
sliders.forEach(slider => {
    slider.addEventListener("input", hslControls)
});
colorDivs.forEach((div,index) => {
   div.addEventListener('change', () => {
       updateText(index);
   })
});


// Fonctions
// Set a new set of colors
function randomColors(){
    initialColors = [];
    colorDivs.forEach((div,index) =>{
        const hexText = div.children[0];
        const randomColor = chroma.random();
        initialColors.push(chroma(randomColor).hex());

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
        text.style.color = '#000000'
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
    colorDivs[index].style.backgroundColor = color;
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
randomColors();