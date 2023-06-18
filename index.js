import express from "express";
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from "./router/index.js";
import {ErrorMiddleWare} from './middlewares/ErrorMiddleWare.js'

import dotenv from 'dotenv'
dotenv.config()


const app = express();

const PORT = process.env.PORT || 4444
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: true,
  optionsSuccessStatus: 200,
  credentials: true
}));

app.use('/uploads', express.static('uploads'))
app.use(router)
app.use(ErrorMiddleWare)

function start() {
  try{
    mongoose.connect(process.env.MONGO_DB_CONNETC)
    console.log('mongo connect')
  } catch(e) {
    console.log(e)
  }
}
app.listen(PORT, () => {
  console.log(`server start on port ${PORT}`);
  start()
});