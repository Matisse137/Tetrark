import mongoose from 'mongoose';
import 'dotenv/config';
import chalk from "chalk";

async function db_connect()
{
    await mongoose.connect(process.env.MONGODB_URL);
    await console.log(chalk.bgBlack.green('Mongo DataBase connected'))
}

export { db_connect };