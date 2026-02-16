import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita o CORS para o seu Frontend conseguir acessar o Backend
  app.enableCors();

  // Pega a porta do .env ou usa 3000 se não encontrar
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
}
bootstrap();