document.addEventListener('DOMContentLoaded', () => {
    const quiz = document.getElementById('quiz');

    if (quiz) {
        const questions = quiz.querySelectorAll('.question-container');
        const submitBtn = document.getElementById('submit-btn');

        questions.forEach(question => {
            const options = question.querySelectorAll('.option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    // Deselect all options in the same question
                    options.forEach(opt => opt.classList.remove('selected'));
                    // Select the clicked option
                    option.classList.add('selected');
                });
            });
        });

        submitBtn.addEventListener('click', () => {
            let warmCount = 0;
            let coolCount = 0;

            questions.forEach(question => {
                const selectedOption = question.querySelector('.option.selected');
                if (selectedOption) {
                    if (selectedOption.dataset.value === 'warm') {
                        warmCount++;
                    } else if (selectedOption.dataset.value === 'cool') {
                        coolCount++;
                    }
                }
            });

            let result = 'neutral';
            if (warmCount > coolCount) {
                result = 'warm';
            } else if (coolCount > warmCount) {
                result = 'cool';
            }

            window.location.href = `result.html?result=${result}`;
        });
    }

    const resultContainer = document.getElementById('result-container');
    if(resultContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const result = urlParams.get('result');

        const resultTitle = document.getElementById('result-title');
        const resultDescription = document.getElementById('result-description');
        const resultImage = document.getElementById('result-image');

        if (result === 'warm') {
            resultTitle.textContent = '당신은 웜톤입니다!';
            resultDescription.textContent = '웜톤은 따뜻하고 생기있는 컬러가 잘 어울립니다. 골드 액세서리가 잘 어울리며, 오렌지, 브라운, 베이지 계열의 컬러를 활용해보세요.';
            resultImage.src = 'https://i.imgur.com/k6p6g8c.png'; // Placeholder for warm tone
            resultImage.alt = '웜톤 컬러 팔레트';
        } else if (result === 'cool') {
            resultTitle.textContent = '당신은 쿨톤입니다!';
            resultDescription.textContent = '쿨톤은 시원하고 청량한 컬러가 잘 어울립니다. 실버 액세서리가 잘 어울리며, 블루, 핑크, 퍼플 계열의 컬러를 활용해보세요.';
            resultImage.src = 'https://i.imgur.com/y1B8O1d.png'; // Placeholder for cool tone
            resultImage.alt = '쿨톤 컬러 팔레트';
        } else {
            resultTitle.textContent = '당신은 뉴트럴톤입니다!';
            resultDescription.textContent = '뉴트럴톤은 웜톤과 쿨톤의 특징을 모두 가지고 있어 다양한 컬러를 소화할 수 있습니다. 여러가지 컬러를 시도해보며 자신에게 가장 잘 어울리는 컬러를 찾아보세요.';
            resultImage.src = 'https://i.imgur.com/B1b2g1f.png'; // Placeholder for neutral tone
            resultImage.alt = '뉴트럴톤 컬러 팔레트';
        }
    }
});
