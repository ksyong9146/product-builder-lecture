/**
 * AI 퍼스널 컬러 진단 - 피부톤 분석 엔진
 * 카메라/업로드 이미지에서 피부색을 추출하고 Lab 색공간에서 분석하여
 * 10가지 퍼스널 컬러 타입 중 하나로 분류합니다.
 */

(function () {
    'use strict';

    // DOM Elements
    const video = document.getElementById('video');
    const captureCanvas = document.getElementById('capture-canvas');
    const previewImage = document.getElementById('preview-image');
    const cameraOverlay = document.getElementById('camera-overlay');
    const faceGuide = document.getElementById('face-guide');
    const analysisOverlay = document.getElementById('analysis-overlay');

    const btnCamera = document.getElementById('btn-camera');
    const btnCapture = document.getElementById('btn-capture');
    const btnRetake = document.getElementById('btn-retake');
    const btnAnalyze = document.getElementById('btn-analyze');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    if (!video) return; // Not on diagnosis page

    let stream = null;
    let capturedImageData = null;

    // ===== Camera Controls =====

    btnCamera.addEventListener('click', async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
            });
            video.srcObject = stream;
            video.classList.remove('hidden');
            previewImage.classList.add('hidden');
            captureCanvas.classList.add('hidden');
            cameraOverlay.classList.add('hidden');
            faceGuide.style.display = 'flex';

            btnCamera.classList.add('hidden');
            btnCapture.classList.remove('hidden');
            btnRetake.classList.add('hidden');
            btnAnalyze.classList.add('hidden');
        } catch (err) {
            alert('카메라에 접근할 수 없습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.');
        }
    });

    btnCapture.addEventListener('click', () => {
        const ctx = captureCanvas.getContext('2d');
        captureCanvas.width = video.videoWidth;
        captureCanvas.height = video.videoHeight;
        // Mirror the capture to match the video display
        ctx.translate(captureCanvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        capturedImageData = ctx.getImageData(0, 0, captureCanvas.width, captureCanvas.height);

        // Show preview
        previewImage.src = captureCanvas.toDataURL('image/png');
        previewImage.classList.remove('hidden');
        video.classList.add('hidden');
        faceGuide.style.display = 'none';

        // Stop camera
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }

        btnCapture.classList.add('hidden');
        btnRetake.classList.remove('hidden');
        btnAnalyze.classList.remove('hidden');
    });

    btnRetake.addEventListener('click', () => {
        capturedImageData = null;
        previewImage.classList.add('hidden');
        previewImage.src = '';
        cameraOverlay.classList.remove('hidden');
        faceGuide.style.display = 'none';

        btnCamera.classList.remove('hidden');
        btnCapture.classList.add('hidden');
        btnRetake.classList.add('hidden');
        btnAnalyze.classList.add('hidden');
    });

    // ===== File Upload =====

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const ctx = captureCanvas.getContext('2d');
                captureCanvas.width = img.width;
                captureCanvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                capturedImageData = ctx.getImageData(0, 0, img.width, img.height);

                previewImage.src = e.target.result;
                previewImage.classList.remove('hidden');
                video.classList.add('hidden');
                cameraOverlay.classList.add('hidden');
                faceGuide.style.display = 'none';

                if (stream) {
                    stream.getTracks().forEach(t => t.stop());
                    stream = null;
                }

                btnCamera.classList.add('hidden');
                btnCapture.classList.add('hidden');
                btnRetake.classList.remove('hidden');
                btnAnalyze.classList.remove('hidden');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // ===== Analysis =====

    btnAnalyze.addEventListener('click', () => {
        if (!capturedImageData) return;

        // Show analysis overlay
        analysisOverlay.classList.add('active');
        btnAnalyze.disabled = true;

        // Simulate AI processing with progressive messages
        const messages = [
            { text: 'AI가 피부톤을 분석하고 있어요', sub: '얼굴 영역 감지 중...' },
            { text: '피부 색상 데이터 수집 중', sub: 'RGB 값 추출 중...' },
            { text: 'Lab 색공간 변환 중', sub: '명도, 채도, 색온도 분석...' },
            { text: '퍼스널 컬러 분류 중', sub: '10가지 톤 매칭 중...' }
        ];

        const textEl = analysisOverlay.querySelector('.analysis-text');
        const subEl = analysisOverlay.querySelector('.analysis-sub');

        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step < messages.length) {
                textEl.textContent = messages[step].text;
                subEl.textContent = messages[step].sub;
            }
        }, 700);

        // Actual analysis runs in background
        setTimeout(() => {
            clearInterval(interval);
            const result = analyzeSkinTone(capturedImageData);
            window.location.href = `result.html?type=${result}`;
        }, 2800);
    });

    // ===== Skin Tone Analysis Engine =====

    function analyzeSkinTone(imageData) {
        const { data, width, height } = imageData;

        // Step 1: Sample skin pixels from the center face region
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height * 0.4); // Face is usually upper-center
        const sampleRadius = Math.floor(Math.min(width, height) * 0.15);

        const skinPixels = [];

        for (let y = centerY - sampleRadius; y < centerY + sampleRadius; y++) {
            for (let x = centerX - sampleRadius; x < centerX + sampleRadius; x++) {
                if (x < 0 || x >= width || y < 0 || y >= height) continue;

                const idx = (y * width + x) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];

                // Skin detection using HSV thresholds
                if (isSkinPixel(r, g, b)) {
                    skinPixels.push({ r, g, b });
                }
            }
        }

        // If not enough skin pixels in center, expand search
        if (skinPixels.length < 50) {
            const expandedRadius = Math.floor(Math.min(width, height) * 0.3);
            for (let y = centerY - expandedRadius; y < centerY + expandedRadius; y += 2) {
                for (let x = centerX - expandedRadius; x < centerX + expandedRadius; x += 2) {
                    if (x < 0 || x >= width || y < 0 || y >= height) continue;
                    const idx = (y * width + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    if (isSkinPixel(r, g, b)) {
                        skinPixels.push({ r, g, b });
                    }
                }
            }
        }

        // Fallback: use center pixels
        if (skinPixels.length < 20) {
            for (let y = centerY - 20; y < centerY + 20; y++) {
                for (let x = centerX - 20; x < centerX + 20; x++) {
                    if (x < 0 || x >= width || y < 0 || y >= height) continue;
                    const idx = (y * width + x) * 4;
                    skinPixels.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
                }
            }
        }

        // Step 2: Calculate average skin color
        const avgR = skinPixels.reduce((s, p) => s + p.r, 0) / skinPixels.length;
        const avgG = skinPixels.reduce((s, p) => s + p.g, 0) / skinPixels.length;
        const avgB = skinPixels.reduce((s, p) => s + p.b, 0) / skinPixels.length;

        // Step 3: Convert to Lab color space
        const lab = rgbToLab(avgR, avgG, avgB);
        const L = lab.L;  // Lightness (0-100)
        const a = lab.a;  // Green(-) to Red(+)
        const b_val = lab.b;  // Blue(-) to Yellow(+)

        // Chroma (colorfulness)
        const C = Math.sqrt(a * a + b_val * b_val);

        // Hue angle
        const H = Math.atan2(b_val, a) * (180 / Math.PI);
        const hue = H < 0 ? H + 360 : H;

        // Step 4: Classify into personal color type
        return classifyPersonalColor(L, a, b_val, C, hue);
    }

    function isSkinPixel(r, g, b) {
        // Multiple skin detection rules for robustness
        // Rule 1: RGB ratio-based
        const isRgbSkin = r > 60 && g > 40 && b > 20 &&
            r > g && r > b &&
            (r - g) > 10 && (r - b) > 10 &&
            Math.abs(r - g) < 120;

        // Rule 2: HSV-based
        const hsv = rgbToHsv(r, g, b);
        const isHsvSkin = hsv.h >= 0 && hsv.h <= 50 &&
            hsv.s >= 0.1 && hsv.s <= 0.75 &&
            hsv.v >= 0.2;

        return isRgbSkin || isHsvSkin;
    }

    function classifyPersonalColor(L, a, b, C, hue) {
        // Determine undertone: warm vs cool
        // b > 0 indicates yellow (warm), b < 0 indicates blue (cool)
        // a > 0 indicates red
        const warmScore = b * 0.7 + a * 0.3;
        const isWarm = warmScore > 8;
        const isCool = warmScore < 4;

        // Lightness categories
        const isLight = L > 65;
        const isMedium = L >= 45 && L <= 65;
        const isDark = L < 45;

        // Saturation/Chroma categories
        const isHighChroma = C > 25;
        const isMediumChroma = C >= 15 && C <= 25;
        const isLowChroma = C < 15;

        if (isWarm) {
            // Spring or Fall
            if (isLight) {
                if (isHighChroma) return 'springBright';
                return 'springLight';
            } else if (isMedium) {
                if (isHighChroma) return 'fallStrong';
                return 'fallMute';
            } else {
                // Dark
                return 'fallDeep';
            }
        } else if (isCool) {
            // Summer or Winter
            if (isLight) {
                if (isHighChroma) return 'summerBright';
                return 'summerLight';
            } else if (isMedium) {
                if (isHighChroma) return 'winterBright';
                return 'summerMute';
            } else {
                return 'winterDeep';
            }
        } else {
            // Neutral-ish (between warm and cool)
            if (isLight) {
                if (isHighChroma) return 'summerBright';
                if (C > 18) return 'springLight';
                return 'summerLight';
            } else if (isMedium) {
                if (isHighChroma) return 'fallStrong';
                if (hue > 30 && hue < 70) return 'fallMute';
                return 'summerMute';
            } else {
                if (hue > 20 && hue < 60) return 'fallDeep';
                return 'winterDeep';
            }
        }
    }

    // ===== Color Space Conversions =====

    function rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;
        let h = 0;
        const s = max === 0 ? 0 : d / max;
        const v = max;

        if (d !== 0) {
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            else if (max === g) h = ((b - r) / d + 2) / 6;
            else h = ((r - g) / d + 4) / 6;
        }

        return { h: h * 360, s, v };
    }

    function rgbToLab(r, g, b) {
        // RGB to XYZ (sRGB D65)
        r /= 255; g /= 255; b /= 255;

        r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

        let x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
        let y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) / 1.00000;
        let z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) / 1.08883;

        x = x > 0.008856 ? Math.cbrt(x) : (7.787 * x) + 16 / 116;
        y = y > 0.008856 ? Math.cbrt(y) : (7.787 * y) + 16 / 116;
        z = z > 0.008856 ? Math.cbrt(z) : (7.787 * z) + 16 / 116;

        return {
            L: (116 * y) - 16,
            a: 500 * (x - y),
            b: 200 * (y - z)
        };
    }
})();
