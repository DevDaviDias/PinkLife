import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Interface que define a estrutura do "Progress"
// Isso vai evitar que você erre nomes de propriedades no futuro
interface IUserProgress {
  tarefas: any[];
  habitos: any[];
  treinos: any[];
  materias: any[];
  historicoEstudos: any[];
  financas: any[];
  saude: Record<string, any>;
  beleza: {
    skincareManha: { limpador: boolean; tonico: boolean; hidratante: boolean; protetor: boolean };
    skincareNoite: { demaquilante: boolean; limpador: boolean; serum: boolean; hidratante: boolean };
    cronogramaCapilar: string;
  };
  alimentacao: {
    refeicoes: { cafe: string; almoco: string; lanche: string; jantar: string };
    compras: any[];
  };
  viagens: { mala: any[] };
  casa: {
    tarefas: any[];
    cardapio: { almoco: string; jantar: string };
  };
}

// 2. Interface que define o documento do Usuário no MongoDB
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Opcional porque as vezes removemos no .select('-password')
  progress: IUserProgress;
  createdAt: Date;
  updatedAt: Date;
}

// 3. O Schema do Mongoose (definição para o banco de dados)
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { type: String, required: true },
  progress: { 
    type: Schema.Types.Mixed, 
    default: {} // O default agora virá do nosso helper userDefaults.ts no controller
  }
}, { 
  minimize: false, 
  timestamps: true 
});

// 4. Exportação do Modelo
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;