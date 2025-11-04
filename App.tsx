import React, { useState } from 'react';
import { SurveyForm } from './components/SurveyForm.tsx';

const Intro = ({ onStart }: { onStart: () => void }) => (
  <div className="text-center p-8 max-w-2xl mx-auto">
    <h1 className="text-4xl font-bold text-orange-600 mb-4">Pravilna užina & vi</h1>
    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Kaori sušeni kaki / ćupter</h2>
    <p className="text-lg text-gray-600 mb-4">
      Anketa za razvoj nove pravilne užine iz Bosne i Hercegovine, sušenog kakija / ćuptera marke Kaori. Vaši odgovori pomažu u stvaranju proizvoda prilagođenog vašim željama.
    </p>
    <p className="text-lg text-gray-600 mb-8">
      Na kraju ankete možda imate priliku isprobati uzorak. 🍊
    </p>
    <button
      onClick={onStart}
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg"
    >
      Započni anketu
    </button>
  </div>
);

const Final = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="text-center p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">Hvala vam na sudjelovanju!</h1>
      <p className="text-lg text-gray-600 mb-6">
        Ako želite, možete ostaviti e-mail (opcionalno) i bit ćete među prvima koji će dobiti uzorak proizvoda kad bude spreman. 😊
      </p>
      {submitted ? (
        <p className="text-xl font-semibold text-green-600 mt-8">Hvala! Vaša e-mail adresa je zabilježena.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Vaša e-mail adresa (opcionalno)"
            className="w-full sm:w-80 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md w-full sm:w-auto"
          >
            Pošalji
          </button>
        </form>
      )}
    </div>
  );
};


const App: React.FC = () => {
  const [view, setView] = useState<'intro' | 'survey' | 'final'>('intro');

  const handleStart = () => setView('survey');
  const handleComplete = () => setView('final');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-orange-50 text-gray-800">
      <main className="w-full">
        {view === 'intro' && <Intro onStart={handleStart} />}
        {view === 'survey' && <SurveyForm onComplete={handleComplete} />}
        {view === 'final' && <Final />}
      </main>
    </div>
  );
};

export default App;