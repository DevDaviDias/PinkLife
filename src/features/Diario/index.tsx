"use client";

import { useState, useRef, useEffect } from "react";
// @ts-ignore
import HTMLFlipBook from "react-pageflip";
import { 
  BookHeart, ChevronLeft, ChevronRight, Camera, 
  Sparkles, Heart, Save, PenLine, BookOpen, Loader2 
} from "lucide-react";
import ContainerPages from "@/src/componentes/ui/ContainerPages";

export default function DiarioLivro() {
  const bookRef = useRef<any>(null);
  const [aba, setAba] = useState<"escrever" | "ler">("escrever");
  const [entradas, setEntradas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscandoDados, setBuscandoDados] = useState(true);

  // Estados do Formulário
  const [texto, setTexto] = useState("");
  const [humor, setHumor] = useState("✨");
  const [destaque, setDestaque] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // Puxando a URL do seu .env
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 1. BUSCAR DADOS DA API (GET)
  useEffect(() => {
    const carregarDiario = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setBuscandoDados(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/diario`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const dados = await response.json();
          // Invertemos para que a primeira escrita seja a primeira página (ordem cronológica)
          if (Array.isArray(dados)) {
            setEntradas([...dados].reverse());
          }
        }
      } catch (e) {
        console.error("Erro ao conectar com a API:", e);
      } finally {
        setBuscandoDados(false);
      }
    };
    carregarDiario();
  }, [API_URL]);

  // 2. SALVAR NA API (POST com FormData para Multer/Cloudinary)
  const salvarNoDiario = async () => {
    if (!texto.trim()) return alert("Escreva algo no seu diário!");
    if (!fotoFile) return alert("Selecione uma foto para sua memória!");

    setLoading(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("foto", fotoFile);
    formData.append("texto", texto);
    formData.append("humor", humor);
    formData.append("destaque", destaque);

    try {
      const response = await fetch(`${API_URL}/diario/upload`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const novaEntrada = await response.json();
        // Adiciona a nova entrada no final da lista local para manter a ordem do livro
        setEntradas([...entradas, novaEntrada]);
        
        // Limpa campos e volta para leitura
        setTexto(""); setDestaque(""); setFotoFile(null); setPreview(""); setHumor("✨");
        setAba("ler");
      } else {
        const err = await response.json();
        alert(err.msg || "Erro ao salvar memória");
      }
    } catch (e) {
      alert("Erro de conexão com o servidor. Verifique se a API está online.");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <ContainerPages>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
        .font-cursiva { font-family: 'Dancing Script', cursive !important; }
        .bg-repeating-lines {
          background-image: linear-gradient(transparent 31px, #f3e8ff 32px);
          background-size: 100% 32px;
        }
        .area-texto-livro {
          max-height: 480px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #fbcfe8 transparent;
          padding-right: 8px;
        }
        .area-texto-livro::-webkit-scrollbar { width: 5px; }
        .area-texto-livro::-webkit-scrollbar-thumb { background-color: #fbcfe8; border-radius: 10px; }
      `}</style>

      <div className="min-h-screen bg-[#FDF2F5] py-10 flex flex-col items-center">
        
        {/* CABEÇALHO */}
        <div className="w-full max-w-[500px] mb-8 px-4">
          <h1 className="text-3xl font-serif italic text-pink-500 flex items-center justify-center gap-3 mb-6">
            <BookHeart size={32} /> Meu Diário Rosa
          </h1>
          
          <div className="flex bg-white/50 p-1.5 rounded-3xl shadow-sm border border-pink-100">
            <button onClick={() => setAba("escrever")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${aba === "escrever" ? "bg-pink-500 text-white shadow-md" : "text-pink-400"}`}>
              <PenLine size={18} /> Escrever
            </button>
            <button onClick={() => setAba("ler")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${aba === "ler" ? "bg-pink-500 text-white shadow-md" : "text-pink-400"}`}>
              <BookOpen size={18} /> Ver Livro
            </button>
          </div>
        </div>

        <div className="w-full flex justify-center px-4">
          {aba === "escrever" ? (
            /* --- MODO ESCRITA --- */
            <div className="w-full max-w-[500px] flex flex-col">
              <div className="w-full bg-[#FFFBF2] shadow-2xl rounded-sm p-8 pb-12 relative border-l-[40px] border-white min-h-[600px] flex flex-col">
                <div className="absolute left-[-28px] top-0 bottom-0 flex flex-col justify-around py-8">
                  {[...Array(12)].map((_, i) => <div key={i} className="w-3.5 h-3.5 bg-gray-300 rounded-full shadow-inner" />)}
                </div>
                
                <div className="relative z-10 flex flex-col h-full flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-serif text-pink-400 text-lg border-b border-pink-100 pb-1">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                    <input value={humor} onChange={e => setHumor(e.target.value)} className="w-10 bg-transparent text-2xl outline-none text-center" />
                  </div>

                  <label className="relative mb-6 cursor-pointer block">
                    {preview ? (
                      <img src={preview} className="w-full h-40 object-cover border-4 border-white shadow-md rotate-1" />
                    ) : (
                      <div className="w-full h-40 border-2 border-dashed border-pink-100 flex flex-col items-center justify-center text-pink-200 hover:bg-pink-50 rounded-lg">
                        <Camera size={30} />
                        <span className="text-[10px] uppercase mt-2 font-bold">Adicionar Foto</span>
                      </div>
                    )}
                    <input type="file" hidden onChange={handleImage} accept="image/*" />
                  </label>

                  <input placeholder="Título do momento..." value={destaque} onChange={e => setDestaque(e.target.value)} className="w-full bg-transparent border-b border-pink-50 py-2 outline-none font-bold text-gray-700 mb-4 text-xl" />

                  <textarea placeholder="Querido Diário..." value={texto} onChange={e => setTexto(e.target.value)} className="flex-1 w-full bg-transparent outline-none resize-none font-cursiva text-3xl leading-8 text-gray-600 bg-repeating-lines" />
                </div>
              </div>

              <div className="w-full flex justify-end mt-4">
                <button 
                  onClick={salvarNoDiario} 
                  disabled={loading}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-black px-12 py-4 rounded-2xl shadow-xl flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={22} />}
                  {loading ? "SALVANDO..." : "GUARDAR MEMÓRIA"}
                </button>
              </div>
            </div>
          ) : (
            /* --- MODO LEITURA --- */
            <div className="flex flex-col items-center">
              {buscandoDados ? (
                <div className="flex flex-col items-center gap-4 text-pink-400 mt-20">
                  <Loader2 size={48} className="animate-spin" />
                  <p className="font-bold">Abrindo seu diário rosa...</p>
                </div>
              ) : (
                <div className="relative">
                  {/* @ts-ignore */}
                  <HTMLFlipBook width={500} height={650} size="fixed" showCover={true} className="shadow-2xl" ref={bookRef}>
                    <div className="bg-pink-400 flex flex-col items-center justify-center text-white border-4 border-pink-300">
                      <Sparkles size={48} className="mb-4 text-pink-100" />
                      <h2 className="font-serif text-4xl italic mb-2">Pink Life</h2>
                      <p className="uppercase tracking-[0.3em] text-[10px]">Memórias na Nuvem</p>
                    </div>

                    {entradas.map((entry: any, index: number) => (
                      <div key={entry.id} className="bg-[#FFFBF2] p-10 relative h-full flex flex-col border-l border-pink-100">
                        <div className="flex justify-between items-start mb-4 border-b border-pink-50 pb-2">
                          <span className="font-serif text-pink-300 text-lg">
                            {new Date(entry.data).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="text-2xl">{entry.humor}</span>
                        </div>

                        <div className="flex-1 area-texto-livro">
                          {entry.fotoUrl && (
                            <div className="relative mb-4 mt-2 rotate-1">
                              <img src={entry.fotoUrl} className="w-full h-44 object-cover border-4 border-white shadow-md" />
                            </div>
                          )}
                          <h3 className="font-black text-gray-700 text-sm uppercase mb-2">
                            Destaque: <span className="text-pink-400">{entry.destaque}</span>
                          </h3>
                          <p className="text-gray-600 font-cursiva leading-8 text-2xl bg-repeating-lines whitespace-pre-wrap">
                            {entry.texto}
                          </p>
                        </div>

                        <div className="mt-4 flex justify-between items-center text-pink-200 pt-2">
                          <Heart size={18} fill="currentColor" />
                          <span className="text-[10px] font-sans text-gray-300 italic">Pág {index + 1}</span>
                        </div>
                      </div>
                    ))}

                    <div className="bg-pink-400 border-4 border-pink-300 flex items-center justify-center">
                      <Heart size={40} className="text-pink-200 opacity-50" />
                    </div>
                  </HTMLFlipBook>
                </div>
              )}

              <div className="mt-8 flex gap-8 items-center">
                <button onClick={() => bookRef.current.pageFlip().flipPrev()} className="p-4 bg-white rounded-full shadow-md text-pink-500 hover:scale-110 transition-all">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={() => bookRef.current.pageFlip().flipNext()} className="p-4 bg-white rounded-full shadow-md text-pink-500 hover:scale-110 transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ContainerPages>
  );
}