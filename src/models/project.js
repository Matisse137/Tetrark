import mongoose from 'mongoose';

const version_schema = new mongoose.Schema({
	number: String,
	date: { type: Date, default: Date.now },
	changelog: String
});

const project_schema = new mongoose.Schema({
	title: { type: String, required: true },
	slug: { type: String, unique: true, required: true },
	category: {
		type: String,
		enum: ['En cours', 'Terminé', 'Idée', 'Abandonné', 'En pause'],
		default: 'Idée'
	},
	description: String,
	content: String, // Markdown
	github_repo: String, // ex: "Matisse137/Tetrark"
	versions: [version_schema],
	is_public: { type: Boolean, default: false }
}, { timestamps: true, collection: "projects" });

const Project = mongoose.model('projects', project_schema);
export default Project;