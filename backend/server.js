import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './src/config/db.js';
import mainAPI from './src/routes/main.route.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:5173', // your React frontend port
  credentials: true
}));
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('API is running');
})

app.use('/api', mainAPI)

app.listen(PORT, ()=>{
    connectDB();
    console.log(`server running on the port number ${PORT}`);
});