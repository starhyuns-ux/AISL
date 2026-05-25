document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. SCROLL REVEAL EFFECT (INTERSECTION OBSERVER)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Specific trigger for SVG path animation when chart becomes visible
                    if (entry.target.id === 'crisis-chart-card') {
                        const path = document.getElementById('chart-line-path');
                        if (path) {
                            path.style.strokeDashoffset = '0';
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
        const path = document.getElementById('chart-line-path');
        if (path) path.style.strokeDashoffset = '0';
    }

    /* ==========================================================================
       2. HEADER SCROLL CLASS TOGGLE
       ========================================================================== */
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       3. 5-YEAR ELECTRICITY surGE SVG CHART INTERACTION
       ========================================================================== */
    const chartBars = document.querySelectorAll('.chart-bar');
    const chartPoints = document.querySelectorAll('.chart-point');
    const chartTooltip = document.getElementById('chart-tooltip');
    const svgChart = document.getElementById('svg-chart');
    
    // Prepare the line animation dasharray
    const path = document.getElementById('chart-line-path');
    if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    function showTooltip(e, element) {
        const year = element.getAttribute('data-year');
        const val = element.getAttribute('data-val');
        const desc = element.getAttribute('data-desc');
        
        chartTooltip.querySelector('.tooltip-year').textContent = `${year}년`;
        chartTooltip.querySelector('.tooltip-value').textContent = `지수: ${val}% (19년 기준)`;
        chartTooltip.querySelector('.tooltip-desc').textContent = desc;
        
        chartTooltip.style.opacity = '1';
        
        // Position calculation within container
        const rect = svgChart.getBoundingClientRect();
        const tooltipWidth = chartTooltip.offsetWidth;
        const tooltipHeight = chartTooltip.offsetHeight;
        
        let x = e.clientX - rect.left + 15;
        let y = e.clientY - rect.top - tooltipHeight - 15;
        
        // Boundary checks
        if (x + tooltipWidth > rect.width) {
            x = e.clientX - rect.left - tooltipWidth - 15;
        }
        if (y < 0) {
            y = e.clientY - rect.top + 15;
        }
        
        chartTooltip.style.left = `${x}px`;
        chartTooltip.style.top = `${y}px`;
    }

    function hideTooltip() {
        chartTooltip.style.opacity = '0';
    }

    chartBars.forEach(bar => {
        bar.addEventListener('mouseenter', (e) => showTooltip(e, bar));
        bar.addEventListener('mousemove', (e) => showTooltip(e, bar));
        bar.addEventListener('mouseleave', hideTooltip);
    });

    chartPoints.forEach(point => {
        point.addEventListener('mouseenter', (e) => showTooltip(e, point));
        point.addEventListener('mousemove', (e) => showTooltip(e, point));
        point.addEventListener('mouseleave', hideTooltip);
    });

    /* ==========================================================================
       4. PRODUCT LINEUP TABS SWITCHER
       ========================================================================== */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.product-tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active states
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            
            // Add active state to current tab
            btn.classList.add('active');
            const activeContent = document.getElementById(targetTab);
            if (activeContent) {
                activeContent.style.display = 'block';
                // Trigger reflow for fade animation
                setTimeout(() => {
                    activeContent.classList.add('active');
                }, 10);
            }
        });
    });

    /* ==========================================================================
       5. SUCCESS STORIES CAROUSEL SLIDER (AUTO-PLAYING & MANUAL CONTROLS)
       ========================================================================== */
    const sliderWrapper = document.getElementById('slider-wrapper');
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');
    const sliderContainer = document.getElementById('cases-slider-container');
    
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoPlayInterval;
    
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = slideCount - 1;
        } else if (index >= slideCount) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        
        // Slide animation
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Event listeners for controls
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });
    
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            goToSlide(idx);
            resetAutoPlay();
        });
    });
    
    // Auto play functions
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 6000); // changes every 6 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Mouse hover pause interaction
    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);
    
    // Initialize auto play
    startAutoPlay();

    /* ==========================================================================
       6. INTERACTIVE ESCO SAVINGS SIMULATION CALCULATOR
       ========================================================================== */
    const inputBill = document.getElementById('input-electric-bill');
    const inputRate = document.getElementById('input-replacement-rate');
    
    const textBill = document.getElementById('text-electric-bill');
    const textRate = document.getElementById('text-replacement-rate');
    
    const valYearlySaving = document.getElementById('val-yearly-saving');
    const valCo2Reduction = document.getElementById('val-co2-reduction');
    const valTreeCount = document.getElementById('val-tree-count');

    // Number formatting helper (e.g., 450 -> '450 만원', 10500 -> '1억 500 만원')
    function formatCurrencyKorean(valueTenThousand) {
        if (valueTenThousand >= 10000) {
            const eok = Math.floor(valueTenThousand / 10000);
            const remainder = valueTenThousand % 10000;
            if (remainder === 0) {
                return `${eok} 억 원`;
            } else {
                return `${eok}억 ${remainder.toLocaleString()} 만 원`;
            }
        }
        return `${valueTenThousand.toLocaleString()} 만 원`;
    }

    function calculateSavings() {
        const bill = parseFloat(inputBill.value); // current annual bill in Ten-Thousand KRW
        const rate = parseFloat(inputRate.value) / 100; // replacement rate decimal (e.g. 0.8)
        
        // 3rd Gen AI LED saves 50% power compared to legacy lighting.
        // Formula: Saving = CurrentBill * 50% * ReplacementRatio
        const yearlySavingsTenThousand = Math.round(bill * 0.5 * rate);
        
        // Carbon reduction calculation
        // 1 Ten-Thousand KRW corresponds to approx. 66.6 kWh (assuming B2B rate 150 KRW/kWh)
        // 1 kWh = 0.466 kg CO2 emission
        // Carbon emission saved in metric tons = Savings in KRW / 150 * 0.466 / 1000
        // Simplification factor: Savings in Ten-Thousand KRW * 10,000 / 150 * 0.466 / 1000 = Saving * 0.031
        const co2ReductionTons = (yearlySavingsTenThousand * 0.031).toFixed(1);
        
        // Tree planting conversion
        // 1 30-year-old pine tree absorbs 6.6 kg of CO2 per year.
        // Tree count = Carbon reduction in kg / 6.6
        // Carbon reduction in kg = co2ReductionTons * 1000
        const treeCount = Math.round((parseFloat(co2ReductionTons) * 1000) / 6.6);
        
        // Update display numbers with gorgeous smooth text roll / direct update
        textBill.textContent = `${bill.toLocaleString()} 만원`;
        textRate.textContent = `${Math.round(rate * 100)} %`;
        
        valYearlySaving.textContent = formatCurrencyKorean(yearlySavingsTenThousand);
        valCo2Reduction.textContent = `${parseFloat(co2ReductionTons).toLocaleString()} 톤 (tCO₂)`;
        valTreeCount.textContent = `${treeCount.toLocaleString()} 그루`;
        
        // Dynamic feedback to hero showcase ring as a subtle highlight!
        const mockupSavedText = document.getElementById('mockup-saved-text');
        if (mockupSavedText) {
            const savedPercentage = Math.round(50 * rate);
            mockupSavedText.textContent = `${savedPercentage}% +`;
        }
    }

    // Attach listeners
    inputBill.addEventListener('input', calculateSavings);
    inputRate.addEventListener('input', calculateSavings);
    
    // Initial triggering
    calculateSavings();

    /* ==========================================================================
       7. B2B CONSULTATION FORM VALIDATION & SUCCESS FEEDBACK
       ========================================================================== */
    const consultForm = document.getElementById('consult-form');
    
    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const company = document.getElementById('form-company').value;
            
            // Premium glassmorphic success overlay modal trigger
            const successOverlay = document.createElement('div');
            successOverlay.style.position = 'fixed';
            successOverlay.style.top = '0';
            successOverlay.style.left = '0';
            successOverlay.style.width = '100vw';
            successOverlay.style.height = '100vh';
            successOverlay.style.backgroundColor = 'rgba(8, 9, 12, 0.9)';
            successOverlay.style.backdropFilter = 'blur(20px)';
            successOverlay.style.webkitBackdropFilter = 'blur(20px)';
            successOverlay.style.zIndex = '999';
            successOverlay.style.display = 'flex';
            successOverlay.style.justifyContent = 'center';
            successOverlay.style.alignItems = 'center';
            successOverlay.style.opacity = '0';
            successOverlay.style.transition = 'opacity 0.4s ease';
            
            successOverlay.innerHTML = `
                <div class="glass-card" style="padding: 50px; max-width: 500px; text-align: center; border-color: rgba(0, 255, 102, 0.3); box-shadow: 0 0 30px rgba(0, 255, 102, 0.2);">
                    <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(0, 255, 102, 0.1); border: 2px solid var(--neon-green); display: flex; justify-content: center; align-items: center; margin: 0 auto 24px auto; color: var(--neon-green); box-shadow: var(--shadow-neon-green);">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 style="font-size: 24px; margin-bottom: 12px; font-weight: 700;">제안 신청 완료</h3>
                    <p style="color: var(--text-secondary); font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                        감사합니다, <strong>${name}</strong>님!<br>
                        <strong>${company}</strong>의 3세대 AI 스마트 LED ESCO 도입 정밀 가치 제안서 신청이 안전하게 접수되었습니다. 24시간 이내에 담당 분석 전문가가 신속하게 연락드리겠습니다.
                    </p>
                    <button class="btn-primary" id="btn-close-modal" style="width: 100%; border-radius: 8px;">확인</button>
                </div>
            `;
            
            document.body.appendChild(successOverlay);
            
            // Trigger animation
            setTimeout(() => {
                successOverlay.style.opacity = '1';
            }, 10);
            
            // Close event handler
            const closeBtn = successOverlay.querySelector('#btn-close-modal');
            closeBtn.addEventListener('click', () => {
                successOverlay.style.opacity = '0';
                setTimeout(() => {
                    successOverlay.remove();
                }, 400);
                
                // Clear the form
                consultForm.reset();
                calculateSavings(); // Re-sync sliders
            });
        });
    }

});
