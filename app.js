document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('cardForm');
    const inputs = {
        fullName: document.getElementById('fullName'),
        jobTitle: document.getElementById('jobTitle'),
        company: document.getElementById('company'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        website: document.getElementById('website')
    };

    const preview = {
        name: document.getElementById('previewName'),
        title: document.getElementById('previewTitle'),
        company: document.getElementById('previewCompany'),
        email: document.getElementById('previewEmail'),
        phone: document.getElementById('previewPhone'),
        website: document.getElementById('previewWebsite'),
        emailItem: document.getElementById('previewEmailItem'),
        phoneItem: document.getElementById('previewPhoneItem'),
        websiteItem: document.getElementById('previewWebsiteItem')
    };

    const card = document.getElementById('businessCard');
    const cardFaces = document.querySelectorAll('.card-face');
    const cardBackFace = document.getElementById('cardBackFace');
    const colorBtns = document.querySelectorAll('.color-btn');
    const imgBtns = document.querySelectorAll('.img-btn');
    const hideToggles = document.querySelectorAll('.hide-toggle');
    const backTextInput = document.getElementById('backText');
    const previewBackText = document.getElementById('previewBackText');

    // Action Buttons
    const shareBtn = document.getElementById('shareBtn');
    const flipBtn = document.getElementById('flipBtn');
    const walletBtn = document.getElementById('walletBtn');
    const vcardBtn = document.getElementById('vcardBtn');
    const resetBtn = document.getElementById('resetBtn');
    const scanBtn = document.getElementById('qrConnectBtn'); // Renamed in HTML
    const savedContactsBtn = document.getElementById('savedContactsBtn');
    const closeContactsBtn = document.getElementById('closeContactsBtn');

    // Modals & Sidebar
    const qrConnectModal = document.getElementById('qrConnectModal');
    const contactsSidebar = document.getElementById('contactsSidebar');
    const contactsList = document.getElementById('contactsList');
    const closeQrConnectBtn = document.getElementById('closeQrConnect');

    // Tabs
    const qrTabBtns = document.querySelectorAll('.qr-tab-btn');
    const qrTabContents = document.querySelectorAll('.qr-tab-content');

    // State
    let currentTheme = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    let currentBackImg = 'default';
    let isFlipped = false;
    let html5QrcodeScanner = null;
    let currentQrTab = 'my-code';

    // --- Live Preview Logic ---
    function updatePreview() {
        preview.name.textContent = inputs.fullName.value || 'Alex Sterling';
        preview.title.textContent = inputs.jobTitle.value || 'Senior Product Designer';
        preview.company.textContent = inputs.company.value || 'Nexus Innovations';

        // Handle visibility of contact items
        updateContactItem(preview.phone, inputs.phone, preview.phoneItem, '+1 (555) 000-0000');
        updateContactItem(preview.email, inputs.email, preview.emailItem, 'alex@example.com');
        updateContactItem(preview.website, inputs.website, preview.websiteItem, 'alexsterling.design');

        // Update Back Text
        if (backTextInput.value) {
            previewBackText.textContent = backTextInput.value;
            previewBackText.style.display = 'block';
        } else {
            previewBackText.style.display = 'none';
        }
    }

    function updateContactItem(previewEl, inputEl, containerEl, placeholder) {
        // Check if hidden
        const isHidden = document.querySelector(`.hide-toggle[data-target="${containerEl.id}"]`)?.checked;

        if (isHidden) {
            containerEl.style.display = 'none';
            return;
        }

        if (inputEl.value) {
            previewEl.textContent = inputEl.value;
            containerEl.style.display = 'flex';
        } else {
            previewEl.textContent = placeholder;
            containerEl.style.display = 'flex'; // Show placeholder unless hidden
        }
    }

    // Add event listeners to all inputs
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    backTextInput.addEventListener('input', updatePreview);

    // --- Hide Toggles ---
    hideToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const targetId = toggle.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);

            if (targetEl) {
                if (toggle.checked) {
                    targetEl.style.display = 'none';
                } else {
                    targetEl.style.display = 'flex';
                }
            }
            updatePreview(); // Re-run logic to handle empty states vs hidden states
        });
    });

    // --- Theme Switcher ---
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTheme = btn.getAttribute('data-color');

            // Apply to front face always
            document.querySelector('.card-front').style.background = currentTheme;

            // Apply to back face ONLY if default image is selected
            if (currentBackImg === 'default') {
                cardBackFace.style.background = currentTheme;
                cardBackFace.style.backgroundImage = 'none';
            }
        });
    });

    // --- Back Image Switcher ---
    imgBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            imgBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const imgPath = btn.getAttribute('data-img');
            currentBackImg = imgPath;

            if (imgPath === 'default') {
                cardBackFace.style.background = currentTheme;
                cardBackFace.style.backgroundImage = 'none';
            } else {
                cardBackFace.style.background = `url('${imgPath}')`;
                // Ensure cover/center is applied via CSS class, but we can force it here too just in case
                cardBackFace.style.backgroundSize = 'cover';
                cardBackFace.style.backgroundPosition = 'center';
            }
        });
    });

    // --- Card Flip ---
    function flipCard() {
        isFlipped = !isFlipped;
        if (isFlipped) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    }

    card.addEventListener('click', flipCard);
    flipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipCard();
    });

    // --- QR Generation ---
    function generateVCard() {
        const name = inputs.fullName.value || 'Alex Sterling';
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ');

        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
N:${lastName};${firstName};;;
ORG:${inputs.company.value || 'Nexus Innovations'}
TITLE:${inputs.jobTitle.value || 'Senior Product Designer'}
TEL;TYPE=CELL:${inputs.phone.value || ''}
EMAIL:${inputs.email.value || ''}
URL:${inputs.website.value || ''}
END:VCARD`;
    }

    // --- Saved Contacts Logic ---
    function loadContacts() {
        const contacts = JSON.parse(localStorage.getItem('nexusContacts') || '[]');
        contactsList.innerHTML = '';

        if (contacts.length === 0) {
            contactsList.innerHTML = '<div class="empty-state">No contacts saved yet.</div>';
            return;
        }

        contacts.forEach(contact => {
            const el = document.createElement('div');
            el.className = 'saved-contact-card';

            let locationHtml = '';
            if (contact.location) {
                locationHtml = `
                    <div style="margin-top:0.3rem; font-size:0.75rem; color: var(--accent-color);">
                        <i class="fa-solid fa-location-dot"></i> 
                        <a href="https://www.google.com/maps?q=${contact.location.lat},${contact.location.lng}" target="_blank" style="color:inherit; text-decoration:none;">
                            View Location
                        </a>
                    </div>
                `;
            }

            el.innerHTML = `
                <h4>${contact.name || 'Unknown'}</h4>
                <p>${contact.title || ''}</p>
                <p>${contact.company || ''}</p>
                <div style="margin-top:0.5rem; font-size:0.75rem; opacity:0.7;">
                    ${contact.date}
                </div>
                ${locationHtml}
            `;
            contactsList.appendChild(el);
        });
    }

    function saveContact(contactData) {
        const contacts = JSON.parse(localStorage.getItem('nexusContacts') || '[]');
        contacts.push({
            ...contactData,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('nexusContacts', JSON.stringify(contacts));
        loadContacts();
        alert('Contact Saved!');
    }

    savedContactsBtn.addEventListener('click', () => {
        contactsSidebar.classList.remove('hidden');
        loadContacts();
    });

    closeContactsBtn.addEventListener('click', () => {
        contactsSidebar.classList.add('hidden');
    });

    // --- QR Connect Logic ---

    // Open Modal
    scanBtn.addEventListener('click', () => {
        qrConnectModal.classList.remove('hidden');
        // Default to My Code
        switchTab('my-code');
    });

    // Close Modal
    closeQrConnectBtn.addEventListener('click', () => {
        qrConnectModal.classList.add('hidden');
        stopScanner();
    });

    // Tab Switching
    qrTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    function switchTab(tabName) {
        currentQrTab = tabName;

        // Update UI
        qrTabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        qrTabContents.forEach(content => {
            if (content.id === `tab-${tabName}`) content.classList.add('active');
            else content.classList.remove('active');
        });

        // Logic
        if (tabName === 'my-code') {
            stopScanner();
            generateMainQR();
        } else if (tabName === 'scan-code') {
            startScanner();
        }
    }

    function generateMainQR() {
        const vcardData = generateVCard();
        const qrContainer = document.getElementById('qrcode');
        if (qrContainer) {
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: vcardData,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
        }
    }

    function startScanner() {
        // If already running, don't restart
        if (html5QrcodeScanner) return;

        html5QrcodeScanner = new Html5Qrcode("reader");
        html5QrcodeScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },
            (decodedText, decodedResult) => {
                // Success
                console.log(`Code matched = ${decodedText}`, decodedResult);
                stopScanner();
                qrConnectModal.classList.add('hidden');

                // Parse VCard (Simple parsing)
                const nameMatch = decodedText.match(/FN:(.*)/);
                const titleMatch = decodedText.match(/TITLE:(.*)/);
                const orgMatch = decodedText.match(/ORG:(.*)/);

                const contact = {
                    name: nameMatch ? nameMatch[1] : 'Unknown',
                    title: titleMatch ? titleMatch[1] : '',
                    company: orgMatch ? orgMatch[1] : '',
                    location: null
                };

                if (confirm(`Found contact: ${contact.name}. Save?`)) {
                    // Get Location
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition((position) => {
                            contact.location = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            saveContact(contact);
                        }, (error) => {
                            console.warn("Location access denied or failed.", error);
                            saveContact(contact);
                        });
                    } else {
                        saveContact(contact);
                    }
                }
            },
            (errorMessage) => {
                // parse error
            }
        ).catch(err => {
            console.error(err);
            // Show error in UI if needed, or fallback
            document.getElementById('reader').innerHTML = `<p style="color:red; padding:1rem;">Camera access failed. Ensure HTTPS.</p>`;
        });
    }

    function stopScanner() {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.stop().then(() => {
                html5QrcodeScanner.clear();
                html5QrcodeScanner = null;
            }).catch(err => {
                console.error(err);
                html5QrcodeScanner = null;
            });
        }
    }


    // --- Actions ---

    // 1. Download VCard
    vcardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const vcardData = generateVCard();
        const blob = new Blob([vcardData], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${inputs.fullName.value || 'contact'}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // 2. Share (AirDrop / Native Share Sheet)
    shareBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const vcardData = generateVCard();
        const file = new File([vcardData], `${inputs.fullName.value || 'contact'}.vcf`, { type: 'text/vcard' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'My Business Card',
                    text: 'Here is my digital business card.'
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            alert('Your browser does not support direct file sharing. Downloading VCard instead.');
            vcardBtn.click();
        }
    });

    // 3. QR Code (Now separate from back of card)
    // We can add a button listener for a dedicated QR modal if needed, 
    // but the user asked to keep it as part of Share. 
    // Currently, we have a dedicated "QR Code" button in the action grid (from previous steps).
    // Let's ensure that button still works.
    const qrBtn = document.getElementById('qrBtn'); // This might be missing in my variable declarations above if I removed it?
    // Wait, I removed the 'qrBtn' from the HTML in the previous step? No, I didn't touch the action grid in HTML update, only the card back.
    // Let's check if 'qrBtn' exists in the DOM.
    if (document.getElementById('qrBtn')) {
        document.getElementById('qrBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            const vcardData = generateVCard();
            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: vcardData,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M
            });
            qrModal.classList.remove('hidden');
        });
    }

    // 4. Wallet Integration (Simulation)
    walletBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        alert('Wallet Integration:\n\nTo generate a real Apple Wallet (.pkpass) or Google Wallet pass, a backend server with Developer Certificates is required.\n\nI have included the backend code structure in the "backend/" folder of this project. You can run it with Node.js to enable this feature.');
    });

    // Reset
    resetBtn.addEventListener('click', () => {
        if (confirm('Clear all data?')) {
            form.reset();
            // Reset toggles
            hideToggles.forEach(t => t.checked = false);
            // Reset Back Image
            imgBtns.forEach(b => b.classList.remove('active'));
            imgBtns[0].classList.add('active'); // Default
            currentBackImg = 'default';
            cardBackFace.style.background = currentTheme;
            cardBackFace.style.backgroundImage = 'none';

            updatePreview();
        }
    });
});
