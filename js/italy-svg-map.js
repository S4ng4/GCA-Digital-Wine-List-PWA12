/**
 * Offline-resilient Interactive SVG Wine Map of Italy
 * Used automatically when Leaflet CDN or external GeoJSON is unavailable,
 * ensuring the Gran Caffè L'Aquila Wine Map PWA works 100% offline.
 */
(function (global) {
    'use strict';

    const ITALY_REGIONS = [
        { id: "VALLE D'AOSTA", label: "Valle d'Aosta", short: "VDA", lx: 84, ly: 100, points: "62,92 84,84 103,95 98,113 73,115 58,105" },
        { id: "PIEMONTE", label: "Piemonte", short: "Piemonte", lx: 96, ly: 148, points: "58,105 73,115 98,113 103,95 122,90 135,108 134,140 144,162 128,176 92,188 70,180 56,154 62,126" },
        { id: "LIGURIA", label: "Liguria", short: "Liguria", lx: 118, ly: 192, points: "70,180 92,188 128,176 164,185 170,198 145,198 118,195 85,204 72,196" },
        { id: "LOMBARDIA", label: "Lombardia", short: "Lombardia", lx: 170, ly: 126, points: "122,90 146,72 184,68 206,82 214,110 218,144 202,162 162,166 144,162 134,140 135,108" },
        { id: "TRENTINO-ALTO ADIGE", label: "Trentino-Alto Adige", short: "Trentino", lx: 232, ly: 76, points: "184,68 214,44 256,42 276,62 262,96 238,106 214,110 206,82" },
        { id: "VENETO", label: "Veneto", short: "Veneto", lx: 256, ly: 130, points: "214,110 238,106 262,96 276,62 294,74 294,112 308,130 282,158 264,164 238,162 218,144" },
        { id: "FRIULI-VENEZIA GIULIA", label: "Friuli-Venezia Giulia", short: "Friuli", lx: 314, ly: 102, points: "294,74 330,72 342,96 334,126 308,130 294,112" },
        { id: "EMILIA-ROMAGNA", label: "Emilia-Romagna", short: "Emilia-Romagna", lx: 212, ly: 184, points: "144,162 162,166 202,162 238,162 264,164 276,184 268,208 238,212 204,202 170,198 164,185" },
        { id: "TOSCANA", label: "Toscana", short: "Toscana", lx: 204, ly: 244, points: "170,198 204,202 238,212 246,236 236,274 218,292 194,284 180,256 170,224" },
        { id: "LE MARCHE", label: "Marche", short: "Marche", lx: 274, ly: 246, points: "246,212 268,208 292,232 302,262 284,278 262,270 250,242" },
        { id: "UMBRIA", label: "Umbria", short: "Umbria", lx: 248, ly: 272, points: "238,212 246,212 250,242 262,270 264,296 244,302 230,288 236,274" },
        { id: "LAZIO", label: "Lazio", short: "Lazio", lx: 254, ly: 326, points: "218,292 230,288 244,302 264,296 278,314 294,344 276,364 246,350 224,324" },
        { id: "ABRUZZO", label: "Abruzzo", short: "Abruzzo", lx: 298, ly: 306, points: "264,296 284,278 302,262 326,294 332,324 304,334 282,324 278,314" },
        { id: "MOLISE", label: "Molise", short: "Molise", lx: 326, ly: 344, points: "304,334 332,324 352,338 344,358 318,358 302,348" },
        { id: "CAMPANIA", label: "Campania", short: "Campania", lx: 322, ly: 386, points: "294,344 302,348 318,358 344,358 358,376 356,412 332,418 310,398 288,374 276,364" },
        { id: "PUGLIA", label: "Puglia", short: "Puglia", lx: 406, ly: 382, points: "352,338 386,336 400,354 434,378 468,408 476,434 456,442 436,418 410,406 392,390 368,374 358,376 344,358" },
        { id: "BASILICATA", label: "Basilicata", short: "Basilicata", lx: 374, ly: 408, points: "358,376 368,374 392,390 404,414 390,432 362,428 356,412" },
        { id: "CALABRIA", label: "Calabria", short: "Calabria", lx: 394, ly: 478, points: "362,428 390,432 406,454 420,478 408,510 390,536 372,532 376,502 384,474 368,452" },
        { id: "SICILIA", label: "Sicilia", short: "Sicilia", lx: 312, ly: 556, points: "242,538 294,530 342,522 368,524 362,554 350,584 328,596 290,578 250,562" },
        { id: "SARDEGNA", label: "Sardegna", short: "Sardegna", lx: 118, ly: 398, points: "96,326 132,320 148,348 144,394 140,446 116,466 94,458 88,414 90,364" }
    ];

    const FAMILY_COLORS = {
        'ALL':          { fill: '#26211B', active: '#D4AF37', accent: '#D4AF37', name: 'All Wines' },
        'ROSSO':        { fill: '#3A151B', active: '#8B2635', accent: '#C94B5C', name: 'Red Wines' },
        'BIANCO':       { fill: '#35301C', active: '#C5A952', accent: '#E5CE7B', name: 'White Wines' },
        'ROSATO':       { fill: '#3A1F24', active: '#B76E79', accent: '#DBA0A9', name: 'Rosé Wines' },
        'ARANCIONE':    { fill: '#3B2514', active: '#C87D3B', accent: '#E49F5E', name: 'Orange Wines' },
        'BOLLICINE':    { fill: '#332D1B', active: '#D4AF37', accent: '#F2D984', name: 'Sparkling' },
        'NON ALCOLICO': { fill: '#1D2E22', active: '#5B8C67', accent: '#83B890', name: 'Non-Alcoholic' }
    };

    function normalizeRegion(r) {
        if (!r) return '';
        const u = String(r).trim().toUpperCase();
        if (u === 'MARCHE' || u === 'LE MARCHE') return 'LE MARCHE';
        if (u === 'TRENTINO-ALTO ADIGE' || u === 'TRENTINO ALTO-ADIGE' || u.includes('TRENTINO')) return 'TRENTINO-ALTO ADIGE';
        if (u === 'FRIULI' || u.includes('FRIULI')) return 'FRIULI-VENEZIA GIULIA';
        if (u.includes('VALLE') && u.includes('AOSTA')) return "VALLE D'AOSTA";
        if (u.includes('TOSCANA')) return 'TOSCANA';
        if (u.includes('VENETO') || u.includes('LUGANA')) return 'VENETO';
        if (u.includes('PUGLIA') || u.includes('TARANTO')) return 'PUGLIA';
        if (u.includes('BASILICATA') || u.includes('MATERA')) return 'BASILICATA';
        return u;
    }

    function countWinesByRegion(wineType) {
        const counts = {};
        const app = global.wineApp;
        const wines = (app && Array.isArray(app.wines)) ? app.wines : [];
        for (const w of wines) {
            if (wineType && wineType !== 'ALL' && app && typeof app.wineMatchesFamily === 'function') {
                if (!app.wineMatchesFamily(w, wineType)) continue;
            }
            const key = normalizeRegion(w.region);
            counts[key] = (counts[key] || 0) + 1;
        }
        return counts;
    }

    function renderFallbackItalyMap(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return null;

        let activeType = options.wineType || 'ALL';
        const onRegionSelect = options.onSelectRegion || function (regionId) {
            if (typeof global.showWinesListForRegion === 'function') {
                global.showWinesListForRegion(regionId, activeType === 'ALL' ? null : activeType);
            } else {
                const params = new URLSearchParams({ region: regionId });
                if (activeType && activeType !== 'ALL') params.set('type', activeType);
                global.location.href = `./wines.html?${params.toString()}`;
            }
        };

        container.innerHTML = '';
        container.classList.add('gca-svg-map-host');

        const wrapper = document.createElement('div');
        wrapper.className = 'gca-svg-map-wrapper';
        wrapper.innerHTML = `
            <div class="gca-svg-map-stage">
                <div class="gca-svg-map-header">
                    <span class="gca-svg-map-kicker">Interactive Cellar Atlas</span>
                    <span class="gca-svg-map-status" id="${containerId}-status">Select a region to explore its wines</span>
                </div>
                <svg class="gca-italy-svg" viewBox="20 20 490 595" role="img" aria-label="Interactive Wine Map of Italy">
                    <defs>
                        <radialGradient id="gcaSeaGlow-${containerId}" cx="50%" cy="48%" r="55%">
                            <stop offset="0%" stop-color="rgba(212, 175, 55, 0.08)" />
                            <stop offset="100%" stop-color="rgba(11, 10, 9, 0)" />
                        </radialGradient>
                        <filter id="gcaRegionShadow-${containerId}" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.55" />
                        </filter>
                    </defs>
                    <rect x="20" y="20" width="490" height="595" fill="url(#gcaSeaGlow-${containerId})" />
                    <g class="gca-italy-regions-group" filter="url(#gcaRegionShadow-${containerId})"></g>
                    <g class="gca-italy-labels-group"></g>
                </svg>
                <div class="gca-svg-tooltip" id="${containerId}-tooltip" aria-hidden="true"></div>
            </div>
            <div class="gca-region-quicklist" id="${containerId}-quicklist"></div>
        `;
        container.appendChild(wrapper);

        const regionsGroup = wrapper.querySelector('.gca-italy-regions-group');
        const labelsGroup = wrapper.querySelector('.gca-italy-labels-group');
        const tooltip = wrapper.querySelector(`#${containerId}-tooltip`);
        const statusEl = wrapper.querySelector(`#${containerId}-status`);
        const quicklist = wrapper.querySelector(`#${containerId}-quicklist`);

        const svgNS = 'http://www.w3.org/2000/svg';

        function draw(wineType) {
            activeType = wineType || 'ALL';
            const palette = FAMILY_COLORS[activeType] || FAMILY_COLORS.ALL;
            const counts = countWinesByRegion(activeType);
            const maxCount = Math.max(1, ...Object.values(counts));
            const totalWines = Object.values(counts).reduce((a, b) => a + b, 0);

            if (statusEl) {
                statusEl.textContent = totalWines > 0
                    ? `${palette.name} • ${totalWines} selections across ${Object.keys(counts).length} regions`
                    : 'Select a region to explore its wines';
            }

            regionsGroup.innerHTML = '';
            labelsGroup.innerHTML = '';

            ITALY_REGIONS.forEach((reg) => {
                const count = counts[reg.id] || 0;
                const intensity = count > 0 ? 0.35 + 0.65 * Math.sqrt(count / maxCount) : 0;

                const poly = document.createElementNS(svgNS, 'polygon');
                poly.setAttribute('points', reg.points);
                poly.setAttribute('data-region', reg.id);
                poly.setAttribute('tabindex', count > 0 ? '0' : '-1');
                poly.setAttribute('role', 'button');
                poly.setAttribute('aria-label', `${reg.label}: ${count} wines`);
                poly.classList.add('gca-svg-region');
                if (count > 0) {
                    poly.classList.add('has-wines');
                    poly.style.fill = palette.active;
                    poly.style.fillOpacity = String(Math.min(0.92, Math.max(0.28, intensity * 0.78)));
                    poly.style.stroke = '#E6C873';
                } else {
                    poly.classList.add('no-wines');
                    poly.style.fill = '#181614';
                    poly.style.fillOpacity = '0.75';
                    poly.style.stroke = 'rgba(212, 175, 55, 0.16)';
                }

                const showTip = (ev) => {
                    if (!tooltip) return;
                    tooltip.innerHTML = `
                        <div class="gca-tip-name">${reg.label}</div>
                        <div class="gca-tip-count">${count} ${count === 1 ? 'wine' : 'wines'}</div>
                    `;
                    tooltip.classList.add('visible');
                    tooltip.setAttribute('aria-hidden', 'false');
                    if (ev && ev.clientX) {
                        const rect = wrapper.querySelector('.gca-svg-map-stage').getBoundingClientRect();
                        const x = Math.min(rect.width - 170, Math.max(12, ev.clientX - rect.left + 14));
                        const y = Math.min(rect.height - 64, Math.max(12, ev.clientY - rect.top - 16));
                        tooltip.style.left = `${x}px`;
                        tooltip.style.top = `${y}px`;
                    }
                };
                const hideTip = () => {
                    if (!tooltip) return;
                    tooltip.classList.remove('visible');
                    tooltip.setAttribute('aria-hidden', 'true');
                };

                poly.addEventListener('mouseenter', showTip);
                poly.addEventListener('mousemove', showTip);
                poly.addEventListener('mouseleave', hideTip);
                poly.addEventListener('click', () => {
                    if (count > 0 || totalWines === 0) onRegionSelect(reg.id);
                });
                poly.addEventListener('keydown', (e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && (count > 0 || totalWines === 0)) {
                        e.preventDefault();
                        onRegionSelect(reg.id);
                    }
                });
                regionsGroup.appendChild(poly);

                if (count > 0) {
                    const text = document.createElementNS(svgNS, 'text');
                    text.setAttribute('x', String(reg.lx));
                    text.setAttribute('y', String(reg.ly));
                    text.setAttribute('text-anchor', 'middle');
                    text.classList.add('gca-svg-region-label');
                    text.textContent = reg.short;
                    labelsGroup.appendChild(text);

                    const badge = document.createElementNS(svgNS, 'text');
                    badge.setAttribute('x', String(reg.lx));
                    badge.setAttribute('y', String(reg.ly + 11));
                    badge.setAttribute('text-anchor', 'middle');
                    badge.classList.add('gca-svg-region-count');
                    badge.textContent = String(count);
                    labelsGroup.appendChild(badge);
                }
            });

            if (quicklist) {
                const sorted = ITALY_REGIONS
                    .map(r => ({ ...r, count: counts[r.id] || 0 }))
                    .filter(r => r.count > 0)
                    .sort((a, b) => b.count - a.count);

                quicklist.innerHTML = `
                    <div class="gca-quicklist-title">Regions (${sorted.length})</div>
                    <div class="gca-quicklist-items">
                        ${sorted.map(r => `
                            <button type="button" class="gca-quicklist-pill" data-region="${r.id.replace(/"/g, '&quot;')}">
                                <span class="gca-pill-name">${r.label}</span>
                                <span class="gca-pill-count">${r.count}</span>
                            </button>
                        `).join('')}
                    </div>
                `;
                quicklist.querySelectorAll('.gca-quicklist-pill').forEach(btn => {
                    btn.addEventListener('click', () => onRegionSelect(btn.dataset.region));
                    btn.addEventListener('mouseenter', () => {
                        const target = regionsGroup.querySelector(`[data-region="${CSS.escape(btn.dataset.region)}"]`);
                        if (target) target.classList.add('is-hovered');
                    });
                    btn.addEventListener('mouseleave', () => {
                        const target = regionsGroup.querySelector(`[data-region="${CSS.escape(btn.dataset.region)}"]`);
                        if (target) target.classList.remove('is-hovered');
                    });
                });
            }
        }

        draw(activeType);

        return {
            updateWineType: draw,
            refresh: () => draw(activeType)
        };
    }

    global.GCAItalySvgMap = {
        render: renderFallbackItalyMap,
        regions: ITALY_REGIONS
    };
})(window);
