MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Buscamos exatamente os nomes que você tem no seu .env
        const user = configService.get<string>('DB_USER');
        const pass = configService.get<string>('DB_PASS');

        // Se por algum motivo estiver vazio, ele avisa no terminal em vez de travar tudo
        if (!user || !pass) {
          console.error('❌ ERRO: DB_USER ou DB_PASS não encontrados no .env');
        }

        const encodedPass = encodeURIComponent(pass || '');

        return {
          uri: `mongodb+srv://${user}:${encodedPass}@cluster0.xvyco85.mongodb.net/pinklife?retryWrites=true&w=majority`,
        };
      },
      inject: [ConfigService],
    }),