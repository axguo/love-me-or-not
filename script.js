let lastChoicesDiv = null;
let group = 1;
let currentStage = 'start';

const decisionTree = {
    "start": {
        interactionType: 'radio',
        options: {
            "he loves me": {
                next: {
                    "start2": 0.6,
                    "loves-me-options": 0.4
                }
            },
            "he loves me not": {
                next: {
                    "start": 0.6,
                    "loves-me-not-options": 0.4
                }
            },
        }
    },
    "start2": {
        interactionType: 'radio',
        options: {
            "he loves me not": {
                next: {
                    "start": 0.5,
                    "loves-me-not-options": 0.5
                }
            },
            "he loves me": {
                next: {
                    "start2": 0.6,
                    "loves-me-options": 0.2,
                    "loves-me-options-2": 0.2
                }
            },
        }
    },
    "start3": {
        interactionType: 'radio',
        options: {
            "he loves me": {
                next: {
                    "start3": 0.6,
                    "loves-me-options": 0.2,
                    "loves-me-options-not": 0.2
                }
            },
            "he loves me": {
                next: {
                    "start3": 0.3,
                    "loves-me-options-2": 0.3,
                    "loves-me-options": 0.4
                }
            },
        }
    },
    "loves me days": {
        interactionType: 'radio',
        options: {
            "he loves me": {
                next: {
                    "start": 0.2,
                    "days": 0.8
                }
            },
            "he loves me not": {
                next: {
                    "days": 1
                }
            },
        }
    },
    "days": {
        interactionType: 'radio',
        options: {
            "yesterday": { next: { "yesterday": 1 } },
            "today": { next: { "today": 1 } },
            "tomorrow": { next: { "tomorrow": 1 } },
        },
    },
    "yesterday": {
        interactionType: 'radio',
        options: {
            "he called": { next: { "avocado": 1 } },
            "he danced": { next: { "danced": 1 } },
            "he texted": { next: { "texted": 1 } },
        },
    },
    "danced": {
        interactionType: 'radio',
        options: {
            "and danced": { next: { "remember": 1 } },
            "and danced": { next: { "remember": 1 } },
            "and danced": { next: { "remember": 1 } },
        },
    },
    "texted": {
        interactionType: 'checkbox',
        prompt: "what if we",
        options: ["took the long way home?", "traded our bones?", "danced and danced and danced?", "pretended this was temporary?"],
        next: { "mend": 0.5, "loves me days": 0.5 },
        submitOption: "i'd love that"
    },
    "today": {
        interactionType: 'radio',
        options: {
            "i'm an unreliable narrator": { next: { "remember": 1 } },
            "the sky is my friend": { next: { "sky": 1 } },
            "there is a different moon for me and you": { next: { "moon": 1 } },
        },
    },
    "sky": {
        interactionType: 'dropdown',
        defaultOption: "are we looking at the same sky?",
        options: {
            "☁️ ☁️ ☁️": { next: { "remember": 1 } },
            "☀️ ☁️ ☁️": { next: { "remember": 1 } },
            "🌧️ ⛈️ 🌧️": { next: { "remember": 1 } },
            "🌦️ ⛈️ 🌈": { next: { "remember": 1 } },
        },
    },
    "moon": {
        interactionType: 'radio',
        options: {
            "🌌 🌌 🌖": { next: { "remember": 1 } },
            "🌒 🌌 🌌": { next: { "remember": 1 } },
        },
    },
    "tomorrow": {
        interactionType: 'checkbox',
        prompt: "the tarot cards said",
        options: ["to think about the story", "what do we want to leave behind?", "to rest", "to rest", "to rest", "to rest"],
        next: { "avocado": 1 },
        submitOption: "will you listen?"
    },
    "avocado": {
        interactionType: 'checkbox',
        prompt: "he called me while",
        options: ["sitting on the ground", "a needle in hand", "avocado sock in the other"],
        next: { "someone loved": 1 },
        submitOption: "why don't you buy another"
    },
    "someone loved": {
        interactionType: 'checkbox',
        prompt: "someone loved enough",
        options: ["to wear out the pit", "to learn how to sew"],
        submitOption: "he did",
        next: { "mend": 1 }
    },
    "mend": {
        interactionType: 'dropdown',
        defaultOption: "he later texts me",
        options: {
            "I guess in some ways": { next: { "loves me days": 1 } },
            "maintenance is like mending": { next: { "loves me days": 1 } },
        },
    },
    "loves-me-options": {
        interactionType: 'checkbox',
        options: ["sometimes", "maybe", "all the time", "tuesdays", "the most",],
        next: { "much": 0.5, "remember": 0.5 },
        submitOption: "i know"
    },
    "loves-me-options-2": {
        interactionType: 'checkbox',
        options: ["enough to try poetry", "and cooking", "and remembering"],
        next: { "roles": 0.5, "remember": 0.5 },
        submitOption: "i know"
    },
    "much": {
        interactionType: 'slider',
        options: { prompt: "this much" },
        next: { "remember": 1 },
        submitButton: "i'm sure of it"
    },
    "remember": {
        interactionType: 'dropdown',
        defaultOption: "i remember when",
        options: {
            "he bought me flowers": { next: { "forever-him": 1 } },
            "i made him flowers": { next: { "made of": 1 } },
            "i planted flowers": { next: { "planted": 0.5 } },
        },
    },
    "remember-2": {
        interactionType: 'dropdown',
        defaultOption: "remember when",
        options: {
            "he bought me flowers": { next: { "forever-him": 1 } },
            "i made him flowers": { next: { "made of": 1 } },
            "i planted flowers": { next: { "planted": 0.5 } },
        },
    },
    "planted": {
        interactionType: 'checkbox',
        prompt: "a gift for you",
        options: ["🌹 🌷 🌹 🌷 🌹 🌷", "🌷 🌷 🌷 🌷 🌷 🌷", "🌼 🌻 🌼 🌻 🌼 🌻", "🌻 🌻 🌻 🌻 🌻 🌻", "🌸 🌸 🌸 🌸 🌸 🌸", "💐 💐 💐 💐 💐 💐", "🌱 🌱 🌱 🌱 🌱 🌱"],
        next: { "loves me days": 0.7, "secret-2": 0.3 },
        submitOption: "take care of them please"
    },
    "made of": {
        interactionType: 'dropdown',
        defaultOption: "fashioned from",
        options: {
            "paper": { next: { "forever": 1 } },
            "clay": { next: { "forever": 1 } },
            "buttons": { next: { "forever": 1 } },
            "code": { next: { "forever": 1 } },
        },
        next: "loves me days"
    },
    "forever": {
        interactionType: 'slider',
        options: { prompt: "they'll last" },
        next: { "loves me days": 1 },
        submitButton: "this long"
    },
    "forever-him": {
        interactionType: 'slider',
        options: { prompt: "they'll last" },
        next: { "flower type": 1 },
        submitButton: "this long"
    },
    "flower type": {
        interactionType: 'checkbox',
        options: ["roses", "baby's breath", "sunflowers", "daisies"],
        next: { "roles": 1 },
        submitOption: "an apology"
    },
    "roles": {
        interactionType: 'dropdown',
        defaultOption: "I have many roles",
        options: {
            "mender and mended": { next: { "avocado": 1 } },
            "a memory for you": { next: { "remember": 1 } },
            "maintainer": { next: { "planted": 1 } },
            "editor of apologies": { next: { "apologies": 1 } },
        },
        next: "start"
    },
    "apologies": {
        interactionType: 'checkbox',
        prompt: "don't forget",
        options: ["to say I'm sorry", "to say I love you", "to forgive", "to remember"],
        next: { "remember": 1 },
        submitOption: "I won't forget"
    },
    "loves-me-not-options": {
        interactionType: 'dropdown',
        defaultOption: "does he?",
        options: {
            "maybe": { next: { "loves-me-not-options": 0.5, "apologies": 0.5 } },
            "maybe not": { next: { "loves-me-not-options": 0.5, "sky": 0.5 } },
        },
        next: "start"
    },
    "secret-1": {
        interactionType: 'radio',
        prompt: 'can i tell you a secret?',
        options: {
            "whisper yes": { next: { "i love you": 1 } },
            "whisper no": { next: { "remember": 1 } },
        },
    },
    "secret-2": {
        interactionType: 'radio',
        prompt: 'can you tell me a secret?',
        options: {
            "maybe": { next: { "remember-2": 1 } },
            "i'll do the same": { next: { "secret-1": 1 } },
        },
    },
    "i love you": {
        interactionType: 'checkbox',
        prompt: "I will always",
        options: ["know", "convict", "witness", "love"],
        next: { "end": 1 },
        submitOption: "you"
    },
};


