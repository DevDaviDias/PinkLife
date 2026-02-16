export const userDefaults = {
  tarefas: [],
  habitos: [],
  treinos: [],
  materias: [],
  historicoEstudos: [],
  financas: [],
  saude: {},
  beleza: {
    skincareManha: { limpador: false, tonico: false, hidratante: false, protetor: false },
    skincareNoite: { demaquilante: false, limpador: false, serum: false, hidratante: false },
    cronogramaCapilar: "Hidratação"
  },
  alimentacao: {
    refeicoes: { cafe: "", almoco: "", lanche: "", jantar: "" },
    compras: []
  },
  viagens: { mala: [] },
  casa: {
    tarefas: [],
    cardapio: { almoco: "", jantar: "" }
  }
};

export default userDefaults;