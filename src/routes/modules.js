import express from 'express';
import { readFile } from 'node:fs/promises';
import path from "path";
import {fileURLToPath} from "url";
import q_chimie_router from "./sub_modules/quizz_chimie.js";
import projects_router from "./sub_modules/projects.js";
//import { authentification } from "../middlewares/authentification.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modules_router = express.Router();

modules_router.get('/', async (req, res) =>
{
    try
    {
        const file_path = path.join(__dirname, "../../data/modules_availables.json");
        const data = await readFile(file_path, "utf-8");

        const parsed = JSON.parse(data).mod;

        res.render('modules', {title: "Modules", css_file: "/css/classic.css", data: parsed});
    } catch(err)
    {
        res.status(500).send(err.toString());
        console.error(err);
    }
})


modules_router.use("/quizz_chimie", q_chimie_router);
modules_router.use("/project", projects_router); // NOUVEAU

export default modules_router;