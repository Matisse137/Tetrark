import axios from 'axios';

/**
 * Fonction pour créer ou mettre à jour un quizz chimie
 * @param {Object} formData - Les données issues de ton formulaire
 */
const create_quizz_chim = async (formData) => {
	try {
		// Construction de l'objet selon tes conventions req.body
		const body = {
			category_name: formData.category_name,
			quizz_name: formData.quizz_name,
			quest_name: formData.quest_name,
			quest_content: formData.quest_content,
			resp: formData.resp,
			is_correct: formData.is_correct
		};

		// Appel à ta route POST /create
		const response = await axios.post('http://localhost:3000/q_chimie/create', body);

		if (response) {
			console.log("SUCCESS IN AXIOS POST TO CREATE");
			console.log(response.data);
		}

	} catch (error) {
		console.log("ERROR IN AXIOS POST TO CREATE");
		// Utilisation de .toString() comme dans ton backend
		console.log(error.toString());
	}
};

const handle_submit = () => {
	// On récupère les données via les ID de ton HTML
	const quizz_data = {
		category_name: document.getElementById('category_name').value,
		quizz_name: document.getElementById('quizz_name').value,
		quest_name: document.getElementById('quest_name').value,
		quest_content: document.getElementById('quest_content').value,
		resp: document.getElementById('resp').value,
		is_correct: document.getElementById('is_correct').checked // Boolean
	};

	create_quizz_chim(quizz_data);
};

