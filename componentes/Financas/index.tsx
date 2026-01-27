"use client";

import { useState, useEffect } from "react";
import ContainerPages from "../ui/ContainerPages";
import Cabecalho from "../ui/Cabecalho";
import Cardprogresso from "../ui/Cardprogresso";
import GrayMenu from "@/componentes/ui/GrayMenu";
import { TrendingUp, TrendingDown, DollarSign, Plus, Trash2, Calculator, List, PieChart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/componentes/ui/card";
import Button from "../ui/Button";

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Receita" | "Despesa";
  categoria: string;
  data: string;
  mesAno: string; // Formato "MM/YYYY" para controle mensal
}

const CATEGORIAS_DESPESA = ["Alimentação", "Transporte", "Beleza", "Lazer", "Saúde", "Educação", "Outros"];
const CATEGORIAS_RECEITA = ["Salário", "Mesada", "Extra", "Presente"];

export default function Financas() {
  const [active, setActive] = useState("Registrar");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  
  // Estado do Mês Atual para o Controle
  const dataAtual = new Date();
  const mesAnoAtual = `${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}`;

  // Estados do Formulário
  const [desc, setDesc] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<"Receita" | "Despesa">("Despesa");
  const [categoria, setCategoria] = useState(CATEGORIAS_DESPESA[0]);

  // Estados da Calculadora
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState("0");

  useEffect(() => {
    const saved = localStorage.getItem(`financas_${mesAnoAtual}`);
    if (saved) setTransacoes(JSON.parse(saved));
  }, [mesAnoAtual]);

  useEffect(() => {
    localStorage.setItem(`financas_${mesAnoAtual}`, JSON.stringify(transacoes));
  }, [transacoes, mesAnoAtual]);

  // --- Cálculos de Resumo ---
  const receitasTotal = transacoes.filter(t => t.tipo === "Receita").reduce((acc, t) => acc + t.valor, 0);
  const despesasTotal = transacoes.filter(t => t.tipo === "Despesa").reduce((acc, t) => acc + t.valor, 0);
  const saldoTotal = receitasTotal - despesasTotal;

  // --- Lógica do Gráfico (Gastos por Categoria) ---
  const gastosPorCategoria = CATEGORIAS_DESPESA.map(cat => {
    const totalCat = transacoes
      .filter(t => t.tipo === "Despesa" && t.categoria === cat)
      .reduce((acc, t) => acc + t.valor, 0);
    const porcentagem = despesasTotal > 0 ? (totalCat / despesasTotal) * 100 : 0;
    return { nome: cat, valor: totalCat, porcentagem };
  }).filter(item => item.valor > 0);

  const registrarTransacao = () => {
    if (!desc || !valor) return;
    const nova: Transacao = {
      id: Date.now(),
      descricao: desc,
      valor: parseFloat(valor),
      tipo: tipo,
      categoria: categoria,
      data: new Date().toLocaleDateString('pt-BR'),
      mesAno: mesAnoAtual
    };
    setTransacoes([nova, ...transacoes]);
    setDesc(""); setValor("");
  };

  const handleCalc = (v: string) => {
    if (v === "C") { setCalcInput(""); setCalcResult("0"); return; }
    if (v === "=") { try { setCalcResult(String(eval(calcInput))); } catch { setCalcResult("Erro"); } return; }
    setCalcInput(prev => prev + v);
  };

  return (
    <ContainerPages>
      <Cabecalho title={`Finanças - ${mesAnoAtual} 💰`} imageSrc="/images/hello-kitty-finance.jpg">
        <p>Controle mensal de gastos e economias ✨</p>
      </Cabecalho>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Cardprogresso title="Receitas" icon={<TrendingUp className="text-green-500" />} valor={`R$ ${receitasTotal.toFixed(2)}`} />
        <Cardprogresso title="Despesas" icon={<TrendingDown className="text-red-500" />} valor={`R$ ${despesasTotal.toFixed(2)}`} />
        <Cardprogresso title="Saldo" icon={<DollarSign className="text-blue-500" />} valor={`R$ ${saldoTotal.toFixed(2)}`} />
      </div>

      <GrayMenu items={[
        { title: "Registrar", onClick: () => setActive("Registrar"), active: active === "Registrar" },
        { title: "Histórico", onClick: () => setActive("Tabela"), active: active === "Tabela" },
        { title: "Calculadora", onClick: () => setActive("calculadora"), active: active === "calculadora" }
      ]} />

      <div className="mt-6 space-y-6">
        {active === "Registrar" && (
          <div className="bg-white p-6 rounded-3xl border-2 border-pink-50 shadow-sm max-w-2xl mx-auto">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2 tracking-tight">
              <Plus className="text-pink-500" /> NOVA TRANSAÇÃO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Tipo</label>
                <select value={tipo} onChange={(e) => {
                  const t = e.target.value as "Receita" | "Despesa";
                  setTipo(t);
                  setCategoria(t === "Receita" ? CATEGORIAS_RECEITA[0] : CATEGORIAS_DESPESA[0]);
                }} className="w-full p-3 bg-pink-50/30 border border-pink-100 rounded-xl outline-none mt-1">
                  <option value="Despesa">Despesa</option>
                  <option value="Receita">Receita</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Categoria</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-3 bg-pink-50/30 border border-pink-100 rounded-xl outline-none mt-1">
                  {(tipo === "Receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Descrição</label>
                <input placeholder="Ex: Supermercado" value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-3 bg-pink-50/30 border border-pink-100 rounded-xl outline-none mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Valor (R$)</label>
                <input type="number" placeholder="0,00" value={valor} onChange={e => setValor(e.target.value)} className="w-full p-3 bg-pink-50/30 border border-pink-100 rounded-xl outline-none mt-1 font-bold text-pink-600" />
              </div>
            </div>
            <button onClick={registrarTransacao} className="w-full py-4 bg-pink-500 text-white rounded-2xl font-black mt-6 shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all uppercase tracking-widest">
              Adicionar Transação 🎀
            </button>
          </div>
        )}

        {active === "Tabela" && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] border border-pink-50 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-pink-50 flex items-center gap-2 font-bold text-gray-700">
                <List className="text-pink-500" size={20} /> Histórico de Transações
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-pink-50/50 text-pink-500 text-[10px] uppercase font-black">
                    <tr>
                      <th className="p-4">Data</th>
                      <th className="p-4">Tipo</th>
                      <th className="p-4">Categoria</th>
                      <th className="p-4">Descrição</th>
                      <th className="p-4 text-right">Valor</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50">
                    {transacoes.map(t => (
                      <tr key={t.id} className="text-sm hover:bg-pink-50/20 transition-colors">
                        <td className="p-4 text-gray-400">{t.data}</td>
                        <td className="p-4"><span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${t.tipo === "Receita" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{t.tipo}</span></td>
                        <td className="p-4 font-medium text-gray-600">{t.categoria}</td>
                        <td className="p-4 text-gray-600">{t.descricao}</td>
                        <td className={`p-4 text-right font-black ${t.tipo === "Receita" ? "text-green-500" : "text-red-500"}`}>
                          {t.tipo === "Receita" ? "+" : "-"} R$ {t.valor.toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={() => setTransacoes(transacoes.filter(tr => tr.id !== t.id))} className="text-gray-200 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
            </div>

            {/* GRÁFICO DE GASTOS */}
            <div className="bg-white p-8 rounded-[2rem] border border-pink-50 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2 uppercase text-sm tracking-wider">
                <PieChart className="text-pink-500" size={20} /> Gastos por Categoria
              </h3>
              <div className="space-y-6">
                {gastosPorCategoria.map(item => (
                  <div key={item.nome} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-gray-600">{item.nome}</span>
                      <span className="text-gray-400 font-medium">R$ {item.valor.toFixed(2)} ({item.porcentagem.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-pink-50 rounded-full overflow-hidden">
                      <div className="h-full bg-pink-400 rounded-full transition-all duration-1000" style={{ width: `${item.porcentagem}%` }}></div>
                    </div>
                  </div>
                ))}
                {gastosPorCategoria.length === 0 && <p className="text-center text-gray-400 text-sm">Nenhuma despesa para exibir no gráfico.</p>}
              </div>
            </div>
          </div>
        )}

        {active === "calculadora" && (

          
          <Card className="max-w-md mx-auto border-2 border-pink-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-pink-100/20">
            <div className="bg-pink-500 p-8 text-white text-right">
              <div className="text-pink-200 text-xs h-4 mb-1">{calcInput || "0"}</div>
              <div className="text-4xl font-black">{calcResult}</div>
            </div>
            <CardContent className="p-6 bg-white">
              <div className="grid grid-cols-4 gap-3">
                {["C", "/", "%", "*", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "=", "0", "."].map((btn) => (
                  <button key={btn} onClick={() => handleCalc(btn)} className={`h-14 rounded-2xl font-bold transition-all ${btn === "=" ? "bg-pink-500 text-white shadow-lg" : "bg-pink-50 text-pink-500 hover:bg-pink-100"} ${btn === "0" ? "col-span-2" : ""}`}>
                    {btn}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ContainerPages>
  );
}