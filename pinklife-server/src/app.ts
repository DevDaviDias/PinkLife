import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.xvyco85.mongodb.net/pinklife`)
  .then(() => {
    console.log("✅ MongoDB Conectado");
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.log("❌ Erro:", err));