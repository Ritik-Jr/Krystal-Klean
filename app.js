/**
 * Krystal Klean Coventry - Dynamic Controller & Data Engine
 * Loads and binds data from data.json with fallback support
 */

// Global State
let siteData = null;

// Default In-Memory Pricing Data (Overrides immediately if data.json is loaded)
let pricingData = {
  tenancy: {
    name: 'End of Tenancy Cleaning',
    basePrices: {
      '1': { min: 120, max: 140 },
      '2': { min: 155, max: 185 },
      '3': { min: 195, max: 235 },
      '4': { min: 245, max: 295 },
      '5': { min: 310, max: 370 }
    },
    bathExtra: 25
  },
  deep: {
    name: 'Deep & Sparkle Clean',
    basePrices: {
      '1': { min: 140, max: 165 },
      '2': { min: 175, max: 210 },
      '3': { min: 215, max: 255 },
      '4': { min: 265, max: 315 },
      '5': { min: 330, max: 390 }
    },
    bathExtra: 30
  },
  domestic: {
    name: 'Regular Domestic Cleaning',
    basePrices: {
      '1': { min: 36, max: 45 },
      '2': { min: 45, max: 55 },
      '3': { min: 55, max: 70 },
      '4': { min: 72, max: 90 },
      '5': { min: 90, max: 115 }
    },
    bathExtra: 15
  },
  airbnb: {
    name: 'Airbnb & HMO Turnaround',
    basePrices: {
      '1': { min: 65, max: 80 },
      '2': { min: 85, max: 105 },
      '3': { min: 110, max: 135 },
      '4': { min: 140, max: 170 },
      '5': { min: 180, max: 220 }
    },
    bathExtra: 20
  },
  addons: {
    oven: { name: 'Oven Clean', price: 35 },
    carpet: { name: 'Carpet / Sofa Refresh', price: 45 },
    fridge: { name: 'Inside Fridge & Freezer', price: 25 },
    windows: { name: 'Interior Windows', price: 20 }
  }
};

// Default In-Memory Coverage Data (Overrides immediately if data.json is loaded)
let coverageData = {
  primaryHub: {
    name: 'Coventry City & CV6 Base',
    postcodes: ['CV1', 'CV2', 'CV3', 'CV4', 'CV5', 'CV6'],
    message: '✓ <strong>Confirmed:</strong> {postcode} is in our primary Coventry hub (Lavender Ave CV6). Same-week & short-notice slots open.'
  },
  surroundingAreas: {
    name: 'Surrounding Warwickshire & West Midlands Towns',
    postcodes: ['CV7', 'CV8', 'CV10', 'CV11', 'CV12', 'CV31', 'CV32', 'CV34'],
    message: '✓ <strong>Covered:</strong> We regularly service {postcode} (Kenilworth, Bedworth, Warwick, Leamington Spa & Nuneaton).'
  },
  outsideNotice: 'ℹ️ We primarily cover Coventry & Warwickshire. <a href="https://wa.me/447565333237?text=Hi%20Kim,%20do%20you%20cover%20{postcode}%3F" target="_blank" style="text-decoration: underline; font-weight: bold; color: inherit;">WhatsApp Kim to confirm your road &rarr;</a>'
};

let currentService = 'tenancy';

document.addEventListener('DOMContentLoaded', async () => {
  initScrollAnimations();
  initCalculator();
  initCoverageChecker();
  initFaqAccordion();
  initMobileMenu();
  updateCurrentYear();

  // Fetch and hydrate data from data.json
  await loadDataJson();
});

/* ==========================================================================
   Data Loader: Fetches data.json and populates all dynamic sections
   ========================================================================== */
async function loadDataJson() {
  try {
    const res = await fetch('data.json');
    if (res.ok) {
      siteData = await res.json();
      applyDataToSite(siteData);
    }
  } catch (err) {
    console.log('Running with built-in data configuration');
  }
}

