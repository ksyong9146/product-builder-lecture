const modelURL = 'https://teachablemachine.withgoogle.com/models/X1lWO1rj2/';
const modelFile = modelURL + 'model.json';
const metadataFile = modelURL + 'metadata.json';

const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const resultContainer = document.getElementById('result-container');
const labelContainer = document.getElementById('label-container');
const loader = document.getElementById('loader');

let model, maxPredictions;

// Load the model
async function init() {
    loader.classList.remove('hidden');
    model = await tmImage.load(modelFile, metadataFile);
    maxPredictions = model.getTotalClasses();
    loader.classList.add('hidden');
    imagePreview.src = 'https://via.placeholder.com/400x300?text=Upload+Image'; // Placeholder image
    imagePreview.classList.remove('hidden');
}

// Image upload handler
uploadBtn.addEventListener('change', async (event) => {
    imagePreview.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    
    const file = event.target.files[0];
    if (!file) {
        imagePreview.src = 'https://via.placeholder.com/400x300?text=Upload+Image'; // Reset to placeholder if no file
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        imagePreview.src = e.target.result;
        loader.classList.remove('hidden');
        await predict(imagePreview);
        loader.classList.add('hidden');
        resultContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
});

// Prediction function
async function predict(image) {
    const prediction = await model.predict(image);
    let highestProb = 0;
    let highestClass = '';

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            highestClass = prediction[i].className;
        }
    }
    
    labelContainer.innerHTML = ''; // Clear previous results

    const resultTitle = document.createElement('h2');
    resultTitle.style.color = "var(--secondary-color)";

    const resultDescription = document.createElement('p');
    resultDescription.style.fontSize = '1.1rem';
    resultDescription.style.lineHeight = '1.7';

    if (highestClass === 'Dog') {
        resultTitle.innerHTML = `You're a Dog Person! (${(highestProb * 100).toFixed(1)}%)`;
        resultDescription.innerHTML = `With features that suggest friendliness and loyalty, your face reflects a warm and approachable energy. People with "dog-like" faces are often seen as energetic, trustworthy, and great companions who bring joy to those around them.`;
    } else if (highestClass === 'Cat') {
        resultTitle.innerHTML = `You're a Cat Person! (${(highestProb * 100).toFixed(1)}%)`;
        resultDescription.innerHTML = `Your facial features align with those of a cat, suggesting elegance, independence, and a hint of mystery. People with "cat-like" faces are often perceived as graceful, calm, highly perceptive, and in tune with their surroundings.`;
    } else {
        resultTitle.innerHTML = "Result";
        resultDescription.innerHTML = "Could not determine a result. Please try another image.";
    }

    labelContainer.appendChild(resultTitle);
    labelContainer.appendChild(resultDescription);
}

init();
