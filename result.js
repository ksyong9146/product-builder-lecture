/**
 * 퍼스널 컬러 진단 결과 페이지 렌더링
 */
(function () {
    'use strict';

    const container = document.getElementById('result-container');
    if (!container) return;

    // Get type from URL
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
            </ul>
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

    // Share button
    const shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: `나의 퍼스널 컬러는 ${data.name}!`,
                text: `AI 퍼스널 컬러 진단 결과, 나는 ${data.name}(${data.nameEn}) 타입이에요! ${data.keywords.map(k => '#' + k).join(' ')}`,
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (e) {
                    // User cancelled sharing
                }
            } else {
                // Fallback: copy to clipboard
                try {
                    await navigator.clipboard.writeText(
                        `${shareData.text}\n${shareData.url}`
                    );
                    shareBtn.textContent = '링크가 복사되었어요!';
                    setTimeout(() => {
                        shareBtn.innerHTML = `
                            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                            결과 공유하기
                        `;
                    }, 2000);
                } catch (e) {
                    // Clipboard not available
                }
            }
        });
    }
})();
