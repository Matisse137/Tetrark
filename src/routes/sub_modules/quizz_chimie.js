import express from 'express';
//import { authentification } from "../middlewares/authentification.js";

const q_chimie_router = express.Router();

q_chimie_router.get('/', async (req, res) =>
{
	try
	{
		res.render('home_chim', {title: "Quiz de chimie", css_file: "/css/classic.css"});
	} catch(err)
	{
		res.status(500).send(err.toString());
		console.error(err);
	}
})

q_chimie_router.get('/create', async (req, res) =>
{
	try
	{
		res.render('create_chim', {title: "Quiz de chimie", css_file: "/css/classic.css"});
	} catch(err)
	{
		res.status(500).send(err.toString());
		console.error(err);
	}
})

q_chimie_router.get('/create', async (req, res) =>
{
	try
	{
		res.render('create_chim', {title: "Quiz de chimie", css_file: "/css/classic.css"});
	} catch(err)
	{
		res.status(500).send(err.toString());
		console.error(err);
	}
})

q_chimie_router.get('/list', async (req, res) =>
{
	try
	{
		res.render('list_chim', {title: "Quiz de chimie", css_file: "/css/classic.css"});
	} catch(err)
	{
		res.status(500).send(err.toString());
		console.error(err);
	}
})

q_chimie_router.get('/select', async (req, res) =>
{
	try
	{
		res.render('select_chim', {title: "Quiz de chimie", css_file: "/css/classic.css"});
	} catch(err)
	{
		res.status(500).send(err.toString());
		console.error(err);
	}
})

export default q_chimie_router;