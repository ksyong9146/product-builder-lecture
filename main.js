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

    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ': ' + (prediction[i].probability * 100).toFixed(1) + '%';
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        if(prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            highestClass = prediction[i].className;
        }
        
        labelContainer.appendChild(resultItem);
    }
    
    // Display the best result prominently
    const finalResultItem = document.createElement('div');
    finalResultItem.className = 'result-item highlight';
    finalResultItem.innerHTML = `You are a ${highestClass} person! (${(highestProb * 100).toFixed(1)}%)`;
    labelContainer.prepend(finalResultItem); // Add at the beginning
}

init();
