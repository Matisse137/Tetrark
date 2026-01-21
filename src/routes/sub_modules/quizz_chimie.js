import express from 'express';
//import { authentification } from "../middlewares/authentification.js";

const q_chimie_router = express.Router();

q_chimie_router.get('/', async (req, res) =>
{
	try
	{
		res.render('modules', {title: "Quiz de chimie", css_file: "/css/classic.css"});
	} catch(err)
	{
		res.status(500).send(err.toString());
		console.error(err);
	}
})

export default q_chimie_router;