function chooseNextStage(optionsWithProbabilities) {
    const total = Object.values(optionsWithProbabilities).reduce((acc, probability) => acc + probability, 0);
    let random = Math.random() * total;
    for (const [stage, probability] of Object.entries(optionsWithProbabilities)) {
        if ((random -= probability) < 0) {
            return stage;
        }
    }
}

function createAndPositionContainer(value) {
    // Lower opacity for existing choices
    document.querySelectorAll('.choices').forEach(choicesDiv => {
        choicesDiv.style.opacity = '0.15';
    });

    // Exclude GIFs from opacity change
    document.querySelectorAll('.choices img').forEach(img => {
        img.style.opacity = '1'; 
    });

    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = `${Math.random() * (window.innerWidth - 200)}px`;
    container.style.top = `${Math.random() * (window.innerHeight - 100) - 155}px`;

    let choicesDiv = document.createElement('div');
    choicesDiv.className = 'choices';

    let img = document.createElement('img');
    img.src = 'cherry-petal.gif' + '?id=' + Math.floor(Math.random() * 50);
    img.alt = 'animation of a falling rose petal';
    img.classList.add("flower");
    container.appendChild(img);


    let nextStage;
    if (value) {
        nextStage = chooseNextStage(decisionTree[currentStage].options[value].next);
    } else {
        nextStage = chooseNextStage(decisionTree[currentStage].next);
    }
    if (nextStage === "end") {
        triggerEndEffects();
    }
    options = decisionTree[nextStage].options;
    interactionType = decisionTree[nextStage].interactionType || 'radio'; // Default to radio
    currentStage = nextStage;


    switch (interactionType) {
        case 'checkbox':
            createCheckboxes(options, choicesDiv, decisionTree[nextStage].submitOption, decisionTree[nextStage].prompt || '');
            break;
        case 'dropdown':
            createDropdown(options, choicesDiv, decisionTree[nextStage].defaultOption);
            break;
        case 'slider':
            createSlider(options, choicesDiv);
            break;
        default: 
            createRadioButtons(options, choicesDiv, decisionTree[nextStage].prompt || '');
    }

    container.appendChild(choicesDiv);

    img.onload = function () {
        document.body.appendChild(container);
    };

    lastChoicesDiv = choicesDiv;
    group += 1;

    addSparkle();
}

