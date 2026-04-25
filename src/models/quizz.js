import mongoose from 'mongoose';

/*

Forme d'un enregistrement de quizz_chim_schema :
{
	category_name(String)
	quizz(tab) :
		quizz_name(String)
		questions(tab) :
			quest_name(String)
			quest_content(String)
			resp_tab(tab):
				resp(String)
				is_correct(Boolean)
}

*/

const quizz_chim_schema = new mongoose.Schema({
	category_name: {
		type: String,
		required: true,
		trim: true, // Nettoie les espaces blancs
		unique: true
	},
	quizz: [{
		quizz_name: { type: String, required: true },
		questions: [{
			quest_content: { type: String, required: true }, // 'quest_name' est souvent redondant avec le contenu
			resp_tab: [{
				resp: { type: String, required: true },
				is_correct: { type: Boolean, default: false }
			}]
		}]
	}]
}, { timestamps: true, collection: "quizz_chim" }); // Ajoute createdAt et updatedAt

const Quizz_chim = mongoose.model('quizz_chim', quizz_chim_schema);
export default Quizz_chim;