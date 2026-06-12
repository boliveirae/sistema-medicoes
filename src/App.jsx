import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { db } from './firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export default function App() {
  const [medicoes, setMedicoes] = useState([]);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  // Função para buscar as medições do Firebase
  const buscarMedicoes = async () => {
    const q = query(collection(db, "medicoes"), orderBy("data", "desc"));
    const querySnapshot = await getDocs(q);
    const lista = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMedicoes(lista);
  };

  useEffect(() => {
    buscarMedicoes();
  }, []);

  const adicionarMedicao = async (e) => {
    e.preventDefault();
    if (!nome || !valor) return;
    
    await addDoc(collection(db, "medicoes"), {
      nome,
      valor,
      data: new Date().toISOString()
    });
    
    setNome('');
    setValor('');
    buscarMedicoes();
  };

  const removerMedicao = async (id) => {
    await deleteDoc(doc(db, "medicoes", id));
    buscarMedicoes();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="bg-blue-600 p-6 text-white rounded-t-xl">
          <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardList /> Medições Cloud</h1>
        </div>

        <form onSubmit={adicionarMedicao} className="p-6 border-b">
          <div className="flex flex-col gap-4">
            <input className="p-2 border rounded" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input type="number" className="p-2 border rounded" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} />
            <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Adicionar à Nuvem</button>
          </div>
        </form>

        <div className="p-6">
          {medicoes.map((m) => (
            <div key={m.id} className="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded border">
              <div><p className="font-bold">{m.nome}</p></div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-blue-600">{m.valor}</span>
                <button onClick={() => removerMedicao(m.id)} className="text-red-500"><Trash2 size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}