import mongoose from 'mongoose';

const version_schema = new mongoose.Schema({
	number: { type: String, required: true }, // ex: "v1.0.2"
	date: { type: Date, default: Date.now },
	changelog: { type: String } // Ce qui a changé
});

const project_schema = new mongoose.Schema({
	title: { type: String, required: true },
	slug: { type: String, unique: true, required: true }, // L'URL SEO friendly
	category: {
		type: String,
		enum: ['En cours', 'Terminé', 'Idée', 'Abandonné', 'En pause'],
		default: 'Idée'
	},
	description: { type: String }, // Indispensable pour la balise <meta description> SEO
	content: { type: String, required: true }, // Ton texte brut en Markdown
	github_repo: { type: String, default: "" },
	versions: [version_schema],
	is_public: { type: Boolean, default: false } // Permet de garder des brouillons cachés des moteurs de recherche
}, { timestamps: true, collection: "projects" });

const Project = mongoose.model('projects', project_schema);
export default Project;