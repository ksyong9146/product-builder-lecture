const modelURL = 'https://teachablemachine.withgoogle.com/models/X1lWO1rj2/';
const modelFile = modelURL + 'model.json';
const metadataFile = modelURL + 'metadata.json';

const webcamBtn = document.getElementById('webcam-btn');
const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const webcamContainer = document.getElementById('webcam-container');
const resultContainer = document.getElementById('result-container');
const labelContainer = document.getElementById('label-container');
const loader = document.getElementById('loader');

let model, webcam, maxPredictions;

// Load the model
async function init() {
    loader.classList.remove('hidden');
    model = await tmImage.load(modelFile, metadataFile);
    maxPredictions = model.getTotalClasses();
    loader.classList.add('hidden');
}

// Webcam setup
async function setupWebcam() {
    webcam = new tmImage.Webcam(400, 400, true); // width, height, flip
    await webcam.setup();
    await webcam.play();
    webcamContainer.appendChild(webcam.canvas);
    window.requestAnimationFrame(loop);
}

// Webcam loop
async function loop() {
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(loop);
}

// Image upload handler
uploadBtn.addEventListener('change', async (event) => {
    webcamContainer.classList.add('hidden');
    imagePreview.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    
    const file = event.target.files[0];
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

// Webcam button handler
webcamBtn.addEventListener('click', async () => {
    imagePreview.classList.add('hidden');
    webcamContainer.classList.remove('hidden');
    resultContainer.classList.remove('hidden');
    await setupWebcam();
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
        resultItem.innerHTML = classPrediction;
        
        if(prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            highestClass = prediction[i].className;
        }
        
        labelContainer.appendChild(resultItem);
    }
    
    // Highlight the best result
    const allResultItems = document.querySelectorAll('.result-item');
    allResultItems.forEach(item => {
        if(item.innerHTML.includes(highestClass)) {
            item.classList.add('highlight');
            item.innerHTML = `You are a ${highestClass} person! (${(highestProb * 100).toFixed(1)}%)`;
        }
    });
}

init();
