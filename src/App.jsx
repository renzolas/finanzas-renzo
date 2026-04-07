import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Wallet, CreditCard, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function App() {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Diversion');
  const [metodo, setMetodo] = useState('Yape');
  const [loading, setLoading] = useState(false);

  // Lógica de Mes Fiscal (Cierre día 10)
  const getMesFiscal = () => {
    const hoy = new Date();
    let mes = hoy.getMonth() + 1; 
    if (hoy.getDate() > 10) mes += 1;
    if (mes > 12) mes = 1;
    const nombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return nombres[mes - 1];
  };

  const handleGuardar = async () => {
    if (!monto) return alert("Pon un monto, Renzo");
    setLoading(true);

    const { error } = await supabase
      .from('test_transacciones') // Usamos la tabla de prueba que creamos
      .insert([{ 
        monto: parseFloat(monto), 
        categoria_id: null, // Luego lo vincularemos con IDs reales
        metodo_pago: metodo,
        mes_fiscal: getMesFiscal(),
        fecha: new Date().toISOString().split('T')[0]
      }]);

    setLoading(false);
    if (error) alert("Error: " + error.message);
    else {
      alert("✅ Guardado en Supabase y listo para el Excel");
      setMonto('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-blue-600">Finanzas Renzo</h1>
        <p className="text-gray-500 text-sm">Control de Gastos & Reservas</p>
      </header>

      <main className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6">
        <div className="mb-6">
          <label className="block text-gray-400 text-sm mb-1">Monto (Soles)</label>
          <input 
            type="number" 
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full text-4xl font-bold border-b-2 border-gray-100 focus:border-blue-500 outline-none pb-2"
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button onClick={() => setMetodo('Yape')} className={`p-4 rounded-2xl flex flex-col items-center ${metodo === 'Yape' ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-50'}`}>
            <Wallet className="text-purple-600 mb-1" />
            <span className="text-xs font-semibold">Yape/Plin</span>
          </button>
          <button onClick={() => setMetodo('TC BCP')} className={`p-4 rounded-2xl flex flex-col items-center ${metodo === 'TC BCP' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'}`}>
            <CreditCard className="text-blue-600 mb-1" />
            <span className="text-xs font-semibold">TC BCP</span>
          </button>
        </div>

        <div className="space-y-3 mb-8">
          {['Diversion', 'Carro', 'Comida', 'Ingreso'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`w-full p-4 rounded-xl text-left flex justify-between items-center ${categoria === cat ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-700'}`}
            >
              <span>{cat}</span>
              {cat === 'Ingreso' ? <ArrowUpCircle size={20}/> : <ArrowDownCircle size={20}/>}
            </button>
          ))}
        </div>

        <button 
          onClick={handleGuardar}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform"
        >
          {loading ? 'Procesando...' : 'Guardar Gasto'}
        </button>
      </main>
    </div>
  );
}
