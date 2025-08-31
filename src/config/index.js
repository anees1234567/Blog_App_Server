const dotenv=require("dotenv")
dotenv.config()
const PORT = process.env.PORT ? process.env.PORT : 3000;
const DB_URL = process.env.databaseUrl || 'database_url';
const HOST = process.env.HOST || 'localhost'
const SECRET_KEY =process.env.TokenKey
const REFRESH_SECRET=process.env.RefreshKey

const allowedOrigins = [
  "http://localhost:3001",   
  "https://blogiflow.netlify.app" 
];


module.exports={PORT,DB_URL,HOST,SECRET_KEY,REFRESH_SECRET,allowedOrigins}

