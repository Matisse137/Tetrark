import express from 'express';
//import { authentification } from "../middlewares/authentification.js";

const modules_router = express.Router();

modules_router.get('/', async (req, res) =>
{
    try
    {
        const data = [
            { title: "Quizz de chimie", image: "/img/module_chimie.png", description: "Module de quizz pour réviser la chimie.", link: "/modules/bbc" },
        ];

        res.render('modules', {title: "Modules", css_file: "/css/classic.css", data: data});
    } catch(err)
    {
        res.status(500).send(err.toString());
        console.error(err);
    }
})

export default modules_router;