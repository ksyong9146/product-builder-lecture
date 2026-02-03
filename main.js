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
        loader.innerHTML = '<div class="loader-spinner"></div><p>AI 모델 로드 중...</p>';

        model = await tmImage.load(modelFile, metadataFile);
        maxPredictions = model.getTotalClasses();
        isModelLoaded = true;

        loader.classList.add('hidden');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Error loading model:', error);
        loader.innerHTML = '<p class="error-message">AI 모델 로드 오류. 페이지를 새로고침하여 다시 시도해 주세요.</p>';
    }
}

// Image upload handler
uploadBtn.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('유효한 이미지 파일(JPG, PNG, GIF 또는 WebP)을 업로드해 주세요.');
        return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        alert('10MB보다 작은 이미지를 업로드해 주세요.');
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
            loader.innerHTML = '<div class="loader-spinner"></div><p>얼굴 특징 분석 중...</p>';

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
        labelContainer.innerHTML = '<p class="error-message">이미지 분석 오류. 다른 사진을 시도해 주세요.</p>';
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
        resultTitle.innerHTML = `당신은 강아지상입니다!`;
        resultDescription.innerHTML = `
            <p class="result-percentage">${percentage}% 강아지상 일치</p>
            <p>당신의 얼굴 특징은 따뜻함, 친근함, 접근성을 시사합니다! 강아지상 얼굴을 가진 사람들은 일반적으로 다음과 같습니다:</p>
            <ul>
                <li><strong>둥근 얼굴형</strong> - 개방성과 따뜻함을 전달합니다.</li>
                <li><strong>넓고 표현력 있는 눈</strong> - 정직함과 열정을 나타냅니다.</li>
                <li><strong>도톰한 볼</strong> - 젊음과 접근성과 관련이 있습니다.</li>
                <li><strong>개방적이고 친근한 표정</strong> - 다른 사람들이 편안함을 느끼게 합니다.</li>
            </ul>
            <p class="trait-highlight">인식된 특성: 충성스럽고, 친근하며, 활기차고, 신뢰할 수 있으며, 주변 사람들에게 기쁨을 가져다주는 훌륭한 동반자입니다.</p>
        `;
        percentageBar.innerHTML = `
            <div class="bar-container">
                <div class="bar-fill dog-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="bar-labels">
                <span class="dog-label">강아지 ${percentage}%</span>
                <span class="cat-label">고양이 ${(100 - parseFloat(percentage)).toFixed(1)}%</span>
            </div>
        `;
    } else if (highestClass === 'Cat') {
        resultTitle.innerHTML = `당신은 고양이상입니다!`;
        resultDescription.innerHTML = `
            <p class="result-percentage">${percentage}% 고양이상 일치</p>
            <p>당신의 얼굴 특징은 우아함, 지성, 신비로움을 시사합니다! 고양이상 얼굴을 가진 사람들은 일반적으로 다음과 같습니다:</p>
            <ul>
                <li><strong>각진 얼굴형</strong> - 세련됨과 우아함을 전달합니다.</li>
                <li><strong>아몬드 모양의 눈</strong> - 통찰력과 깊이를 나타냅니다.</li>
                <li><strong>높은 광대뼈</strong> - 세련됨과 우아함과 관련이 있습니다.</li>
                <li><strong>미묘한 표정</strong> - 흥미롭고 신비로운 분위기를 만듭니다.</li>
            </ul>
            <p class="trait-highlight">인식된 특성: 독립적이고, 지적이며, 우아하고, 침착하며, 자율성을 중요하게 생각하는 매우 통찰력 있는 개인입니다.</p>
        `;
        percentageBar.innerHTML = `
            <div class="bar-container">
                <div class="bar-fill cat-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="bar-labels">
                <span class="cat-label">고양이 ${percentage}%</span>
                <span class="dog-label">강아지 ${(100 - parseFloat(percentage)).toFixed(1)}%</span>
            </div>
        `;
    } else {
        resultTitle.innerHTML = "분석 완료";
        resultDescription.innerHTML = `
            <p>명확한 결과를 판단할 수 없었습니다. 다음과 같은 경우 발생할 수 있습니다:</p>
            <ul>
                <li>얼굴이 명확하게 보이지 않을 경우</li>
                <li>조명이 너무 어둡거나 밝을 경우</li>
                <li>사진 각도가 너무 극단적일 경우</li>
            </ul>
            <p>더 나은 결과를 위해 밝고 정면을 향한 사진을 업로드해 주세요.</p>
        `;
    }

    labelContainer.appendChild(resultTitle);
    labelContainer.appendChild(percentageBar);
    labelContainer.appendChild(resultDescription);

    // Add share prompt
    const sharePrompt = document.createElement('p');
    sharePrompt.className = 'share-prompt';
    sharePrompt.innerHTML = '친구들과 결과를 공유하고 그들이 누구와 일치하는지 확인해 보세요!';
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
