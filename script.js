let lastChoicesDiv = null;
let group = 1;

function createAndPositionContainer(value) {
    // if (lastChoicesDiv) {
    //     lastChoicesDiv.remove();
    // }

    // Create the container div
    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
    container.style.top = `${Math.random() * (window.innerHeight - 100) - 155}px`;

    // Create the choices div
    let choicesDiv = document.createElement('div');
    choicesDiv.className = 'choices';

    let img = document.createElement('img');
    img.src = 'cherry-petal.gif' + '?id=' + Math.floor(Math.random() * 10);;
    img.alt = 'animation of a falling rose petal';
    img.classList.add("flower");
    container.appendChild(img);

    if (value == 'loves-me') {
        let r = Math.random();

        if (r < 0.5) {
            let label2 = createRadioButton('he loves me not', 'loves-me-not');
            choicesDiv.appendChild(label2);
        } else if (r < 0.75 ) {
            let label3 = createRadioButton('yesterday', 'day');
            let label4 = createRadioButton('today', 'day');
            let label5 = createRadioButton('tomorrow', 'day');
            choicesDiv.appendChild(label3);
            choicesDiv.appendChild(label4);
            choicesDiv.appendChild(label5);
        } else if (r < 0.9) {
            let label6 = createRadioButton('he loves me a lot', 'loves-me');
            let label7 = createRadioButton('he loves me a little', 'loves-me');
            choicesDiv.appendChild(label6);
            choicesDiv.appendChild(label7);
        } else {
            let label8 = createRadioButton('he loves me as I love him', 'loves-me');
            choicesDiv.appendChild(label8);
        }
    } else if (value == 'loves-me-not') {
        let r = Math.random();
        if (r < 0.5) {
            let label10 = createRadioButton('he loves me maybe', 'loves-me-not');
            choicesDiv.appendChild(label10);
        } else {
            let label1 = createRadioButton('he loves me', 'loves-me');
            choicesDiv.appendChild(label1);
        }
    } else {
        let label1 = createRadioButton('he loves me', 'loves-me');
        choicesDiv.appendChild(label1);
    }

    container.appendChild(choicesDiv);

    img.onload = function() {
        document.body.appendChild(container);
    };

    lastChoicesDiv = choicesDiv;
    group += 1;
}

function createRadioButton(labelText, value) {
    let label = document.createElement('label');
    label.className = 'choice';
    let input = document.createElement('input');
    input.type = 'radio';
    input.name = `loves-${group}`;
    input.value = value;
    let span = document.createElement('span');
    span.textContent = labelText;
    label.appendChild(input);
    label.appendChild(span);
    input.addEventListener('change', handleRadioButtonChange);
    return label;
}

// Extracted radio button change logic into a separate function for reuse
function handleRadioButtonChange() {
    createAndPositionContainer(this.value);
}

// Modify the original event listener setup to use the new handler function
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[name="loves"]').forEach(function(btn) {
        btn.addEventListener('change', handleRadioButtonChange);
    });
});



document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        document.querySelectorAll('input[type="radio"]').forEach(function(btn) {
            btn.removeEventListener('change', handleRadioButtonChange);
        });

        // Fade background to black
        document.body.style.backgroundColor = 'black';
        document.body.style.transition = 'background-color 5s';

        // Change radio buttons and text color based on selection
        document.querySelectorAll('.choice input').forEach(function(input) {
            if (input.checked) {
                input.nextElementSibling.style.color = 'white'; // Change text color to white for selected
                input.nextElementSibling.style.fontStyle = 'italic';
            } else {
                input.nextElementSibling.style.color = 'black'; // Change text color to black for unselected
            }
            input.style.opacity = '0';
            input.style.transition = 'opacity 5s';
            input.nextElementSibling.style.transition = 'color 5s, font-style 5s';
        });

        fadeInAudio('Minstrel_Dance(chosic.com).mp3');
    }, 50000); // 50 seconds
});


function fadeInAudio(audioSrc) {
    let audio = new Audio(audioSrc); // Create an audio element with your MP3 file
    audio.volume = 0; // Start with the volume at 0
    audio.play(); // Start playing the audio

    let fadeTime = 3000; // Duration of the fade in milliseconds
    let step = 0.01; // Volume increase step
    let interval = fadeTime * step; // Calculate interval time

    let fadeAudioInterval = setInterval(function() {
        if (audio.volume < 1) {
            audio.volume += step; // Increase the volume by the step amount
            if (audio.volume > 0.5) audio.volume = 0.5; // Ensure the volume does not exceed 1
        } else {
            clearInterval(fadeAudioInterval); // Clear the interval once volume is 1
        }
    }, interval);
}