function applyDataToSite(data) {
  // 1. Update Pricing configuration
  if (data.pricing) {
    pricingData = Object.assign({}, pricingData, data.pricing);
    recalculateQuote();
  }

  // 2. Update Coverage configuration
  if (data.coverage) {
    coverageData = Object.assign({}, coverageData, data.coverage);
  }

  // 3. Update Google Reviews Button URL
  if (data.business && data.business.googleMapsUrl) {
    const seeAllBtn = document.getElementById('seeAllReviewsBtn');
    if (seeAllBtn) {
      seeAllBtn.href = data.business.googleMapsUrl;
    }
  }

  // 4. Hydrate Customer Reviews if provided
  if (data.reviews && data.reviews.length > 0) {
    renderReviews(data.reviews);
  }

  // 5. Hydrate FAQ if provided
  if (data.faq && data.faq.length > 0) {
    renderFaq(data.faq);
  }

  // 6. Hydrate Facebook URLs dynamically
  if (data.business && data.business.facebookUrl) {
    const fbLinks = document.querySelectorAll('a[href*="facebook.com"]');
    fbLinks.forEach(link => {
      link.href = data.business.facebookUrl;
    });
  }

  // 7. Hydrate Logo images dynamically
  if (data.business && data.business.logo) {
    const logoImgs = document.querySelectorAll('.brand-logo-img');
    logoImgs.forEach(img => {
      img.src = data.business.logo;
    });
  }

  // 8. Hydrate Announcement Bar text dynamically
  if (data.business && data.business.announcement) {
    const marqueeItems = document.querySelectorAll('.marquee-item');
    marqueeItems.forEach(item => {
      item.textContent = data.business.announcement;
    });
  }

  // 9. Hydrate Google Map Embed iframe dynamically
  if (data.business && data.business.googleMapEmbedUrl) {
    const mapIframe = document.getElementById('googleMapIframe');
    if (mapIframe) {
      mapIframe.src = data.business.googleMapEmbedUrl;
    }
  }
}

/* ==========================================================================
   1. Apple-Style Scroll Reveal Animations
   ========================================================================== */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 60);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }
}

/* ==========================================================================
   2. Segmented Instant Quote Estimator
   ========================================================================== */
function initCalculator() {
  const segmentBtns = document.querySelectorAll('.segment-btn');
  const bedroomSelect = document.getElementById('bedroomSelect');
  const bathroomSelect = document.getElementById('bathroomSelect');
  const calcPostcode = document.getElementById('calcPostcode');
  const calcUrgency = document.getElementById('calcUrgency');
  const addonInputs = document.querySelectorAll('.addon-input');

  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentService = btn.dataset.service;
      recalculateQuote();
    });
  });

  if (bedroomSelect) bedroomSelect.addEventListener('change', recalculateQuote);
  if (bathroomSelect) bathroomSelect.addEventListener('change', recalculateQuote);
  if (calcPostcode) calcPostcode.addEventListener('input', recalculateQuote);
  if (calcUrgency) calcUrgency.addEventListener('change', recalculateQuote);
  addonInputs.forEach(input => input.addEventListener('change', recalculateQuote));

  recalculateQuote();
}

