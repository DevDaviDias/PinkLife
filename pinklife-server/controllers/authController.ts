import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import userDefaults from '../utils/userDefaults';

// 1. Registro de Usuário
export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmpassword } = req.body;

  // Validações básicas
  if (!name || !email || !password) {
    return res.status(422).json({ msg: "Campos obrigatórios faltando!" });
  }

  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "As senhas não conferem!" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(422).json({ msg: "E-mail já cadastrado!" });
    }

    // Criando o hash da senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: passwordHash,
      progress: userDefaults // Seus valores padrão de utils
    });

    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro ao registrar usuário" });
  }
};

// 2. Login de Usuário
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ msg: "E-mail e senha são obrigatórios!" });
  }

  try {
    // Buscamos o usuário
    const user = await User.findOne({ email });

    // Verificação de segurança para o TypeScript
    // Se o user não existir ou não tiver senha, barramos aqui
    if (!user || !user.password) {
      return res.status(404).json({ msg: "Usuário não encontrado ou dados inválidos!" });
    }

    // O TS agora sabe que user.password é uma string válida
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida!" });
    }

    // Geração do Token JWT
    const secret = process.env.SECRET || "sua_chave_secreta_fallback";
    const token = jwt.sign(
      { id: user._id },
      secret,
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      msg: "Autenticação realizada com sucesso", 
      token, 
      userId: user._id 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro no servidor ao realizar login" });
  }
};