function addSparkle() {
    let sparkleDiv = document.createElement('div');
    let sparkleImg = document.createElement('img');
    sparkleImg.classList.add('sparkle');
    sparkleImg.src = `sparkle${Math.floor(Math.random() * 2) + 1}.gif` + '?id=' + Math.floor(Math.random() * 50);
    sparkleImg.alt = 'sparkling effect';
    sparkleDiv.appendChild(sparkleImg);
    sparkleDiv.style.position = 'absolute';
    sparkleDiv.style.top = Math.floor(Math.random() * 100) + '%';
    sparkleDiv.style.left = Math.floor(Math.random() * 100) + '%';
    document.body.appendChild(sparkleDiv);
}

function createCheckboxes(options, container, submitContent, promptText) {
    // Create and append the prompt
    let promptDiv = document.createElement('div');
    promptDiv.className = "prompt";
    promptDiv.textContent = promptText;
    container.appendChild(promptDiv);

    options.forEach(optionValue => {
        let choiceDiv = document.createElement('div');
        choiceDiv.className = 'choice';

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = optionValue;
        checkbox.name = `loves-${group}`;
        checkbox.value = optionValue;

        let label = document.createElement('label');
        label.htmlFor = optionValue;
        label.textContent = optionValue;

        choiceDiv.appendChild(checkbox);
        choiceDiv.appendChild(label);

        container.appendChild(choiceDiv);
    });

    // Create and append the submit button
    let submitButton = document.createElement('button');
    submitButton.textContent = submitContent;
    submitButton.addEventListener('click', handleSubmitButtonClick);
    container.appendChild(submitButton);
}

function createDropdown(options, container, firstOption) {
    let select = document.createElement('select');
    select.name = `loves-${group}`;
    select.addEventListener('change', handleDropdownChange);

    // Default option
    let defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = firstOption;
    select.appendChild(defaultOption);

    Object.keys(options).forEach(optionValue => {
        let option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        select.appendChild(option);
    });

    container.appendChild(select);
}

function createSlider(options, container) {
    let prompt = document.createElement('div');
    prompt.classList.add("prompt");
    prompt.textContent = options.prompt || "maybe"; 
    container.appendChild(prompt);

    let slider = document.createElement('input');
    slider.type = 'range';
    slider.name = `loves-${group}`;
    slider.min = "0"; // Example min value
    slider.max = "10"; // Example max value
    slider.value = "0"; // Default value

    container.appendChild(slider);
    const submitButtonText = decisionTree[currentStage].submitButton || "maybe";
    createSubmitButton(submitButtonText, container);
}

