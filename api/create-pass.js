// Vercel Serverless Function for Apple Wallet Pass Generation
// This replaces the Express backend for Vercel deployment

const fs = require('fs');
const path = require('path');

// NOTE: To make Apple Wallet work, you need:
// 1. Apple Developer Account ($99/year)
// 2. Pass Type ID Certificate (signer.pem)
// 3. Private Key (key.pem)
// 4. WWDR Certificate (wwdr.pem)
// Place these files in a 'keys' directory at project root

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, title, company, email, phone, website } = req.body;

        console.log('Received request to create pass for:', name);

        // Uncomment when there are Apple Developer certificates available:
        /*
        const { Pass } = require('passkit-generator');
        
        const pass = new Pass({
            model: path.join(__dirname, '../models/business-card.pass'),
            certificates: {
                wwdr: fs.readFileSync(path.join(__dirname, '../keys/wwdr.pem')),
                signerCert: fs.readFileSync(path.join(__dirname, '../keys/signer.pem')),
                signerKey: fs.readFileSync(path.join(__dirname, '../keys/key.pem')),
            }
        });

        pass.primaryFields.add({ key: 'name', label: 'Name', value: name });
        pass.secondaryFields.add({ key: 'title', label: 'Title', value: title });
        pass.secondaryFields.add({ key: 'company', label: 'Company', value: company });

        const buffer = await pass.generate();

        res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
        res.setHeader('Content-Disposition', `attachment; filename="${name}.pkpass"`);
        return res.send(buffer);
        */

        // For now, return a message about setup requirements
        return res.status(200).json({
            success: false,
            message: "Apple Wallet pass generation requires Apple Developer Certificates. See api/create-pass.js for setup instructions.",
            data: { name, title, company, email, phone, website }
        });

    } catch (error) {
        console.error('Error generating pass:', error);
        return res.status(500).json({ 
            error: 'Failed to generate pass',
            details: error.message 
        });
    }
};
