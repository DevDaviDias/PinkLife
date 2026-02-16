import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definindo uma interface para o Token (opcional, mas recomendado)
interface TokenPayload {
  id: string;
}

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ msg: 'Acesso negado!' });

  try {
    const secret = process.env.SECRET as string;
    const decoded = jwt.verify(token, secret) as TokenPayload;
    
    // Aqui o TS vai reclamar que 'user' não existe no tipo Request. 
    // Vamos resolver isso em seguida!
    (req as any).user = decoded; 
    
    next();
  } catch (erro) {
    res.status(400).json({ msg: "Token inválido!" });
  }
};

export default checkToken;