import 'dotenv/config'
import { db_connect } from './src/services/mongoose.js'
import cors from 'cors';
import express from 'express'
import https from 'https';
import fs from 'fs';
import {engine} from "express-handlebars";
import {createReadStream} from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from "chalk";
import modules_router from "./src/routes/modules.js";
import login_router from "./src/routes/login.js";
import User from './src/models/user.js'

// Definition des constantes
const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connexion à la db
db_connect().catch((err) => console.log(err));

// Config initiale
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/modules", modules_router);
app.use("/login", login_router);

// Config handlebars
app.engine("handlebars", engine(
    {
        extname: '.handlebars',
        defaultLayout: 'main',
        helpers: {
            // Ajoute ce helper pour comparer les valeurs dans tes vueseq: (a, b) => a === b
        }
    }
));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) =>
{
    try
    {
        res.render('index', {title:"Bienvenue !", css_file:"/css/classic.css"});
    } catch(err)
    {
        res.status(500).send(err.toString());
        console.error(chalk.bold.red(err.toString()));
    }
});

// 404 - Page non trouvée
app.use((req, res) => {
    res.status(404).render("e404", {
        title: "Page Introuvable",
        url: req.originalUrl,
        css_file:"/css/classic.css"
    });
});

// 500 - Erreur Serveur (4 arguments obligatoires)
app.use((err, req, res, next) => {
    console.error(chalk.red(err.stack));
    res.status(500).render("e500", {
        title: "Erreur Serveur",
        error: err.message,
        css_file:"/css/classic.css"
    });
});

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
