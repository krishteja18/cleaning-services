/* ==========================================================================
   MW CLEANING SERVICE - PREMIUM LOGIC, WIZARDS, CALCULATORS, & UX EFFECTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. GLOBAL UI CONSTANTS & ELEMENTS ---
    const mainHeader = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu-container');
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastIconBox = document.getElementById('toast-icon-box');

    // --- 2. HEADER SCROLL & MOBILE NAVIGATION ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.remove('header-transparent');
            mainHeader.classList.add('header-scrolled');
        } else {
            mainHeader.classList.remove('header-scrolled');
            mainHeader.classList.add('header-transparent');
        }
        highlightActiveNavOnScroll();
    });

    // Mobile Hamburger Actions
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        const bars = mobileToggle.querySelectorAll('.bar');
        if (mobileToggle.classList.contains('active')) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu on clicking links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            const bars = mobileToggle.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            mobileMenu.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });

    // IntersectionObserver for active navigation highlight on scroll
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveNavOnScroll() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // --- 3. INTERACTIVE SERVICES SHOWCASE TAB SWITCHER ---
    const serviceTabs = document.querySelectorAll('.service-tab-btn');
    const servicePanels = document.querySelectorAll('.service-panel');

    serviceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Set tabs inactive
            serviceTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            // Show matching panel
            servicePanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const targetPanel = document.getElementById(tab.getAttribute('data-target'));
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Set panel selections directly to the Booking wizard when "Select Service" clicked
    const panelCtaButtons = document.querySelectorAll('.panel-cta');
    panelCtaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.service-panel');
            const panelId = panel.getAttribute('id');
            const bookingSelect = document.getElementById('booking-type');
            
            if (panelId.includes('residential')) bookingSelect.value = 'residential';
            else if (panelId.includes('deep')) bookingSelect.value = 'deep';
            else if (panelId.includes('moving')) bookingSelect.value = 'moving';
            else if (panelId.includes('commercial')) bookingSelect.value = 'commercial';
            
            // Trigger synchronization
            bookingSelect.dispatchEvent(new Event('change'));
        });
    });

    // --- 4. BEFORE / AFTER TRANSFORMATION IMAGE SLIDER ---
    const sliderContainer = document.getElementById('before-after-slider');
    const afterImage = document.getElementById('after-image-container');
    const sliderHandle = document.getElementById('slider-handle');

    if (sliderContainer && afterImage && sliderHandle) {
        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            const x = clientX - rect.left;
            let percentage = (x / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            // Apply style updates using modern clip-path to prevent image squishing/distortion
            afterImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            sliderHandle.style.left = `${percentage}%`;
        };

        // Event listeners for dragging (Mouse, Touch, and Pointer)
        const startDragging = () => {
            isDragging = true;
            sliderHandle.classList.add('active');
        };

        const stopDragging = () => {
            isDragging = false;
            sliderHandle.classList.remove('active');
        };

        const onDragMove = (e) => {
            if (!isDragging) return;
            // Support both touch and mouse coords
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSlider(clientX);
        };

        // Mouse Triggers
        sliderHandle.addEventListener('mousedown', startDragging);
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('mousemove', onDragMove);

        // Touch Triggers for mobile
        sliderHandle.addEventListener('touchstart', startDragging);
        window.addEventListener('touchend', stopDragging);
        window.addEventListener('touchmove', onDragMove);

        // Simple click anywhere on container moves the slider instantly
        sliderContainer.addEventListener('click', (e) => {
            if (e.target.closest('#slider-handle')) return; // Avoid double triggering on handle
            updateSlider(e.clientX);
        });
    }

    // --- 5. INTERACTIVE COST ESTIMATOR & PRICE CALCULATOR ---
    const cleanTypeSelect = document.getElementById('clean-type');
    const bedroomsInput = document.getElementById('bedrooms');
    const bathroomsInput = document.getElementById('bathrooms');
    const homeSizeInput = document.getElementById('home-size');
    const homeSizeVal = document.getElementById('home-size-val');
    const freqButtons = document.querySelectorAll('.freq-btn');
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox');

    // Estimator Output elements
    const summaryPlan = document.getElementById('summary-plan');
    const summaryRooms = document.getElementById('summary-rooms');
    const summaryTime = document.getElementById('summary-time');
    const discountRow = document.getElementById('discount-row');
    const summaryDiscount = document.getElementById('summary-discount');
    const calculatedPrice = document.getElementById('calculated-price');
    const pricingPeriod = document.getElementById('pricing-period');

    // Sticky mobile price bar elements
    const mobileStickyBar = document.getElementById('mobile-sticky-bar');
    const stickyPriceVal = document.getElementById('sticky-price-val');
    const stickyPlanName = document.getElementById('sticky-plan-name');
    const stickyPeriodVal = document.getElementById('sticky-period-val');
    const stickyBookBtn = document.getElementById('sticky-book-btn');

    let currentFreq = 'weekly'; // default frequency selection

    // Service pricing parameters
    const serviceTiers = {
        residential: { name: 'Residential Routine', baseRate: 35, timeCoeff: 450 },
        deep: { name: 'Deep Sanitization', baseRate: 50, timeCoeff: 350 },
        moving: { name: 'Relocation Suite', baseRate: 60, timeCoeff: 300 },
        commercial: { name: 'Corporate Suite', baseRate: 55, timeCoeff: 400 }
    };

    const frequencies = {
        once: { discount: 0, label: 'Single visit' },
        weekly: { discount: 0.20, label: '/ visit (Weekly)' },
        biweekly: { discount: 0.15, label: '/ visit (Bi-Weekly)' },
        monthly: { discount: 0.10, label: '/ visit (Monthly)' }
    };

    // Range Slider background track filling updates
    const updateRangeTrack = (slider) => {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        const track = slider.parentElement.querySelector('.range-track-bg');
        if (track) {
            track.style.width = `${value}%`;
        }
    };

    if (homeSizeInput) {
        updateRangeTrack(homeSizeInput);
        homeSizeInput.addEventListener('input', (e) => {
            homeSizeVal.textContent = `${Number(e.target.value).toLocaleString()} sq.ft`;
            updateRangeTrack(e.target);
            calculateEstimate();
        });
    }

    // Counter inputs handles (Bedroom & Bathroom)
    const counterButtons = document.querySelectorAll('.counter-control button');
    counterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            
            if (input) {
                let val = parseFloat(input.value);
                let step = parseFloat(input.getAttribute('step')) || 1;
                let min = parseFloat(input.getAttribute('min')) || 1;
                let max = parseFloat(input.getAttribute('max')) || 10;
                
                if (action === 'plus' && val < max) {
                    val += step;
                } else if (action === 'minus' && val > min) {
                    val -= step;
                }
                
                input.value = val;
                calculateEstimate();
            }
        });
    });

    // Frequency toggle buttons
    freqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            freqButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFreq = btn.getAttribute('data-freq');
            calculateEstimate();
        });
    });

    // Recalculate whenever inputs change
    if (cleanTypeSelect) cleanTypeSelect.addEventListener('change', calculateEstimate);
    addonCheckboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));

    function calculateEstimate() {
        if (!cleanTypeSelect) return;

        const selectedType = cleanTypeSelect.value;
        const bedrooms = parseInt(bedroomsInput.value) || 2;
        const bathrooms = parseFloat(bathroomsInput.value) || 1.5;
        const sizeSqFt = parseInt(homeSizeInput.value) || 1200;
        
        const tier = serviceTiers[selectedType];
        
        // 1. Calculate Base Time Needed (size based, modulated by room configs)
        let baseHours = sizeSqFt / tier.timeCoeff;
        
        // Adjust hours: add 0.4 hrs per extra bedroom (above 1)
        baseHours += (bedrooms - 1) * 0.4;
        // Adjust hours: add 0.6 hrs per extra bathroom (above 1)
        baseHours += (bathrooms - 1) * 0.6;
        
        // Time floor (minimum 2 hours)
        if (baseHours < 2) baseHours = 2;
        
        // 2. Base clean rate cost
        let cleanCost = baseHours * tier.baseRate;

        // 3. Bespoke Add-on Costs
        let addonsCost = 0;
        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                addonsCost += parseFloat(cb.getAttribute('data-price')) || 0;
            }
        });

        // Total raw cost before frequency discount
        const subtotalCost = cleanCost + addonsCost;
        
        // 4. Frequency Discount Calculations
        const freqInfo = frequencies[currentFreq];
        const discountAmount = subtotalCost * freqInfo.discount;
        const finalCost = Math.round(subtotalCost - discountAmount);

        // --- UPDATE OUTPUT INTERFACES ---
        summaryPlan.textContent = tier.name;
        summaryRooms.textContent = `${bedrooms} Bed, ${bathrooms} Bath`;
        summaryTime.textContent = `${baseHours.toFixed(1)} hrs`;
        
        // Discount visual feedback
        if (freqInfo.discount > 0) {
            discountRow.style.display = 'flex';
            summaryDiscount.textContent = `-${freqInfo.discount * 100}% (-$${discountAmount.toFixed(2)})`;
        } else {
            discountRow.style.display = 'none';
        }

        // Animate price updates beautifully
        if (calculatedPrice.textContent !== String(finalCost)) {
            calculatedPrice.classList.add('pulse');
            setTimeout(() => {
                calculatedPrice.textContent = finalCost;
                calculatedPrice.classList.remove('pulse');
            }, 150);
        }
        
        pricingPeriod.textContent = freqInfo.label;

        // Synchronize values to Mobile/Tablet Sticky Bottom Bar
        if (stickyPriceVal) {
            stickyPriceVal.textContent = finalCost;
            stickyPlanName.textContent = tier.name;
            stickyPeriodVal.textContent = freqInfo.label.replace('/ visit', '').trim();
        }
    }

    // Initialize Estimator
    if (cleanTypeSelect) {
        calculateEstimate();
    }

    // --- 6. COST ESTIMATOR SYNC WITH BOOKING WIZARD ---
    const calcBookBtn = document.getElementById('calc-book-btn');
    
    const syncEstimatorToWizard = () => {
        // Gather values from Estimator
        const estType = cleanTypeSelect.value;
        const estBedrooms = bedroomsInput.value;
        const estBathrooms = bathroomsInput.value;
        const estSize = homeSizeInput.value;
        
        // Sync values to Wizard controls
        document.getElementById('booking-type').value = estType;
        document.getElementById('booking-frequency').value = currentFreq;
        document.getElementById('booking-bedrooms').value = estBedrooms;
        document.getElementById('booking-bathrooms').value = estBathrooms;
        document.getElementById('booking-size').value = estSize;
        
        // Sync selected addon checkboxes
        const wizardAddons = document.querySelectorAll('.wizard-addon-checkbox');
        wizardAddons.forEach(wCheckbox => {
            const valueName = wCheckbox.value;
            const calcCheckbox = Array.from(addonCheckboxes).find(cb => cb.value === valueName);
            if (calcCheckbox) {
                wCheckbox.checked = calcCheckbox.checked;
                // Trigger styles classes of containing cards
                const parentCard = wCheckbox.closest('.addon-card');
                if (parentCard) {
                    if (wCheckbox.checked) {
                        parentCard.style.borderColor = 'var(--color-primary)';
                        parentCard.style.backgroundColor = 'var(--color-primary-glow)';
                    } else {
                        parentCard.style.borderColor = 'var(--neutral-border)';
                        parentCard.style.backgroundColor = 'var(--white)';
                    }
                }
            }
        });

        // Smooth scroll to the Booking Wizard section
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        
        // Highlight step indicator
        showNotification('Clean Synced!', 'Estimator pricing and specifications have been transferred to your booking details below.', 'success');
    };

    if (calcBookBtn) {
        calcBookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            syncEstimatorToWizard();
        });
    }

    if (stickyBookBtn) {
        stickyBookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            syncEstimatorToWizard();
        });
    }

    // Scroll trigger to show/hide Mobile Sticky Bottom Bar when passing Estimator section
    window.addEventListener('scroll', () => {
        if (!mobileStickyBar) return;
        
        const estimatorSection = document.getElementById('estimator');
        if (estimatorSection && window.innerWidth < 1024) {
            const rect = estimatorSection.getBoundingClientRect();
            const bookingSection = document.getElementById('booking');
            const bookingRect = bookingSection ? bookingSection.getBoundingClientRect() : null;

            // Show sticky bar once Estimator enters viewport, hide when Booking section is fully visible
            if (rect.top <= window.innerHeight - 150 && (!bookingRect || bookingRect.top > window.innerHeight - 100)) {
                mobileStickyBar.classList.add('show');
            } else {
                mobileStickyBar.classList.remove('show');
            }
        } else {
            mobileStickyBar.classList.remove('show');
        }
    });

    // Styling handler for wizard addons checkboxes
    const wizardAddons = document.querySelectorAll('.wizard-addon-checkbox');
    wizardAddons.forEach(wCheckbox => {
        wCheckbox.addEventListener('change', () => {
            const parentCard = wCheckbox.closest('.addon-card');
            if (parentCard) {
                if (wCheckbox.checked) {
                    parentCard.style.borderColor = 'var(--color-primary)';
                    parentCard.style.backgroundColor = 'var(--color-primary-glow)';
                } else {
                    parentCard.style.borderColor = 'var(--neutral-border)';
                    parentCard.style.backgroundColor = 'var(--white)';
                }
            }
        });
    });

    // --- 7. BOOKING STEP-BY-STEP WIZARD FORM LOGIC ---
    const wizardForm = document.getElementById('booking-wizard-form');
    const wizardPanels = document.querySelectorAll('.wizard-panel');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBarFill = document.getElementById('wizard-progress-bar');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    let currentStep = 1;

    // Handle next button actions
    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetStep = parseInt(btn.getAttribute('data-next'));
            if (validateWizardStep(currentStep)) {
                goToWizardStep(targetStep);
            }
        });
    });

    // Handle previous button actions
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetStep = parseInt(btn.getAttribute('data-prev'));
            goToWizardStep(targetStep);
        });
    });

    function goToWizardStep(stepNum) {
        if (stepNum < 1 || stepNum > 3) return;
        
        // Hide all panels
        wizardPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Show target panel
        const targetPanel = document.querySelector(`.wizard-panel[data-panel="${stepNum}"]`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        // Update progress step indicators classes
        progressSteps.forEach(step => {
            const stepVal = parseInt(step.getAttribute('data-step'));
            step.classList.remove('active', 'complete');
            
            if (stepVal === stepNum) {
                step.classList.add('active');
            } else if (stepVal < stepNum) {
                step.classList.add('complete');
            }
        });

        // Set Progress bar fill percentage (0%, 50%, 100%)
        const progressPercent = ((stepNum - 1) / 2) * 100;
        progressBarFill.style.width = `${progressPercent}%`;
        
        currentStep = stepNum;
        
        // Scroll wizard card header into view nicely on mobile
        document.querySelector('.booking-wizard-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Step verification validation logic
    function validateWizardStep(stepNum) {
        let isValid = true;
        const currentPanel = document.querySelector(`.wizard-panel[data-panel="${stepNum}"]`);
        const requiredElements = currentPanel.querySelectorAll('[required]');

        requiredElements.forEach(el => {
            let itemValid = true;

            // Handle standard text, email, number inputs
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                if (!el.value.trim()) {
                    itemValid = false;
                }
                
                // Specific Email structures match
                if (el.type === 'email' && el.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(el.value.trim())) {
                        itemValid = false;
                    }
                }

                // Size bounds checking
                if (el.id === 'booking-size' && (parseInt(el.value) < 100 || isNaN(parseInt(el.value)))) {
                    itemValid = false;
                }

                // Date is in the future
                if (el.type === 'date' && el.value) {
                    const selectedDate = new Date(el.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                        itemValid = false;
                    }
                }
                
                // Checkbox Agree
                if (el.type === 'checkbox' && !el.checked) {
                    itemValid = false;
                }
            }

            const formGroup = el.closest('.form-group') || el.closest('.terms-accept');
            if (!itemValid) {
                isValid = false;
                if (formGroup) {
                    formGroup.classList.add('has-error');
                }
                if (el.id === 'terms-agree') {
                    document.getElementById('terms-error').style.display = 'block';
                }
            } else {
                if (formGroup) {
                    formGroup.classList.remove('has-error');
                }
                if (el.id === 'terms-agree') {
                    document.getElementById('terms-error').style.display = 'none';
                }
            }
        });

        return isValid;
    }

    // Submit Action Final Validation & Success Toast Dialog Triggering
    if (wizardForm) {
        wizardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateWizardStep(3)) {
                // Collect Customer Data to personalize Success Toast
                const clientName = document.getElementById('booking-name').value.trim();
                const selectedDate = document.getElementById('booking-date').value;
                const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                // Trigger dazzling success notification
                showNotification(
                    'Pristine Clean Booked!', 
                    `Salutations, ${clientName}! Your luxury sanitization appointment on ${formattedDate} is certified locked-in. Concierge email dispatched.`, 
                    'success'
                );

                // Reset Wizard
                wizardForm.reset();
                
                // Remove unchecked styling from all checkbox cards
                const addonCards = document.querySelectorAll('.addon-card');
                addonCards.forEach(card => {
                    card.style.borderColor = 'var(--neutral-border)';
                    card.style.backgroundColor = 'var(--white)';
                });

                // Bounce back step 1
                goToWizardStep(1);
            } else {
                showNotification('Details Needed', 'Please audit highlighted fields to conclude your appointment reservations.', 'error');
            }
        });
    }

    // --- 8. TESTIMONIALS AUTOPLAY CAROUSEL SLIDER ---
    const testimonialsTrack = document.getElementById('testimonial-track');
    const dots = document.querySelectorAll('.dot');
    let activeTestimonialIndex = 0;
    let autoplayInterval;

    if (testimonialsTrack && dots.length > 0) {
        const updateTestimonials = (index) => {
            testimonialsTrack.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            activeTestimonialIndex = index;
        };

        // Dots trigger actions
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-index'));
                updateTestimonials(targetIdx);
                resetAutoplay();
            });
        });

        // Autoplay sequence logic
        const startAutoplay = () => {
            autoplayInterval = setInterval(() => {
                let nextIdx = activeTestimonialIndex + 1;
                if (nextIdx >= dots.length) {
                    nextIdx = 0;
                }
                updateTestimonials(nextIdx);
            }, 6000);
        };

        const resetAutoplay = () => {
            clearInterval(autoplayInterval);
            startAutoplay();
        };

        startAutoplay();
    }

    // --- 9. NEWSLETTER SUBSCRIPTION FORM VALIDATION ---
    const newsForm = document.getElementById('newsletter-form');
    if (newsForm) {
        newsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const emailVal = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailVal || !emailRegex.test(emailVal)) {
                newsForm.classList.add('has-error');
            } else {
                newsForm.classList.remove('has-error');
                showNotification(
                    'Exclusive Access Unlocked!', 
                    'You are added to the list. Impeccable seasonal guides and luxury coupon rates are heading your way.', 
                    'success'
                );
                emailInput.value = '';
            }
        });
    }

    // --- 10. DYNAMIC TOAST NOTIFICATION UTILITY ---
    function showNotification(title, message, type = 'success') {
        // Configure toast details
        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Configure Icons & colors
        if (type === 'success') {
            toastIconBox.className = 'toast-icon';
            toastIconBox.innerHTML = '<i class="fa-solid fa-sparkles"></i>';
            toastIconBox.style.backgroundColor = 'var(--color-secondary-light)';
            toastIconBox.style.color = 'var(--color-secondary)';
        } else {
            toastIconBox.className = 'toast-icon error';
            toastIconBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
            toastIconBox.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            toastIconBox.style.color = '#ef4444';
        }

        // Show Toast
        toast.classList.add('show');

        // Automatic dismiss after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
});
