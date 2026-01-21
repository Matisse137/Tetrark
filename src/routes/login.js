import express from 'express';
//import { authentification } from "../middlewares/authentification.js";

const login_router = express.Router();

login_router.get("/", (req, res) => {
    try
    {
        res.render("login", {title: "login", css_file: "/css/classic.css"})
    }
    catch (error)
    {
        res.status(500);
    }
});

export default login_router;