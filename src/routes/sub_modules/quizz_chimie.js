import express from 'express';
import Quizz_chim from "../../models/quizz.js";
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

q_chimie_router.post('/create', async (req, res) => {
	try {
		// 1. On cherche si la catégorie existe déjà
		let existing_cat = await Quizz_chim.findOne({ category_name: req.body.category_name });

		if (existing_cat) {
			// OPTION A : La catégorie existe, on AJOUTE le nouveau quizz au tableau existant
			const new_quizz_to_add = {
				quizz_name: req.body.quizz_name,
				questions: [ // Attention : dans ton schéma c'était "questions", pas "content"
					{
						quest_name: req.body.quest_name,
						quest_content: req.body.quest_content,
						resp_tab: [
							{
								resp: req.body.resp,
								is_correct: req.body.is_correct,
							},
						]
					}
				]
			};

			existing_cat.quizz.push(new_quizz_to_add);
			await existing_cat.save();

			console.log("New quizz added to existing category !");
			res.status(200).send("Quizz added to category");

		} else {
			// OPTION B : La catégorie n'existe pas, on crée TOUT l'enregistrement
			const new_cat = new Quizz_chim({
				category_name: req.body.category_name,
				quizz: [
					{
						quizz_name: req.body.quizz_name,
						questions: [
							{
								quest_name: req.body.quest_name,
								quest_content: req.body.quest_content,
								resp_tab: [
									{
										resp: req.body.resp,
										is_correct: req.body.is_correct,
									},
								]
							}
						]
					}
				]
			});

			await new_cat.save();
			console.log("New quizz chim category created !");
			res.status(201).send("Category and Quizz created");
		}

	} catch (error) {
		console.log("ERROR IN POST TO CREATE NEW CATEGORY");
		console.log(error.toString()); // Correction : error.toString() au lieu de toString(error)
		res.status(500).send(error.toString());
	}
});

q_chimie_router.patch('/update', async (req, res) =>
{
	try
	{
		// On prépare l'objet de mise à jour.
		// Note : Si tu veux modifier un quiz spécifique dans le tableau,
		// on utilise souvent le nom du quiz comme filtre.

		const update_data = {
			$set: {
				"quizz.$[q].quizz_name": req.body.new_quizz_name || req.body.quizz_name,
				// Ici on pourrait modifier d'autres champs si nécessaire
			}
		};

		// Options pour cibler le bon quiz dans le tableau 'quizz'
		const options = {
			arrayFilters: [{ "q.quizz_name": req.body.quizz_name }], // Filtre pour trouver le quiz précis
			new: true // Pour renvoyer le document modifié
		};

		const result = await Quizz_chim.findOneAndUpdate(
			{ category_name: req.body.category_name },
			update_data,
			options
		);

		if(result)
		{
			console.log("Quizz chim updated !");
			res.status(200).send("Update successful");
		}
		else
		{
			console.log("Quizz chim can't be updated (Category or Quizz not found) !");
			res.status(404).send("Not found");
		}

	} catch (error)
	{
		console.log("ERROR IN PATCH TO UPDATE QUIZZ ");
		// Correction de ToString -> error.toString() pour éviter un crash JS
		console.log(error.toString());
		res.status(500).send(error.toString());
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

q_chimie_router.get('/list', async (req, res) => {
	try {
		console.log("1. Appel de la route /list effectué");

		const categories_db = await Quizz_chim.find().lean();
		console.log("2. Données trouvées dans Mongoose :", categories_db);

		res.render('list_chim', {
			title: "Quiz de chimie",
			css_file: "/css/classic.css",
			categories: categories_db
		});
		console.log("3. Rendu Handlebars terminé");

	} catch(err) {
		console.log("ERREUR DANS LA ROUTE /LIST :");
		console.error(err);
		res.status(500).send("Erreur serveur : " + err.toString());
	}
});

q_chimie_router.get('/select/:id', async (req, res) => {
	try {
		// 1. On récupère le paramètre directement depuis l'URL
		const parametre_id = req.params.id;
		console.log("Quiz demandé (Nom ou ID) :", parametre_id);

		// 2. On cherche dans la base de données
		// Grâce à la notation avec un point "quizz.quizz_name", Mongoose va fouiller
		// à l'intérieur du tableau 'quizz' pour trouver une correspondance.
		// On utilise $or pour chercher SOIT par le nom du quiz, SOIT par son _id.
		const category_trouvee = await Quizz_chim.findOne({
			$or: [
				{ "quizz.quizz_name": parametre_id },
				{ "quizz._id": parametre_id } // Si tu passes l'ID chiffré de Mongo
			]
		}).lean();

		// Si rien n'est trouvé
		if (!category_trouvee) {
			console.log("ERREUR : Quiz introuvable !");
			return res.status(404).send("Ce quiz n'existe pas.");
		}

		// 3. Comme Mongoose renvoie toute la catégorie, on isole le quiz spécifique
		const le_bon_quizz = category_trouvee.quizz.find(q =>
			q.quizz_name === parametre_id || q._id.toString() === parametre_id
		);

		console.log("Quiz isolé avec succès :", le_bon_quizz.quizz_name);

		// 4. On envoie les données du quiz à ton fichier Handlebars
		res.render('play_chim', {
			title: `Quiz : ${le_bon_quizz.quizz_name}`,
			css_file: "/css/classic.css",
			quiz_data: le_bon_quizz // Tu pourras utiliser {{quiz_data}} dans ton HTML
		});

	} catch(err) {
		console.error("ERROR IN GET /select/:id");
		console.error(err.toString());
		res.status(500).send(err.toString());
	}
});

q_chimie_router.get('/all', async (req, res) => {
	try {
		const categories = await Quizz_chim.find();
		res.json(categories);
	} catch (err) {
		res.status(500).send(err.toString());
	}
});

export default q_chimie_router;