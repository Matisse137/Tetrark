import express from 'express';
import Project from "../../models/project.js";
import { marked } from 'marked';
import slugify from 'slugify';

const project_router = express.Router();

// Fonction interne pour récupérer les infos GitHub (Backend)
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

// Route d'affichage (Détail)
project_router.get('/view/:slug', async (req, res) => {
	try {
		const project = await Project.findOne({ slug: req.params.slug, is_public: true }).lean();
		if (!project) return res.status(404).render('e404', { css_file: "/css/classic.css" });

		const github_info = await get_github_info(project.github_repo);
		const rendered_html = marked.parse(project.content || "");

		res.render('project_detail', {
			title: `${project.title} | Portfolio`,
			seo_desc: project.description,
			css_file: "/css/classic.css",
			project,
			rendered_html, // HTML généré à partir du Markdown
			github: github_info
		});
	} catch (err) {
		res.status(500).render('e500', { css_file: "/css/classic.css" });
	}
});

// Route de création
project_router.post('/create', async (req, res) => {
	try {
		const { title, category, description, content, github_repo, is_public } = req.body;
		const slug = slugify(title, { lower: true, strict: true });

		const new_project = new Project({
			title, slug, category, description, content, github_repo,
			is_public: is_public === 'on'
		});

		await new_project.save();
		res.redirect('/modules/projects');
	} catch (err) {
		res.status(500).send("Erreur lors de la création.");
	}
});

export default project_router;