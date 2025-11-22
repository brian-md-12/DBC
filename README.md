# Nexus Card - Digital Business Card App

A premium, glassmorphism-styled digital business card creator. Create, customize, and share your professional identity instantly via AirDrop, QR Code, or VCard.

## Features

*   **✨ Premium Design:** Glassmorphism UI with animated backgrounds and dark mode.
*   **⚡ Fast Sharing:**
    *   **AirDrop / Native Share:** Uses the Web Share API to directly share your contact card to nearby devices.
    *   **QR Code:** Generates an instant QR code for scanning.
    *   **VCard Download:** Standard `.vcf` file export compatible with iOS Contacts, Google Contacts, and Outlook.
*   **🎨 Live Editor:** Real-time preview of your card as you edit.
*   **📱 Mobile Ready:** Fully responsive design that works like a native app on phones.

## How to Run

### 1. Frontend (The App)
Since this is a static web application, you can run it immediately without any installation:

1.  Open the folder `DBC 2.0`.
2.  Double-click `index.html` to open it in your browser.
3.  **Note:** For the best experience (and for some security features like Web Share API to work perfectly), it is recommended to serve it via a local server.
    *   If you have Python installed: `python3 -m http.server`
    *   Or use a VS Code extension like "Live Server".

### 2. Wallet Integration (Backend)
The "Add to Wallet" feature requires a backend server to cryptographically sign the Apple Wallet passes (`.pkpass`).

1.  Navigate to the `backend` folder.
2.  Install dependencies (requires Node.js):
    ```bash
    npm install
    ```
3.  **Configuration:**
    *   May need an Apple Developer Account.
    *   Obtain your Pass Type ID and Certificates.
    *   Place your `signer.pem`, `key.pem`, and `wwdr.pem` in a `keys` folder inside `backend`.
    *   Uncomment the code in `server.js`.
4.  Run the server:
    ```bash
    node server.js
    ```

## Usage Guide

1.  **Fill Details:** Enter your name, job, and contact info.
2.  **Customize:** Choose a color theme for your card.
3.  **Share:**
    *   Click **Share** to open the native share sheet (AirDrop, Messages, etc.).
    *   Click **QR Code** to show a code for others to scan.
    *   Click **Save Contact** to download the file manually.
