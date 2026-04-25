import express from 'express';
import Projects from "../../models/projects.js";
import { marked } from 'marked';
import slugify from 'slugify';

const project_router = express.Router();

// --- HELPER GITHUB ---
async function get_github_info(repo_path) {
	if (!repo_path) return null;
	try {
		const headers = { "User-Agent": "Tetrark-Server" };
		const [res_branches, res_release] = await Promise.all([
			fetch(`https://api.github.com/repos/${repo_path}/branches`, { headers }),
			fetch(`https://api.github.com/repos/${repo_path}/releases/latest`, { headers })
		]);

		return {
			branches: res_branches.ok ? await res_branches.json() : [],
			tag: res_release.ok ? (await res_release.json()).tag_name : "main"
		};
	} catch (err) {
		return { branches: [], tag: "N/A" };
	}
}

// --- 1. ROUTE PRINCIPALE (Liste des projets) ---
project_router.get('/', async (req, res) => {
	try {
		// On récupère tous les projets publics
		const projects_db = await Projects.find({ is_public: true }).lean();

		// On les groupe par catégorie pour un affichage propre
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
		res.status(500).render('e500', { css_file: "/css/classic.css" });
	}
});

// --- 2. ROUTE D'AFFICHAGE DU FORMULAIRE DE CRÉATION ---
// Ajoute ton middleware d'authentification ici plus tard !
project_router.get('/create', (req, res) => {
	res.render('create_project', {
		title: "Nouveau Projet | Tetrark",
		css_file: "/css/classic.css"
	});
});

// --- 3. ROUTE DE TRAITEMENT DE LA CRÉATION (POST) ---
project_router.post('/create', async (req, res) => {
	try {
		const { title, category, description, content, github_repo, is_public } = req.body;
		const slug = slugify(title, { lower: true, strict: true });

		const new_project = new Projects({
			title, slug, category, description, content, github_repo,
			is_public: is_public === 'on'
		});

		await new_project.save();
		res.redirect('/modules/projects'); // On redirige vers la liste
	} catch (err) {
		res.status(500).send("Erreur lors de la création.");
	}
});

// --- 4. ROUTE D'AFFICHAGE DU DÉTAIL D'UN PROJET (SEO) ---
project_router.get('/view/:slug', async (req, res) => {
	try {
		const project = await Projects.findOne({ slug: req.params.slug, is_public: true }).lean();
		if (!project) return res.status(404).render('e404', { css_file: "/css/classic.css" });

		const github_info = await get_github_info(project.github_repo);
		const rendered_html = marked.parse(project.content || "");

		res.render('project_detail', {
			title: `${project.title} | Portfolio`,
			seo_desc: project.description,
			css_file: "/css/classic.css",
			project,
			rendered_html,
			github: github_info
		});
	} catch (err) {
		res.status(500).render('e500', { css_file: "/css/classic.css" });
	}
});

export default project_router;