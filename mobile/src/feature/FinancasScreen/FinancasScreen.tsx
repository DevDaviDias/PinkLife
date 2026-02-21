import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { TrendingUp, TrendingDown, DollarSign, Plus, Trash2, List, PieChart, Calculator } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Receita" | "Despesa";
  categoria: string;
  data: string;
  mesAno: string;
}

const CATEGORIAS_DESPESA = ["Alimentação", "Transporte", "Beleza", "Lazer", "Saúde", "Educação", "Outros"];
const CATEGORIAS_RECEITA = ["Salário", "Mesada", "Extra", "Presente"];

type Aba = "Registrar" | "Historico" | "Calculadora";

export default function Financas() {
  const [aba, setAba] = useState<Aba>("Registrar");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const dataAtual = new Date();
  const mesAnoAtual = `${dataAtual.getMonth() + 1}/${dataAtual.getFullYear()}`;

  // Form
  const [desc, setDesc] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<"Receita" | "Despesa">("Despesa");
  const [categoria, setCategoria] = useState(CATEGORIAS_DESPESA[0]);

  // Calculadora
  const [calcInput, setCalcInput] = useState("");
  const [calcResult, setCalcResult] = useState("0");

  // Carregar do AsyncStorage
  useEffect(() => {
    async function load() {
      const saved = await AsyncStorage.getItem(`financas_${mesAnoAtual}`);
      if (saved) setTransacoes(JSON.parse(saved));
    }
    load();
  }, [mesAnoAtual]);

  // Salvar no AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem(`financas_${mesAnoAtual}`, JSON.stringify(transacoes));
  }, [transacoes, mesAnoAtual]);

  const receitasTotal = transacoes.filter(t => t.tipo === "Receita").reduce((acc, t) => acc + t.valor, 0);
  const despesasTotal = transacoes.filter(t => t.tipo === "Despesa").reduce((acc, t) => acc + t.valor, 0);
  const saldoTotal = receitasTotal - despesasTotal;

  const gastosPorCategoria = CATEGORIAS_DESPESA.map(cat => {
    const totalCat = transacoes
      .filter(t => t.tipo === "Despesa" && t.categoria === cat)
      .reduce((acc, t) => acc + t.valor, 0);
    const porcentagem = despesasTotal > 0 ? (totalCat / despesasTotal) * 100 : 0;
    return { nome: cat, valor: totalCat, porcentagem };
  }).filter(item => item.valor > 0);

  function registrarTransacao() {
    if (!desc || !valor) {
      Alert.alert("Atenção 🌸", "Preencha a descrição e o valor.");
      return;
    }
    const nova: Transacao = {
      id: Date.now(),
      descricao: desc,
      valor: parseFloat(valor),
      tipo,
      categoria,
      data: new Date().toLocaleDateString("pt-BR"),
      mesAno: mesAnoAtual,
    };
    setTransacoes([nova, ...transacoes]);
    setDesc("");
    setValor("");
    Alert.alert("Yay! 🎀", "Transação registrada com sucesso!");
  }

  function handleCalc(v: string) {
    if (v === "C") { setCalcInput(""); setCalcResult("0"); return; }
    if (v === "=") {
      try { setCalcResult(String(eval(calcInput))); }
      catch { setCalcResult("Erro"); }
      return;
    }
    setCalcInput(prev => prev + v);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Título */}
      <Text style={styles.pageTitle}>💰 Finanças</Text>
      <Text style={styles.pageSubtitle}>Controle mensal — {mesAnoAtual}</Text>

      {/* Cards de resumo */}
      <View style={styles.cardsRow}>
        <View style={[styles.summaryCard, { borderColor: "#bbf7d0" }]}>
          <TrendingUp size={18} color="#16a34a" />
          <Text style={styles.summaryLabel}>Receitas</Text>
          <Text style={[styles.summaryValue, { color: "#16a34a" }]}>R$ {receitasTotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: "#fecaca" }]}>
          <TrendingDown size={18} color="#dc2626" />
          <Text style={styles.summaryLabel}>Despesas</Text>
          <Text style={[styles.summaryValue, { color: "#dc2626" }]}>R$ {despesasTotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: "#bfdbfe" }]}>
          <DollarSign size={18} color="#2563eb" />
          <Text style={styles.summaryLabel}>Saldo</Text>
          <Text style={[styles.summaryValue, { color: saldoTotal >= 0 ? "#2563eb" : "#dc2626" }]}>
            R$ {saldoTotal.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Menu de abas */}
      <View style={styles.tabRow}>
        {(["Registrar", "Historico", "Calculadora"] as Aba[]).map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.tab, aba === a && styles.tabActive]}
            onPress={() => setAba(a)}
          >
            <Text style={[styles.tabText, aba === a && styles.tabTextActive]}>
              {a === "Historico" ? "Histórico" : a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ABA: Registrar */}
      {aba === "Registrar" && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}><Plus size={16} color="#ec4899" /> Nova Transação</Text>

          {/* Tipo */}
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.tipoRow}>
            {(["Despesa", "Receita"] as const).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.tipoBtn, tipo === t && (t === "Receita" ? styles.tipoBtnReceita : styles.tipoBtnDespesa)]}
                onPress={() => {
                  setTipo(t);
                  setCategoria(t === "Receita" ? CATEGORIAS_RECEITA[0] : CATEGORIAS_DESPESA[0]);
                }}
              >
                <Text style={[styles.tipoBtnText, tipo === t && styles.tipoBtnTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Categoria */}
          <Text style={styles.label}>Categoria</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={styles.categoriaRow}>
              {(tipo === "Receita" ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoriaBtn, categoria === cat && styles.categoriaBtnActive]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[styles.categoriaBtnText, categoria === cat && styles.categoriaBtnTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Descrição */}
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            placeholder="Ex: Supermercado"
            placeholderTextColor="#f9a8d4"
            value={desc}
            onChangeText={setDesc}
            style={styles.input}
          />

          {/* Valor */}
          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            placeholder="0,00"
            placeholderTextColor="#f9a8d4"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
            style={[styles.input, { color: "#ec4899", fontWeight: "700" }]}
          />

          <TouchableOpacity style={styles.addButton} onPress={registrarTransacao}>
            <Text style={styles.addButtonText}>Adicionar Transação 🎀</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ABA: Histórico */}
      {aba === "Historico" && (
        <View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}><List size={16} color="#ec4899" /> Histórico</Text>
            {transacoes.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma transação ainda 🌸</Text>
            ) : (
              transacoes.map(t => (
                <View key={t.id} style={styles.transacaoCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.transacaoDesc}>{t.descricao}</Text>
                    <Text style={styles.transacaoMeta}>{t.categoria} • {t.data}</Text>
                  </View>
                  <Text style={[styles.transacaoValor, { color: t.tipo === "Receita" ? "#16a34a" : "#dc2626" }]}>
                    {t.tipo === "Receita" ? "+" : "-"} R$ {t.valor.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setTransacoes(transacoes.filter(tr => tr.id !== t.id))}
                    style={{ marginLeft: 8 }}
                  >
                    <Trash2 size={16} color="#f9a8d4" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Gráfico por categoria */}
          {gastosPorCategoria.length > 0 && (
            <View style={[styles.card, { marginTop: 12 }]}>
              <Text style={styles.sectionTitle}><PieChart size={16} color="#ec4899" /> Gastos por Categoria</Text>
              {gastosPorCategoria.map(item => (
                <View key={item.nome} style={{ marginBottom: 12 }}>
                  <View style={styles.graficRow}>
                    <Text style={styles.graficLabel}>{item.nome}</Text>
                    <Text style={styles.graficValor}>R$ {item.valor.toFixed(2)} ({item.porcentagem.toFixed(1)}%)</Text>
                  </View>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${item.porcentagem}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ABA: Calculadora */}
      {aba === "Calculadora" && (
        <View style={styles.card}>
          {/* Display */}
          <View style={styles.calcDisplay}>
            <Text style={styles.calcInput}>{calcInput || "0"}</Text>
            <Text style={styles.calcResult}>{calcResult}</Text>
          </View>

          {/* Botões */}
          <View style={styles.calcGrid}>
            {["C", "/", "%", "*", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "=", "0", "."].map(btn => (
              <TouchableOpacity
                key={btn}
                style={[
                  styles.calcBtn,
                  btn === "=" && styles.calcBtnEqual,
                  btn === "0" && styles.calcBtnZero,
                ]}
                onPress={() => handleCalc(btn)}
              >
                <Text style={[styles.calcBtnText, btn === "=" && styles.calcBtnTextEqual]}>
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff0f6",
    paddingHorizontal: 16,
    paddingTop: 56,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#be185d",
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#f9a8d4",
    fontWeight: "500",
    marginBottom: 16,
    marginTop: 2,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    alignItems: "center",
    gap: 4,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 10,
    color: "#9ca3af",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "800",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fce7f3",
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#ec4899",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f9a8d4",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#be185d",
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#f9a8d4",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  tipoRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tipoBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fce7f3",
    borderWidth: 1.5,
    borderColor: "#fce7f3",
  },
  tipoBtnReceita: {
    backgroundColor: "#dcfce7",
    borderColor: "#86efac",
  },
  tipoBtnDespesa: {
    backgroundColor: "#fee2e2",
    borderColor: "#fca5a5",
  },
  tipoBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f9a8d4",
  },
  tipoBtnTextActive: {
    color: "#374151",
  },
  categoriaRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 4,
  },
  categoriaBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fce7f3",
    borderWidth: 1,
    borderColor: "#fce7f3",
  },
  categoriaBtnActive: {
    backgroundColor: "#ec4899",
    borderColor: "#ec4899",
  },
  categoriaBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f9a8d4",
  },
  categoriaBtnTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff0f6",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#fce7f3",
    padding: 14,
    marginBottom: 12,
    color: "#be185d",
    fontSize: 14,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#ec4899",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  emptyText: {
    textAlign: "center",
    color: "#f9a8d4",
    fontWeight: "600",
    paddingVertical: 16,
  },
  transacaoCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#fce7f3",
  },
  transacaoDesc: {
    fontWeight: "700",
    fontSize: 14,
    color: "#be185d",
  },
  transacaoMeta: {
    fontSize: 11,
    color: "#f9a8d4",
    marginTop: 2,
  },
  transacaoValor: {
    fontWeight: "800",
    fontSize: 14,
  },
  graficRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  graficLabel: {
    fontWeight: "700",
    fontSize: 13,
    color: "#be185d",
  },
  graficValor: {
    fontSize: 12,
    color: "#f9a8d4",
  },
  progressBg: {
    height: 8,
    backgroundColor: "#fce7f3",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    backgroundColor: "#ec4899",
    borderRadius: 4,
  },
  calcDisplay: {
    backgroundColor: "#be185d",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "flex-end",
  },
  calcInput: {
    color: "#f9a8d4",
    fontSize: 14,
    marginBottom: 4,
  },
  calcResult: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
  },
  calcGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  calcBtn: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#fce7f3",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  calcBtnEqual: {
    backgroundColor: "#ec4899",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  calcBtnZero: {
    width: "47%",
  },
  calcBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ec4899",
  },
  calcBtnTextEqual: {
    color: "#fff",
  },
});