import express from 'express';
import Project from "../../models/project.js";
import { marked } from 'marked';
import slugify from 'slugify';
// import { authentification } from "../../middlewares/authentification.js";

const projects_router = express.Router();

// 1. ROUTE PUBLIQUE : Liste des projets (Indexable par Google)
projects_router.get('/', async (req, res) => {
	try {
		const projects_db = await Project.find({ is_public: true }).lean();

		// Groupement par catégorie pour la lisibilité
		const projects_par_categorie = projects_db.reduce((acc, proj) => {
			(acc[proj.category] = acc[proj.category] || []).push(proj);
			return acc;
		}, {});

		res.render('list_projects', {
			title: "Carnet de Projets | Tetrark",
			projects_par_categorie,
			css_file: "/css/classic.css"
		});
	} catch(err) {
		res.status(500).send(err.message);
	}
});

// 2. ROUTE PUBLIQUE : Affichage d'un projet spécifique via son SLUG (SEO)
projects_router.get('/view/:slug', async (req, res) => {
	try {
		const project = await Project.findOne({ slug: req.params.slug, is_public: true }).lean();

		if (!project) {
			// Utilisation de ta page 404 existante
			return res.status(404).render('e404', { url: req.originalUrl, css_file: "/css/classic.css" });
		}

		// On transforme le Markdown en HTML avant de l'envoyer à la vue !
		project.html_content = marked.parse(project.content);

		res.render('project_detail', {
			title: `${project.title} | Tetrark`,
			seo_desc: project.description,
			css_file: "/css/classic.css",
			project: project
		});
	} catch(err) {
		console.error(err);
		res.status(500).send(err.toString());
	}
});

// 3. ROUTE PRIVÉE : Création d'un projet (A protéger avec ton middleware plus tard)
projects_router.post('/create', async (req, res) => {
	try {
		// Création automatique du slug à partir du titre
		const generated_slug = slugify(req.body.title, { lower: true, strict: true });

		const new_project = new Project({
			title: req.body.title,
			slug: generated_slug,
			category: req.body.category,
			description: req.body.description,
			content: req.body.content,
			github_repo: req.body.github_repo, // NOUVEAU
			is_public: req.body.is_public === 'on' || req.body.is_public === true
		});

		await new_project.save();
		res.status(201).send("Projet créé avec succès");
	} catch (error) {
		console.error(error);
		res.status(500).send(error.toString());
	}
});

export default projects_router;