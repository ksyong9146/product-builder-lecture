/**
 * 퍼스널 컬러 진단 결과 페이지 렌더링 + 바이럴 공유 기능
 */
(function () {
    'use strict';

    const container = document.getElementById('result-container');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const typeId = params.get('type');

    if (!typeId || !COLOR_TYPES[typeId]) {
        container.innerHTML = `
            <div style="text-align:center; padding:4rem 1rem;">
                <h2 style="margin-bottom:1rem;">결과를 찾을 수 없습니다</h2>
                <p style="color:var(--text-light); margin-bottom:2rem;">진단을 먼저 진행해주세요.</p>
                <a href="diagnosis.html" class="btn btn-primary" style="display:inline-flex; text-decoration:none;">진단하러 가기</a>
            </div>
        `;
        return;
    }

    const data = COLOR_TYPES[typeId];
    document.title = `${data.name} - 퍼스널 컬러 진단 결과 | MYCOLOR`;

    // Season gradient map for card image
    const SEASON_GRADIENTS = {
        spring: ['#ff9a76', '#ffc371'],
        summer: ['#7ec8e3', '#a8e6cf'],
        fall: ['#c17f59', '#e8a87c'],
        winter: ['#5b6abf', '#8e99f3']
    };

    // Build result page HTML
    container.innerHTML = `
        <!-- Header -->
        <div class="result-header fade-in">
            <span class="result-season-badge ${data.season}">${data.seasonKr} ${data.nameEn.split(' ')[1]}</span>
            <h1>${data.name}</h1>
            <p class="keywords">
                ${data.keywords.map(k => `<span>#${k}</span>`).join(' ')}
            </p>
        </div>

        <!-- Description -->
        <div class="result-card fade-in fade-in-delay-1">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                나의 퍼스널 컬러
            </h3>
            <p class="result-description">${data.description}</p>
            <p class="result-description" style="margin-top:0.8rem;">${data.characteristics}</p>
        </div>

        <!-- How To Use -->
        <div class="result-card fade-in fade-in-delay-2">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v12M12 17h.01"/></svg>
                일상에서 활용하기
            </h3>
            <p class="result-description">${data.howto}</p>
        </div>

        <!-- Color Palette -->
        <div class="result-card fade-in fade-in-delay-2">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                추천 컬러 팔레트
            </h3>
            <div class="palette-grid">
                ${data.palette.map(p => `
                    <div class="palette-item">
                        <div class="palette-color" style="background:${p.color};" title="${p.name}"></div>
                        <div class="palette-name">${p.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Best Colors -->
        <div class="result-card fade-in fade-in-delay-3">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                잘 어울리는 색상
            </h3>
            <div class="color-row">
                ${data.bestColors.map(c => `
                    <div class="color-chip">
                        <div class="color-chip-dot" style="background:${c.color};"></div>
                        ${c.name}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Worst Colors -->
        <div class="result-card">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                피해야 할 색상
            </h3>
            <div class="color-row">
                ${data.worstColors.map(c => `
                    <div class="color-chip">
                        <div class="color-chip-dot" style="background:${c.color};"></div>
                        ${c.name}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Lip Colors -->
        <div class="result-card">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                추천 립 컬러
            </h3>
            <div class="color-row">
                ${data.lipColors.map(c => `
                    <div class="color-chip">
                        <div class="color-chip-dot" style="background:var(--primary-light);"></div>
                        ${c}
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Styling Tips -->
        <div class="result-card">
            <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                스타일링 TIP
            </h3>
            <ul class="tip-list">
                ${data.tips.map(t => `<li>${t}</li>`).join('')}
                <li style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">* 최종 업데이트: 2026년 2월</li>
            </ul>
        </div>

        <!-- Share CTA Banner -->
        <div class="share-cta-banner fade-in">
            <div class="share-cta-inner">
                <p class="share-cta-title">친구에게 결과를 공유해보세요!</p>
                <p class="share-cta-sub">나의 퍼스널 컬러, 친구들은 어떤 타입일까?</p>
                <div class="share-cta-buttons">
                    <button class="share-cta-btn" id="cta-share-main" aria-label="공유하기">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        공유하기
                    </button>
                    <button class="share-cta-btn share-cta-btn-download" id="cta-download" aria-label="이미지 저장">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        이미지 저장
                    </button>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="result-actions">
            <a href="diagnosis.html" class="btn btn-primary" style="text-decoration:none;">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                다시 진단하기
            </a>
            <button class="btn btn-secondary" id="btn-share">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                결과 공유하기
            </button>
        </div>
    `;

    // ==========================================
    // Share Modal
    // ==========================================
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal-overlay';
    shareModal.id = 'share-modal';
    shareModal.innerHTML = `
        <div class="share-modal">
            <div class="share-modal-handle" aria-hidden="true"></div>
            <button class="share-modal-close" id="share-modal-close" aria-label="닫기">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <h3 class="share-modal-title">결과 공유하기</h3>
            <p class="share-modal-sub">나의 퍼스널 컬러를 친구들에게 알려주세요!</p>

            <!-- Result Card Preview -->
            <div class="share-card-preview" id="share-card-preview">
                <canvas id="share-canvas" width="600" height="800"></canvas>
            </div>

            <!-- SNS Buttons -->
            <div class="share-sns-grid">
                <button class="share-sns-btn" id="share-kakao" aria-label="카카오톡 공유">
                    <div class="share-sns-icon kakao-icon">
                        <svg viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.52 6.6-.2.74-.72 2.68-.82 3.1-.13.5.18.49.38.36.16-.1 2.46-1.67 3.46-2.35.48.07.97.1 1.46.1 5.52 0 10-3.58 10-7.9S17.52 3 12 3z"/></svg>
                    </div>
                    <span>카카오톡</span>
                </button>
                <button class="share-sns-btn" id="share-facebook" aria-label="페이스북 공유">
                    <div class="share-sns-icon facebook-icon">
                        <svg viewBox="0 0 24 24" fill="#fff"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z"/></svg>
                    </div>
                    <span>페이스북</span>
                </button>
                <button class="share-sns-btn" id="share-twitter" aria-label="X(트위터) 공유">
                    <div class="share-sns-icon twitter-icon">
                        <svg viewBox="0 0 24 24" fill="#fff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </div>
                    <span>X</span>
                </button>
                <button class="share-sns-btn" id="share-whatsapp" aria-label="WhatsApp 공유">
                    <div class="share-sns-icon whatsapp-icon">
                        <svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <span>WhatsApp</span>
                </button>
            </div>

            <!-- Utility row -->
            <div class="share-util-row">
                <button class="share-util-btn" id="share-download" aria-label="이미지 저장">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    <span>이미지 저장</span>
                </button>
                <button class="share-util-btn" id="share-copy" aria-label="링크 복사">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    <span>링크 복사</span>
                </button>
                <button class="share-util-btn" id="share-native" aria-label="더보기" style="display:none;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    <span>더보기</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(shareModal);

    // ==========================================
    // Floating Share Button
    // ==========================================
    const floatingBtn = document.createElement('button');
    floatingBtn.className = 'floating-share-btn';
    floatingBtn.id = 'floating-share';
    floatingBtn.setAttribute('aria-label', '결과 공유하기');
    floatingBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
    `;
    document.body.appendChild(floatingBtn);

    // Show floating button on scroll
    const resultActions = document.querySelector('.result-actions');
    if (resultActions) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(e => {
                    floatingBtn.classList.toggle('visible', !e.isIntersecting);
                });
            },
            { threshold: 0 }
        );
        observer.observe(resultActions);
    }

    // ==========================================
    // Canvas Result Card Image Generation
    // ==========================================
    function generateShareCard() {
        const canvas = document.getElementById('share-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = 600, H = 800;
        canvas.width = W;
        canvas.height = H;

        const grad = SEASON_GRADIENTS[data.season] || ['#ff5da3', '#6c5ce7'];

        // Background gradient
        const bgGrad = ctx.createLinearGradient(0, 0, W, H);
        bgGrad.addColorStop(0, '#faf8ff');
        bgGrad.addColorStop(1, '#f0eeff');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // Top decorative bar
        const topGrad = ctx.createLinearGradient(0, 0, W, 0);
        topGrad.addColorStop(0, grad[0]);
        topGrad.addColorStop(1, grad[1]);
        ctx.fillStyle = topGrad;
        roundRect(ctx, 0, 0, W, 180, 0);
        ctx.fill();

        // Decorative circles
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(480, 40, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(100, 140, 60, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Logo
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('MYCOLOR', W / 2, 40);

        // Season badge
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        const badgeText = `${data.seasonKr} ${data.nameEn.split(' ')[1]}`;
        const badgeWidth = ctx.measureText(badgeText).width + 40;
        roundRect(ctx, (W - badgeWidth) / 2, 55, badgeWidth, 32, 16);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '600 14px "Noto Sans KR", sans-serif';
        ctx.fillText(badgeText, W / 2, 77);

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = '900 36px "Noto Sans KR", sans-serif';
        ctx.fillText(data.name, W / 2, 130);

        // Keywords
        ctx.font = '400 14px "Noto Sans KR", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        const keywordsStr = data.keywords.map(k => '#' + k).join('  ');
        ctx.fillText(keywordsStr, W / 2, 162);

        // White card area
        ctx.fillStyle = '#ffffff';
        roundRect(ctx, 30, 200, W - 60, 440, 20);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        // Description title
        ctx.fillStyle = '#2d2d3f';
        ctx.font = 'bold 18px "Noto Sans KR", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('나의 퍼스널 컬러', 60, 245);

        // Description (word wrap)
        ctx.fillStyle = '#6b6b80';
        ctx.font = '400 13px "Noto Sans KR", sans-serif';
        wrapText(ctx, data.description, 60, 275, W - 120, 20, 4);

        // Palette section
        const paletteY = 380;
        ctx.fillStyle = '#2d2d3f';
        ctx.font = 'bold 16px "Noto Sans KR", sans-serif';
        ctx.fillText('추천 컬러 팔레트', 60, paletteY);

        // Draw palette colors
        const paletteColors = data.palette.slice(0, 10);
        const chipSize = 44;
        const chipGap = 6;
        const totalPaletteWidth = paletteColors.length * chipSize + (paletteColors.length - 1) * chipGap;
        const paletteStartX = (W - totalPaletteWidth) / 2;
        paletteColors.forEach((p, i) => {
            const x = paletteStartX + i * (chipSize + chipGap);
            ctx.fillStyle = p.color;
            roundRect(ctx, x, paletteY + 18, chipSize, chipSize, 8);
            ctx.fill();
        });

        // Color names under palette
        ctx.fillStyle = '#9e9eb0';
        ctx.font = '400 9px "Noto Sans KR", sans-serif';
        ctx.textAlign = 'center';
        paletteColors.forEach((p, i) => {
            const x = paletteStartX + i * (chipSize + chipGap) + chipSize / 2;
            ctx.fillText(p.name, x, paletteY + 78);
        });

        // Best colors section
        const bestY = 490;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#2d2d3f';
        ctx.font = 'bold 16px "Noto Sans KR", sans-serif';
        ctx.fillText('잘 어울리는 색상', 60, bestY);

        data.bestColors.slice(0, 5).forEach((c, i) => {
            const x = 60 + i * 100;
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(x + 10, bestY + 30, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#6b6b80';
            ctx.font = '400 11px "Noto Sans KR", sans-serif';
            ctx.fillText(c.name, x + 26, bestY + 35);
        });

        // Worst colors section
        const worstY = 550;
        ctx.fillStyle = '#2d2d3f';
        ctx.font = 'bold 16px "Noto Sans KR", sans-serif';
        ctx.fillText('피해야 할 색상', 60, worstY);

        data.worstColors.slice(0, 5).forEach((c, i) => {
            const x = 60 + i * 140;
            ctx.fillStyle = c.color;
            ctx.beginPath();
            ctx.arc(x + 10, worstY + 30, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#6b6b80';
            ctx.font = '400 11px "Noto Sans KR", sans-serif';
            ctx.fillText(c.name, x + 26, worstY + 35);
        });

        // Bottom gradient bar
        const btmGrad = ctx.createLinearGradient(0, 0, W, 0);
        btmGrad.addColorStop(0, grad[0]);
        btmGrad.addColorStop(1, grad[1]);
        ctx.fillStyle = btmGrad;
        roundRect(ctx, 0, H - 100, W, 100, 0);
        ctx.fill();

        // Bottom CTA
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 16px "Noto Sans KR", sans-serif';
        ctx.fillText('나도 퍼스널 컬러 진단 받기', W / 2, H - 60);
        ctx.font = '400 13px "Noto Sans KR", sans-serif';
        ctx.globalAlpha = 0.85;
        ctx.fillText('imcolor.space', W / 2, H - 35);
        ctx.globalAlpha = 1;
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
        const chars = text.split('');
        let line = '';
        let lineCount = 0;
        for (let i = 0; i < chars.length; i++) {
            const testLine = line + chars[i];
            if (ctx.measureText(testLine).width > maxWidth) {
                lineCount++;
                if (lineCount >= maxLines) {
                    ctx.fillText(line.slice(0, -1) + '...', x, y);
                    return;
                }
                ctx.fillText(line, x, y);
                line = chars[i];
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // ==========================================
    // Share Functions
    // ==========================================
    const shareUrl = window.location.href;
    const shareTitle = `나의 퍼스널 컬러는 ${data.name}!`;
    const shareDescription = `AI 퍼스널 컬러 진단 결과, 나는 ${data.name}(${data.nameEn}) 타입이에요! ${data.keywords.map(k => '#' + k).join(' ')}`;
    const shareImage = 'https://imcolor.space/og-image.svg';

    // Initialize Kakao SDK
    try {
        if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
            Kakao.init('YOUR_JAVASCRIPT_KEY');
        }
    } catch (e) { /* Kakao SDK not loaded */ }

    function shareKakao() {
        try {
            if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
                Kakao.Share.sendDefault({
                    objectType: 'feed',
                    content: {
                        title: shareTitle,
                        description: shareDescription,
                        imageUrl: shareImage,
                        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
                    },
                    buttons: [{
                        title: '나도 진단받기',
                        link: { mobileWebUrl: 'https://imcolor.space/diagnosis.html', webUrl: 'https://imcolor.space/diagnosis.html' },
                    }],
                });
            } else {
                alert('카카오톡 SDK를 불러오지 못했습니다. 링크 복사를 이용해주세요.');
            }
        } catch (e) {
            alert('카카오톡 공유에 실패했습니다. 링크 복사를 이용해주세요.');
        }
    }

    function shareFacebook() {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`,
            '_blank',
            'width=600,height=500,scrollbars=yes'
        );
    }

    function shareTwitter() {
        const text = `${shareTitle}\n${shareDescription}`;
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'width=600,height=500,scrollbars=yes'
        );
    }

    function shareWhatsApp() {
        const text = `${shareTitle}\n${shareDescription}\n${shareUrl}`;
        window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
            '_blank'
        );
    }

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(shareUrl);
            const btn = document.getElementById('share-copy');
            const span = btn.querySelector('span');
            const original = span.textContent;
            span.textContent = '복사 완료!';
            btn.classList.add('copied');
            setTimeout(() => {
                span.textContent = original;
                btn.classList.remove('copied');
            }, 2000);
        } catch (e) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = shareUrl;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            const btn = document.getElementById('share-copy');
            const span = btn.querySelector('span');
            span.textContent = '복사 완료!';
            setTimeout(() => { span.textContent = '링크 복사'; }, 2000);
        }
    }

    function downloadImage() {
        const canvas = document.getElementById('share-canvas');
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `mycolor-${data.nameEn.replace(/\s+/g, '-').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    async function nativeShare() {
        if (!navigator.share) return;
        try {
            const canvas = document.getElementById('share-canvas');
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'mycolor-result.png', { type: 'image/png' });
            await navigator.share({
                title: shareTitle,
                text: shareDescription,
                url: shareUrl,
                files: [file],
            });
        } catch (e) {
            // User cancelled or sharing failed, try without image
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareDescription,
                    url: shareUrl,
                });
            } catch (e2) { /* cancelled */ }
        }
    }

    // ==========================================
    // Modal Control
    // ==========================================
    function openShareModal() {
        generateShareCard();
        shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeShareModal() {
        shareModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Show native share button if supported
    if (navigator.share) {
        const nativeBtn = document.getElementById('share-native');
        if (nativeBtn) nativeBtn.style.display = '';
    }

    // ==========================================
    // Event Listeners
    // ==========================================
    document.getElementById('btn-share')?.addEventListener('click', openShareModal);
    document.getElementById('cta-share-main')?.addEventListener('click', openShareModal);
    document.getElementById('floating-share')?.addEventListener('click', openShareModal);
    document.getElementById('share-modal-close')?.addEventListener('click', closeShareModal);
    document.getElementById('cta-download')?.addEventListener('click', () => {
        generateShareCard();
        downloadImage();
    });

    // Close modal on overlay click
    shareModal.addEventListener('click', (e) => {
        if (e.target === shareModal) closeShareModal();
    });

    // Close modal on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeShareModal();
    });

    // SNS share buttons
    document.getElementById('share-kakao')?.addEventListener('click', shareKakao);
    document.getElementById('share-facebook')?.addEventListener('click', shareFacebook);
    document.getElementById('share-twitter')?.addEventListener('click', shareTwitter);
    document.getElementById('share-whatsapp')?.addEventListener('click', shareWhatsApp);
    document.getElementById('share-copy')?.addEventListener('click', copyLink);
    document.getElementById('share-download')?.addEventListener('click', downloadImage);
    document.getElementById('share-native')?.addEventListener('click', nativeShare);

})();
