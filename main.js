const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const generateBtn = document.getElementById('generate-btn');
const modal = document.getElementById('contact-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.querySelector('.close-btn');

const generateLottoNumbers = () => {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers);
};

const displayNumbers = (numbers) => {
    lottoNumbersContainer.innerHTML = '';
    numbers.forEach(number => {
        const lottoBall = document.createElement('div');
        lottoBall.classList.add('lotto-ball');
        lottoBall.textContent = number;
        lottoNumbersContainer.appendChild(lottoBall);
    });
};

generateBtn.addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    displayNumbers(numbers);
});

openModalBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});

// Initial generation
const initialNumbers = generateLottoNumbers();
displayNumbers(initialNumbers);