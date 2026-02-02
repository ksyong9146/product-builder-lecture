// Animal Face Test - AI-powered face analysis
// All processing happens locally in your browser for complete privacy

const modelURL = 'https://teachablemachine.withgoogle.com/models/X1lWO1rj2/';
const modelFile = modelURL + 'model.json';
const metadataFile = modelURL + 'metadata.json';

const uploadBtn = document.getElementById('upload-btn');
const imagePreview = document.getElementById('image-preview');
const previewSection = document.getElementById('preview-section');
const resultContainer = document.getElementById('result-container');
const labelContainer = document.getElementById('label-container');
const loader = document.getElementById('loader');
const tryAgainBtn = document.getElementById('try-again-btn');

let model, maxPredictions;
let isModelLoaded = false;

// Load the model when the page loads
async function init() {
    try {
        loader.classList.remove('hidden');
        loader.innerHTML = '<div class="loader-spinner"></div><p>Loading AI model...</p>';

        model = await tmImage.load(modelFile, metadataFile);
        maxPredictions = model.getTotalClasses();
        isModelLoaded = true;

        loader.classList.add('hidden');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        loader.innerHTML = '<p class="error-message">Error loading AI model. Please refresh the page and try again.</p>';
    }
}

// Image upload handler
uploadBtn.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
        return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        alert('Please upload an image smaller than 10MB');
        return;
    }

    // Show preview section and hide results
    previewSection.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    const reader = new FileReader();
    reader.onload = async (e) => {
        imagePreview.src = e.target.result;
        imagePreview.onload = async () => {
            // Wait for model if not loaded
            if (!isModelLoaded) {
                loader.classList.remove('hidden');
                loader.innerHTML = '<div class="loader-spinner"></div><p>Loading AI model...</p>';
                await waitForModel();
            }

            loader.classList.remove('hidden');
            loader.innerHTML = '<div class="loader-spinner"></div><p>Analyzing your facial features...</p>';

            // Small delay to ensure image is rendered
            await new Promise(resolve => setTimeout(resolve, 100));

            await predict(imagePreview);

            loader.classList.add('hidden');
            resultContainer.classList.remove('hidden');

            // Scroll to results
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
    };
    reader.readAsDataURL(file);
});

// Wait for model to load
async function waitForModel() {
    while (!isModelLoaded) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Prediction function
async function predict(image) {
    try {
        const prediction = await model.predict(image);
        let highestProb = 0;
        let highestClass = '';
        let allPredictions = [];

        for (let i = 0; i < maxPredictions; i++) {
            allPredictions.push({
                className: prediction[i].className,
                probability: prediction[i].probability
            });

            if (prediction[i].probability > highestProb) {
                highestProb = prediction[i].probability;
                highestClass = prediction[i].className;
            }
        }

        displayResults(highestClass, highestProb, allPredictions);
    } catch (error) {
        console.error('Prediction error:', error);
        labelContainer.innerHTML = '<p class="error-message">Error analyzing image. Please try a different photo.</p>';
    }
}

// Display results with detailed descriptions
function displayResults(highestClass, highestProb, allPredictions) {
    labelContainer.innerHTML = '';

    const percentage = (highestProb * 100).toFixed(1);

    // Result title
    const resultTitle = document.createElement('h2');
    resultTitle.className = 'result-title';

    // Result description
    const resultDescription = document.createElement('div');
    resultDescription.className = 'result-description';

    // Percentage bar
    const percentageBar = document.createElement('div');
    percentageBar.className = 'percentage-bar';

    if (highestClass === 'Dog') {
        resultTitle.innerHTML = `You Have a Dog Face!`;
        resultDescription.innerHTML = `
            <p class="result-percentage">${percentage}% Dog Face Match</p>
            <p>Your facial features suggest warmth, friendliness, and approachability! People with dog-like faces typically have:</p>
            <ul>
                <li><strong>Rounder face shape</strong> - conveying openness and warmth</li>
                <li><strong>Wider-set, expressive eyes</strong> - suggesting honesty and enthusiasm</li>
                <li><strong>Fuller cheeks</strong> - associated with youthfulness and approachability</li>
                <li><strong>Open, friendly expression</strong> - making others feel at ease</li>
            </ul>
            <p class="trait-highlight">Perceived traits: Loyal, friendly, energetic, trustworthy, and great companions who bring joy to those around them.</p>
        `;
        percentageBar.innerHTML = `
            <div class="bar-container">
                <div class="bar-fill dog-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="bar-labels">
                <span class="dog-label">Dog ${percentage}%</span>
                <span class="cat-label">Cat ${(100 - parseFloat(percentage)).toFixed(1)}%</span>
            </div>
        `;
    } else if (highestClass === 'Cat') {
        resultTitle.innerHTML = `You Have a Cat Face!`;
        resultDescription.innerHTML = `
            <p class="result-percentage">${percentage}% Cat Face Match</p>
            <p>Your facial features suggest elegance, intelligence, and an air of mystery! People with cat-like faces typically have:</p>
            <ul>
                <li><strong>Angular face shape</strong> - conveying sophistication and elegance</li>
                <li><strong>Almond-shaped eyes</strong> - suggesting perceptiveness and depth</li>
                <li><strong>High cheekbones</strong> - associated with refinement and grace</li>
                <li><strong>Subtle expressions</strong> - creating an intriguing, mysterious aura</li>
            </ul>
            <p class="trait-highlight">Perceived traits: Independent, intelligent, graceful, calm, and highly perceptive individuals who value their autonomy.</p>
        `;
        percentageBar.innerHTML = `
            <div class="bar-container">
                <div class="bar-fill cat-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="bar-labels">
                <span class="cat-label">Cat ${percentage}%</span>
                <span class="dog-label">Dog ${(100 - parseFloat(percentage)).toFixed(1)}%</span>
            </div>
        `;
    } else {
        resultTitle.innerHTML = "Analysis Complete";
        resultDescription.innerHTML = `
            <p>We couldn't determine a clear result. This might happen if:</p>
            <ul>
                <li>The face isn't clearly visible</li>
                <li>The lighting is too dark or bright</li>
                <li>The photo angle is too extreme</li>
            </ul>
            <p>Try uploading a clear, front-facing photo with good lighting for better results.</p>
        `;
    }

    labelContainer.appendChild(resultTitle);
    labelContainer.appendChild(percentageBar);
    labelContainer.appendChild(resultDescription);

    // Add share prompt
    const sharePrompt = document.createElement('p');
    sharePrompt.className = 'share-prompt';
    sharePrompt.innerHTML = 'Share your result with friends and see if they match!';
    labelContainer.appendChild(sharePrompt);
}

// Try again button handler
if (tryAgainBtn) {
    tryAgainBtn.addEventListener('click', () => {
        // Reset the file input
        uploadBtn.value = '';

        // Hide preview and results
        previewSection.classList.add('hidden');
        resultContainer.classList.add('hidden');

        // Clear the image
        imagePreview.src = '#';

        // Scroll to upload section
        document.querySelector('.upload-section').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('nav-menu-active');
        navToggle.classList.toggle('nav-toggle-active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('nav-menu-active');
            navToggle.classList.remove('nav-toggle-active');
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