function createRadioButtons(options, container, promptText) {
    let promptDiv = document.createElement('div');
    promptDiv.className = "prompt";
    promptDiv.textContent = promptText;
    container.appendChild(promptDiv);
    for (let optionValue in options) {
        let option = options[optionValue];
        let label = createRadioButton(optionValue, optionValue);
        container.appendChild(label);
    }
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


function handleRadioButtonChange() {
    let value = this.value;
    createAndPositionContainer(value); 
}


function handleDropdownChange() {
    let selectedOption = this.value; 
    if (selectedOption) {
        createAndPositionContainer(selectedOption);
    }
}

function areAllCheckboxesChecked() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    return Array.from(checkboxes).every(checkbox => checkbox.checked);
}

function isDropdownSelected(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    return dropdown.value !== ""; // Assuming the default value is an empty string
}

function isSliderAdjusted(sliderId) {
    const slider = document.getElementById(sliderId);
    return slider.value !== slider.defaultValue; // Check if the value is different from the default
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[name="loves"]').forEach(function (btn) {
        btn.addEventListener('change', function () {
            createAndPositionContainer(this.value); 
        });
    });
});

function triggerEndEffects() {
    document.body.style.backgroundColor = 'black';
    document.body.style.transition = 'background-color 10s';
    document.querySelectorAll('.choices').forEach(function (choice) {
        choice.style.opacity = '0'; // Set initial opacity to 0
        choice.style.transition = 'opacity 5s'; // Set transition to change opacity over 5 seconds
        setTimeout(function () {
            choice.style.opacity = '1'; // Change opacity to 1 after a delay to ensure transition occurs
        }, 10); // Small delay to ensure the transition property is applied before changing opacity
    });

    document.querySelectorAll('button, .background, .prompt').forEach(function (btn) {
        btn.style.opacity = '1';
        btn.style.color = 'transparent';
        btn.style.transition = 'opacity 5s';
        setTimeout(function () {
            btn.style.opacity = '0'; // Change opacity to 1 after a delay to ensure transition occurs
        }, 10);
    });

    document.querySelectorAll('select').forEach(function (dropdown) {
        dropdown.style.color = 'white';
        dropdown.style.backgroundColor = 'transparent';
        dropdown.style.border = 'transparent';
        dropdown.style.fontStyle = 'italic';
        dropdown.style.transition = 'color 5s, background-color 5s, border 5s, font-style 5s';
        dropdown.style.WebkitAppearance = 'none'; // Hide default arrow in WebKit browsers
        dropdown.style.MozAppearance = 'none'; // Hide default arrow in Mozilla browsers
        dropdown.style.appearance = 'none'; // Standard way to hide the arrow across browsers
    });

    document.querySelectorAll('.choice input, input').forEach(function (input) {
        if (input.checked) {
            input.nextElementSibling.style.color = 'white';
            input.nextElementSibling.style.fontStyle = 'italic';
        } else {
            input.nextElementSibling.style.color = 'transparent';
        }
        input.style.opacity = '0';
        input.style.transition = 'opacity 5s';
        input.nextElementSibling.style.transition = 'color 5s, font-style 5s';
    });

    fadeInAudio('chimes.mp3');
}

function fadeInAudio(audioSrc) {
    let audio = new Audio(audioSrc);
    audio.volume = 0;
    audio.play();

    let fadeTime = 3000;
    let step = 0.01;
    let interval = fadeTime * step;

    let fadeAudioInterval = setInterval(function () {
        if (audio.volume < 1) {
            audio.volume += step;
            if (audio.volume > 0.5) audio.volume = 0.5;
        } else {
            clearInterval(fadeAudioInterval);
        }
    }, interval);
}

function createSubmitButton(buttonText, container) {
    let button = document.createElement('button');
    button.textContent = buttonText;
    button.addEventListener('click', handleSubmitButtonClick);
    container.appendChild(button);
}

function handleSubmitButtonClick() {
    createAndPositionContainer();
}

document.addEventListener('click', function(event) {
    if (event.target.matches('button, input[type="radio"], input[type="checkbox"], input[type="range"], select, option')) {
        // Existing functionality to play 'ding.mp3'
        let audio = new Audio('click2.mp3');
        audio.volume = 0.1; // Adjust the volume to 50%
        audio.play();
    }
});
