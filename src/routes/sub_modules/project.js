import express from 'express';
import Project from "../../models/project.js";
import { marked } from 'marked';
import slugify from 'slugify';

const project_router = express.Router();

// Helper interne pour GitHub (Backend)
async function fetch_github_info(repo_path) {
	if (!repo_path) return null;
	try {
		const options = { headers: { "User-Agent": "Tetrark-Server" } };
		const [res_branches, res_release] = await Promise.all([
			fetch(`https://api.github.com/repos/${repo_path}/branches`, options),
			fetch(`https://api.github.com/repos/${repo_path}/releases/latest`, options)
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

		const github_info = await fetch_github_info(project.github_repo);
		const rendered_content = marked.parse(project.content || "");

		res.render('project_detail', {
			title: `${project.title} | Portfolio`,
			seo_desc: project.description,
			css_file: "/css/classic.css",
			project,
			rendered_content, // HTML généré par le Markdown
			github: github_info
		});
	} catch (err) {
		res.status(500).render('e500', { css_file: "/css/classic.css" });
	}
});

export default project_router;