function recalculateQuote() {
  const bedroomSelect = document.getElementById('bedroomSelect');
  const bathroomSelect = document.getElementById('bathroomSelect');
  const calcPostcode = document.getElementById('calcPostcode');
  const calcUrgency = document.getElementById('calcUrgency');

  if (!bedroomSelect || !bathroomSelect) return;

  const beds = bedroomSelect.value;
  const baths = parseInt(bathroomSelect.value, 10);
  const postcode = (calcPostcode && calcPostcode.value.trim()) || 'CV6';
  const urgencySelect = calcUrgency ? calcUrgency.options[calcUrgency.selectedIndex].text : 'This Week';

  const sData = pricingData[currentService] || pricingData.tenancy;
  const base = (sData.basePrices && sData.basePrices[beds]) || { min: 120, max: 140 };

  let min = base.min;
  let max = base.max;

  // Additional bathrooms calculation (> 1)
  if (baths > 1) {
    const extraBaths = baths - 1;
    const bathExtraCost = sData.bathExtra || 25;
    min += extraBaths * bathExtraCost;
    max += extraBaths * bathExtraCost;
  }

  // Addons calculation from pricingData.addons
  const selectedAddons = [];
  const addonPrices = pricingData.addons || {
    oven: { price: 35 },
    carpet: { price: 45 },
    fridge: { price: 25 },
    windows: { price: 20 }
  };

  const addonOven = document.getElementById('addonOven');
  const addonCarpet = document.getElementById('addonCarpet');
  const addonFridge = document.getElementById('addonFridge');
  const addonWindows = document.getElementById('addonWindows');

  if (addonOven && addonOven.checked) {
    const p = addonPrices.oven ? addonPrices.oven.price : 35;
    min += p; max += p;
    selectedAddons.push(`Oven Clean (+£${p})`);
  }
  if (addonCarpet && addonCarpet.checked) {
    const p = addonPrices.carpet ? addonPrices.carpet.price : 45;
    min += p; max += p;
    selectedAddons.push(`Carpet/Sofa (+£${p})`);
  }
  if (addonFridge && addonFridge.checked) {
    const p = addonPrices.fridge ? addonPrices.fridge.price : 25;
    min += p; max += p;
    selectedAddons.push(`Inside Fridge (+£${p})`);
  }
  if (addonWindows && addonWindows.checked) {
    const p = addonPrices.windows ? addonPrices.windows.price : 20;
    min += p; max += p;
    selectedAddons.push(`Interior Windows (+£${p})`);
  }

  // Update UI Elements
  const priceDisplay = document.getElementById('estimatedPrice');
  const priceCaption = document.getElementById('priceCaption');
  const summaryService = document.getElementById('summaryService');
  const summaryRooms = document.getElementById('summaryRooms');
  const summaryAddons = document.getElementById('summaryAddons');
  const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');

  if (priceDisplay) priceDisplay.textContent = `${min} - ${max}`;
  if (priceCaption) {
    priceCaption.textContent = `${beds}-Bed / ${baths}-Bath ${sData.name}`;
  }
  if (summaryService) summaryService.textContent = sData.name;
  if (summaryRooms) summaryRooms.textContent = `${beds} Bed${beds > 1 ? 's' : ''}, ${baths} Bath${baths > 1 ? 's' : ''}`;
  if (summaryAddons) {
    summaryAddons.textContent = selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None';
  }

  // Pre-formatted WhatsApp Lead Link
  if (btnSendWhatsapp) {
    const waNumber = (siteData && siteData.business && siteData.business.whatsappNumber) || '447565333237';
    const waText = encodeURIComponent(
      `Hi Kim! I generated a quote on the Krystal Klean website:\n` +
      `• Service: ${sData.name}\n` +
      `• Property: ${beds} Bed, ${baths} Bath\n` +
      `• Add-ons: ${selectedAddons.length > 0 ? selectedAddons.join(', ') : 'None'}\n` +
      `• Postcode: ${postcode}\n` +
      `• Desired Timing: ${urgencySelect}\n` +
      `• Estimated Range: £${min} - £${max}\n\n` +
      `Could you please let me know your earliest availability? Thank you!`
    );
    btnSendWhatsapp.href = `https://wa.me/${waNumber}?text=${waText}`;
  }
}

// Global selector for Bento card buttons
window.selectServiceInCalc = function(serviceKey) {
  currentService = serviceKey;
  const targetBtn = document.querySelector(`.segment-btn[data-service="${serviceKey}"]`);
  if (targetBtn) {
    document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
    targetBtn.classList.add('active');
  }
  recalculateQuote();
};

/* ==========================================================================
   3. Reviews Category Filters & Dynamic Hydration
   ========================================================================== */
function renderReviews(reviews) {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  grid.innerHTML = reviews.map(r => `
    <div class="review-bento-card pastel-card fade-up visible" data-category="${r.category}">
      <div class="stars-gold">${'★'.repeat(r.stars || 5)}</div>
      <p class="r-quote">"${r.quote}"</p>
      <div class="r-author">
        <div class="r-avatar">${r.initials || 'KK'}</div>
        <div>
          <strong>${r.author}</strong>
          <span>${r.role}</span>
        </div>
      </div>
    </div>
  `).join('');

  initReviewFilters();
}

function initReviewFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const reviewCards = document.querySelectorAll('.review-bento-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;

      reviewCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Dynamic Postcode Checker (Reads lists directly from data.json)
   ========================================================================== */
function initCoverageChecker() {
  const btnCheckArea = document.getElementById('btnCheckArea');
  const areaCheckInput = document.getElementById('areaCheckInput');
  const areaResult = document.getElementById('areaResult');

  if (!btnCheckArea || !areaCheckInput || !areaResult) return;

  btnCheckArea.addEventListener('click', () => {
    const rawVal = areaCheckInput.value.trim().toUpperCase();
    if (!rawVal) {
      areaResult.className = 'postcode-feedback info';
      areaResult.textContent = 'Please enter your postcode (e.g. CV6 1BZ).';
      return;
    }

    // Extract outward code prefix (e.g. "CV6" from "CV6 1BZ" or "CV12" from "CV12 8TT")
    const match = rawVal.match(/^([A-Z]{1,2}\d{1,2})/);
    const outwardCode = match ? match[1] : rawVal;

    const primaryList = (coverageData.primaryHub && coverageData.primaryHub.postcodes) || ['CV1', 'CV2', 'CV3', 'CV4', 'CV5', 'CV6'];
    const surroundingList = (coverageData.surroundingAreas && coverageData.surroundingAreas.postcodes) || ['CV7', 'CV8', 'CV10', 'CV11', 'CV12', 'CV31', 'CV32', 'CV34'];

    if (primaryList.includes(outwardCode)) {
      areaResult.className = 'postcode-feedback success';
      const template = (coverageData.primaryHub && coverageData.primaryHub.message) ||
        '✓ <strong>Confirmed:</strong> {postcode} is in our primary Coventry hub (Lavender Ave CV6). Same-week & short-notice slots open.';
      areaResult.innerHTML = template.replace(/{postcode}/g, rawVal);
    } else if (surroundingList.includes(outwardCode)) {
      areaResult.className = 'postcode-feedback success';
      const template = (coverageData.surroundingAreas && coverageData.surroundingAreas.message) ||
        '✓ <strong>Covered:</strong> We regularly service {postcode} (Kenilworth, Bedworth, Warwick, Leamington Spa & Nuneaton).';
      areaResult.innerHTML = template.replace(/{postcode}/g, rawVal);
    } else {
      areaResult.className = 'postcode-feedback info';
      const template = coverageData.outsideNotice ||
        'ℹ️ We primarily cover Coventry & Warwickshire. <a href="https://wa.me/447565333237?text=Hi%20Kim,%20do%20you%20cover%20{postcode}%3F" target="_blank" style="text-decoration: underline; font-weight: bold; color: inherit;">WhatsApp Kim to confirm your road &rarr;</a>';
      areaResult.innerHTML = template.replace(/{postcode}/g, encodeURIComponent(rawVal));
    }
  });

  areaCheckInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btnCheckArea.click();
    }
  });
}

/* ==========================================================================
   5. Minimalist FAQ Accordion & Hydration
   ========================================================================== */
function renderFaq(faqList) {
  const container = document.querySelector('.faq-accordion');
  if (!container) return;

  container.innerHTML = faqList.map(item => `
    <div class="faq-row">
      <button class="faq-trigger" aria-expanded="false">
        <span>${item.question}</span>
        <span class="faq-icon">+</span>
      </button>
      <div class="faq-panel">
        <p>${item.answer}</p>
      </div>
    </div>
  `).join('');

  initFaqAccordion();
}

function initFaqAccordion() {
  const faqRows = document.querySelectorAll('.faq-row');

  faqRows.forEach(row => {
    const trigger = row.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = row.classList.contains('active');

      faqRows.forEach(r => {
        r.classList.remove('active');
        const t = r.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        row.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   6. Mobile Menu
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const links = document.querySelectorAll('.m-link');

  if (!menuBtn || !drawer) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    drawer.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      drawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   7. Form Submission
   ========================================================================== */
window.handleFormSubmit = function(event) {
  event.preventDefault();

  const name = document.getElementById('formName').value;
  const phone = document.getElementById('formPhone').value;
  const postcode = document.getElementById('formPostcode').value;
  const service = document.getElementById('formService').value;
  const notes = document.getElementById('formNotes').value;

  const successBox = document.getElementById('formSuccessMessage');
  if (successBox) {
    successBox.style.display = 'block';
  }

  const waNumber = (siteData && siteData.business && siteData.business.whatsappNumber) || '447565333237';
  const textMsg = encodeURIComponent(
    `Hi Kim! I just submitted an enquiry on your website:\n` +
    `• Name: ${name}\n` +
    `• Phone: ${phone}\n` +
    `• Postcode: ${postcode}\n` +
    `• Service: ${service}\n` +
    `• Notes: ${notes || 'None'}`
  );

  setTimeout(() => {
    const openWa = confirm("Thank you! Would you like to open this enquiry directly in WhatsApp for an instant reply from Kim?");
    if (openWa) {
      window.open(`https://wa.me/${waNumber}?text=${textMsg}`, '_blank');
    }
  }, 600);
};

/* ==========================================================================
   8. Dynamic Year
   ========================================================================== */
function updateCurrentYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
