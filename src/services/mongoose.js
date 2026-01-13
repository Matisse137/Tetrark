import mongoose from 'mongoose';
import 'dotenv/config';

async function db_connect()
{
    await mongoose.connect(process.env.MONGODB_URL);
    await console.log('Mongo DataBase connected')
}

export { db_connect };