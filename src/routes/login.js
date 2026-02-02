import express from 'express';
import User from "../models/user.js";
//import { authentification } from "../middlewares/authentification.js";

const login_router = express.Router();

login_router.get("/", async (req, res) => {
    try
    {
        res.render("login", {title: "login", css_file: "/css/classic.css"})
    }
    catch (error)
    {
        res.status(500);
    }
});

login_router.post("/", async (req, res) => {
    try
    {
         const user = await user.find_user(req.email, req.password);
         const auth_token = await user.generate_jwt();
         res.send({ user, auth_token})
    }
    catch (error)
    {
        res.status(500);
    }
});

login_router.get("/register", async (req, res) => {
    try
    {
        res.render("signup", {title: "Tetrark", css_file: "/css/classic.css"})
    }
    catch (error)
    {
        res.status(500);
    }
});

login_router.post("/register", async (req, res) => {
    try
    {
        const user = new User(req.body);
		await user.save();
		const auth_token = await user.generate_jwt();
		console.log(`Data during /login/register : \nuser : ${user}\nauth_token : ${auth_token}\n`);
        res.status(201).send({user, auth_token});
    }
    catch (error)
    {
        console.log(error);
		console.log(error.toString());
        console.log("At register");
        res.status(500).send(error.toString());
    }
});

export default login_router;