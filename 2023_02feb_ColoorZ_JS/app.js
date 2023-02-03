// Variables
const colorDivs = document.querySelectorAll('.color');
const generateButton = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColor;

// Fonctions
function randomColors(){
    colorDivs.forEach((div,index) =>{
        const hexText = div.children[0];
        const randomColor = chroma.random();

        // Set the style from generated color
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;

        // Check luminance for text color
        checkTextContrast(randomColor, hexText);
    });
}

function checkTextContrast(color, text){
    const luminance = chroma(color).luminance();
    if (luminance > 0.5){
        text.style.color = '#000000'
    } else {
        text.style.color = '#FFFFFF'
    }
}

randomColors();