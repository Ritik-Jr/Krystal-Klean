# Krystal Klean | High-Converting Local Cleaning Service Website (Coventry, UK)

A fast, lightweight, mobile-first static website designed for **Krystal Klean Limited** (Coventry, CV6), focused on zero-friction local lead capture, verified Google reviews, and instant WhatsApp booking.

---

## 🏢 Business Details & Credentials

- **Trading Name:** Krystal Klean
- **Registered Name:** Krystal Klean Limited
- **Company Number:** 11957565 (Registered in England & Wales)
- **Founder / Active Director:** Kimberley Frantz ("Kim" / "Kym")
- **Date Established:** 23 April 2019
- **Registered Address:** 29 Lavender Avenue, Coventry, England, CV6 1BZ
- **Phone / Direct Line:** `+44 7565 333237` (`07565 333237`)
- **Primary Coverage:** Coventry (CV1 to CV6), Bedworth, Kenilworth, Warwick, Leamington Spa
- **Google Maps Rating:** 4.9 ★ / 5.0 (84+ verified reviews)
- **Badges & Attributes:** Women-owned business, fully insured (£1M+ Public Liability), DBS vetted, deposit-return guarantee standard.

---

## 🚀 Key Website Features

1. **Instant Lead Capture & Direct Calling:**
   - One-tap calling to `07565 333237` in the header, hero, and sticky bottom mobile bar.
   - 1-click WhatsApp messaging pre-configured with detailed customer specifications.
2. **Interactive Instant Quote Calculator:**
   - Real-time price estimator for:
     - End of Tenancy Cleaning (Deposit return guarantee)
     - Deep / Sparkle Cleans
     - Regular Domestic House Cleaning (Weekly / Fortnightly)
     - Airbnb & HMO Turnarounds
   - Dynamic bedroom & bathroom configuration plus optional add-ons (Oven deep clean, carpet refresh, fridge/freezer, interior windows).
   - "Send Quote Spec via WhatsApp" button formats the enquiry into a pre-filled WhatsApp text.
3. **Floating WhatsApp Chat Widget:**
   - Positioned in bottom-right corner with online indicator and 15-minute response notice.
   - Non-intrusive preview bubble.
4. **Mobile Sticky Action Bar:**
   - Dedicated mobile bar fixed at the bottom with `[📞 Call 07565 333237]` and `[💬 WhatsApp Kim]`.
5. **Verified Google Reviews Showcase:**
   - 4.9★ rating banner with category filter tabs (*All*, *End of Tenancy*, *Short-Notice / Move*, *Regular Home*, *Airbnb & HMO*).
6. **Local Postcode Checker:**
   - Instant validation of Coventry (CV1-CV6) and Warwickshire postcodes with contextual response.
7. **Complete Technical SEO & Schema.org:**
   - Valid `HomeAndConstructionBusiness` / `LocalBusiness` JSON-LD schema with exact geo-coordinates (52.428, -1.512), opening hours, aggregate rating (4.9/84), and service catalog.
   - Targeted local keywords: *end of tenancy cleaners coventry*, *deep cleaning services coventry cv6*, *domestic house cleaners coventry*, *airbnb turnover cleaning coventry*.

---

## 📁 File Structure

```
z:\Event Tools\krystal-klean\
├── index.html        # Main semantic HTML5 single-page application & Schema.org JSON-LD
├── styles.css        # Responsive CSS design system (pure CSS, no bloat, mobile-first)
├── app.js            # Interactive calculator, WhatsApp lead formatter, and filters
├── robots.txt        # Search engine crawler instructions
├── sitemap.xml       # XML sitemap for Google Search Console
└── README.md         # Documentation & deployment guide
```

---

## 💻 Local Testing

You can preview the website locally using any standard static file server:

### Option A: Using Python
```bash
cd "z:\Event Tools\krystal-klean"
python -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.

### Option B: Using Node / npx
```bash
cd "z:\Event Tools\krystal-klean"
npx serve .
```

---

## 🌐 Free One-Click Deployment Options

### 1. Netlify
1. Drag and drop the `krystal-klean` folder into [app.netlify.com/drop](https://app.netlify.com/drop).
2. The site is live within 5 seconds with a free SSL certificate.
3. Connect your custom domain (e.g., `krystalklean.co.uk`).

### 2. Vercel
1. Run `npx vercel` inside the folder or import the repository.
2. Select default static settings.

### 3. GitHub Pages
1. Push the repository to GitHub.
2. Under **Settings > Pages**, set the branch to `main` and folder to `/` (or `/krystal-klean`).
