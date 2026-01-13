import db_connect from './src/services/mongoose.js'
import cors from 'cors';
import express from 'express'
import https from 'https';
import fs from 'fs';

// Definition des constantes
const app = express();
const PORT = process.env.PORT || 3000;

// Config initiale
app.use(cors());
app.use(express.json());
app.use('/account', r_user);

// Initialisation du https
const httpsOptions = {
    key: fs.readFileSync('./secure/key.pem'),   // La clé privée
    cert: fs.readFileSync('./secure/cert.pem')  // Le certificat public
};

const server = https.createServer(httpsOptions, app);

server.listen(PORT, () =>
{
    console.log(`Serveur HTTPS sécurisé lancé sur https://localhost:${PORT}`);
});
