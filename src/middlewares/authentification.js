import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authentification = async (req, res, next) => {
	try
	{
		const token_header = req.header('Authorization');

		if (!token_header) {
			throw new Error("Authentification requise : Token manquant");
		}

		const auth_token = token_header.replace("Bearer ", "");

		const decoded = jwt.verify(auth_token, process.env.JWT_SECRET);

		const user = await User.findOne(
			{
			_id: decoded._id,
			'auth_tokens.auth_token': auth_token
		});

		if (!user) throw new Error("Utilisateur introuvable ou token invalide");

		req.user = user;
		req.token = auth_token;

		next();
	} catch (error)
	{
		res.status(401).send({ error: error.message || "Non autorisé" });
	}
}

export { authentification };