
import React, { useState, useMemo, FC } from 'react';
import ReactDOM from 'react-dom/client';

// --- Tipovi (iz types.ts) ---
enum QuestionType {
  SingleChoice,
  MultipleChoice,
  RatingScale,
  OpenEnded,
}

interface Question {
  id: string;
  section?: 'adult' | 'parents';
  type: QuestionType;
  text: string;
  options?: string[];
  criteria?: string[];
  maxChoices?: number;
  isOptional?: boolean;
}

type Answers = {
  [key: string]: any;
};

// --- Pitanja (iz constants.ts) ---
const ALL_QUESTIONS: Question[] = [
  {
    id: 'age',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '1. Koliko imate godina?',
    options: ['18–24', '25–34', '35–44', '45–55', '55+'],
  },
  {
    id: 'gender',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '2. Spol:',
    options: ['Muško', 'Žensko', 'Ne želim odgovoriti'],
  },
  {
    id: 'lifestyle',
    section: 'adult',
    type: QuestionType.MultipleChoice,
    text: '3. Kako biste opisali svoj stil života?',
    options: [
      'Bavim se planinarenjem / trekkingom / aktivnim sportom',
      'Vježbam 1–3× tjedno',
      'Uglavnom sjedilački način života',
      'Pravilno se hranim i/ili pratim nutritivne smjernice',
      'Tražim praktične užine za posao / školu',
    ],
  },
  {
    id: 'snack_frequency',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '4. Koliko često koristite užinu/snack između glavnih obroka?',
    options: [
      'Nikad',
      'Rijetko (manje od 1× tjedno)',
      'Povremeno (1–3× tjedno)',
      'Često (4–6× tjedno)',
      'Vrlo često (svaki dan)',
    ],
  },
  {
    id: 'criteria_importance',
    section: 'adult',
    type: QuestionType.RatingScale,
    text: '5. Kada birate užinu, koliko su vam sljedeći kriteriji važni?',
    criteria: [
      'Zdravstveni benefiti (npr. nutritivna vrijednost)',
      'Okus / zadovoljstvo',
      'Praktičnost / lako ponijeti',
      'Lokalna proizvodnja / domaći proizvod',
      'Cijena',
      'Ekološko / održivo pakiranje',
    ],
  },
  {
    id: 'tried_kaki',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '6. Da li ste ikada probali kaki (japansku jabuku) / sušeni kaki?',
    options: [
      'Da, često',
      'Da, jednom ili par puta',
      'Ne, nikada ali znam što je',
      'Ne, nikada i ne znam što je',
    ],
  },
  {
    id: 'tried_cupter',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '7. Da li ste ikada probali ćupter?',
    options: [
      'Da, često',
      'Da, jednom ili par puta',
      'Ne, nikada ali znam što je',
      'Ne, nikada i ne znam što je',
    ],
  },
  {
    id: 'interest_level',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '8. Ako biste imali priliku probati sušeni kaki / ćupter iz BiH (brend Kaori), koliko biste bili zainteresirani?',
    options: [
      '1 - Nikako zainteresiran(a)',
      '2',
      '3',
      '4',
      '5 - Odmah bih kupio/la',
    ],
  },
  {
    id: 'price_acceptability',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '9. Koju cijenu biste smatrali prihvatljivom za pakiranje (npr. 80-100 g) sušenog kakija / ćuptera kao pravilne užine?',
    options: ['Do 5 KM', '5–7 KM', '7–10 KM', 'Više od 10 KM'],
  },
  {
    id: 'motivation',
    section: 'adult',
    type: QuestionType.MultipleChoice,
    maxChoices: 2,
    text: '10. Što bi vas najviše motiviralo da kupite ovaj proizvod? (odaberite 1–2)',
    options: [
      'Zdravstveni benefiti (npr. više vlakana, antioksidansi)',
      'Praktičnost (možeš ponijeti u planinarenje/posao)',
      'Domaći brend / plod Bosne i Hercegovine',
      'Poseban ukus / novitet (nisam ranije jeo/la)',
      'Pakiranje koje je ekološki prihvatljivo',
      'Bez ulja',
    ],
  },
  {
    id: 'natural_variation',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '11. Bi li vam smetale razlike u boji i veličini komadića (čipsa) koje nastaju prirodnim sušenjem proizvoda?',
    options: [
      'Ne, to mi je sasvim u redu (prirodan proizvod)',
      'Ne, ako je okus dobar',
      'Možda, ovisi o izgledu',
      'Da, volio/la bih da su komadići ujednačeni',
    ],
  },
  {
    id: 'has_children',
    section: 'adult',
    type: QuestionType.SingleChoice,
    text: '12. Imate li djecu?',
    options: ['Da', 'Ne'],
  },
  {
    id: 'child_age',
    section: 'parents',
    type: QuestionType.SingleChoice,
    text: '13. Koliko godina ima vaše dijete (ili najstarije dijete)?',
    options: ['< 5 godina', '6–9 godina', '10–13 godina', '14–17 godina', '18+'],
  },
  {
    id: 'parent_criteria_importance',
    section: 'parents',
    type: QuestionType.RatingScale,
    text: '14. Koliko vam je važno da užine koje dijete jede budu:',
    criteria: [
      'Prirodne, bez aditiva',
      'Pravilne (npr. bogate vlaknima, vitaminima)',
      'Domaće, lokalne proizvodnje',
      'Ukusne i privlačne djeci',
      'Lako dostupne i praktične za školu',
    ],
  },
  {
    id: 'allow_child_snack',
    section: 'parents',
    type: QuestionType.SingleChoice,
    text: '15. Biste li dopustili da vaše dijete jede sušeni kaki / ćupter kao pravilnu užinu?',
    options: [
      'Da, svakako',
      'Da, ako je bez dodanog šećera',
      'Možda, ovisi o okusu i cijeni',
      'Nisam siguran/na, trebam više informacija',
      'Ne bih',
    ],
  },
  {
    id: 'parent_motivation',
    section: 'parents',
    type: QuestionType.MultipleChoice,
    text: '16. Što bi vas najviše potaknulo da djetetu ponudite takav proizvod?',
    options: [
      'Znanje da je proizvod pravilan i prirodan',
      'Bez dodanog šećera',
      'Domaći proizvod iz BiH',
      'Preporuka nutricionista ili škole',
      'Zabavno i privlačno pakiranje za djecu',
      'Bez ulja',
    ],
  },
  {
    id: 'purchase_location',
    section: 'parents',
    type: QuestionType.SingleChoice,
    text: '17. Gdje biste najradije kupovali takvu pravilnu užinu za djecu?',
    options: [
      'U supermarketu',
      'U lokalnoj trgovini / na pijaci',
      'Online',
      'U školskoj kantini / automatu',
    ],
  },
  {
    id: 'child_price_acceptability',
    section: 'parents',
    type: QuestionType.SingleChoice,
    text: '18. Koliko biste bili spremni platiti pakiranje (80-100 g) sušenog kakija / ćuptera za dijete?',
    options: ['Do 5 KM', '5–7 KM', '7–10 KM', 'Više od 10 KM'],
  },
  {
    id: 'parent_feedback',
    section: 'parents',
    type: QuestionType.OpenEnded,
    text: '19. Ako imate komentar ili prijedlog – što biste željeli vidjeti kod pravilne užine za djecu (okus, pakiranje, količina, dodatci…)?',
    isOptional: true,
  },
];


// --- Komponente forme (iz components/SurveyForm.tsx) ---
const ProgressBar: FC<{ current: number; total: number }> = ({ current, total }) => {
  const percentage = total > 0 ? ((current) / total) * 100 : 0;
  return (
    <div className="w-full bg-orange-200 rounded-full h-2.5 mb-8">
      <div
        className="bg-orange-500 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const RadioGroupInput: FC<{ question: Question, value: string, onChange: (value: string) => void }> = ({ question, value, onChange }) => (
    <div className="space-y-3">
        {question.options?.map((option) => (
            <label key={option} className="flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-orange-100 has-[:checked]:bg-orange-100 has-[:checked]:border-orange-500 has-[:checked]:ring-2 has-[:checked]:ring-orange-500">
                <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-4 text-gray-700">{option}</span>
            </label>
        ))}
    </div>
);

const CheckboxGroupInput: FC<{ question: Question, value: string[], onChange: (value: string[]) => void }> = ({ question, value, onChange }) => {
    const handleChange = (option: string) => {
        const newValue = value.includes(option)
            ? value.filter((v) => v !== option)
            : [...value, option];

        if (question.maxChoices && newValue.length > question.maxChoices) {
            return;
        }
        onChange(newValue);
    };

    return (
        <div className="space-y-3">
            {question.options?.map((option) => (
                <label key={option} className="flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-orange-100 has-[:checked]:bg-orange-100 has-[:checked]:border-orange-500 has-[:checked]:ring-2 has-[:checked]:ring-orange-500">
                    <input
                        type="checkbox"
                        checked={value.includes(option)}
                        onChange={() => handleChange(option)}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="ml-4 text-gray-700">{option}</span>
                </label>
            ))}
        </div>
    );
};

const RatingScaleInput: FC<{ question: Question, value: { [key: string]: number }, onChange: (value: { [key: string]: number }) => void }> = ({ question, value, onChange }) => {
    const handleChange = (criterion: string, rating: number) => {
        onChange({ ...value, [criterion]: rating });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Kriterij</th>
                        {[1, 2, 3, 4, 5].map(num => <th key={num} scope="col" className="px-2 py-3 text-center">{num}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {question.criteria?.map((criterion) => (
                        <tr key={criterion} className="bg-white border-b">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{criterion}</th>
                            {[1, 2, 3, 4, 5].map(rating => (
                                <td key={rating} className="px-2 py-4 text-center">
                                    <input
                                        type="radio"
                                        name={`${question.id}-${criterion}`}
                                        checked={value[criterion] === rating}
                                        onChange={() => handleChange(criterion, rating)}
                                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2 px-1">(1 = uopće nije važno, 5 = vrlo važno)</p>
        </div>
    );
};

const OpenEndedInput: FC<{ question: Question, value: string, onChange: (value: string) => void }> = ({ question, value, onChange }) => (
    <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Vaš odgovor..."
        rows={5}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
    ></textarea>
);


const QuestionRenderer: FC<{ question: Question; value: any; onChange: (value: any) => void }> = ({ question, value, onChange }) => {
    switch (question.type) {
        case QuestionType.SingleChoice:
            return <RadioGroupInput question={question} value={value || ''} onChange={onChange} />;
        case QuestionType.MultipleChoice:
            return <CheckboxGroupInput question={question} value={value || []} onChange={onChange} />;
        case QuestionType.RatingScale:
             return <RatingScaleInput question={question} value={value || {}} onChange={onChange} />;
        case QuestionType.OpenEnded:
            return <OpenEndedInput question={question} value={value || ''} onChange={onChange} />;
        default:
            return null;
    }
};

const SurveyForm: FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [answers, setAnswers] = useState<Answers>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const visibleQuestions = useMemo(() => {
        const hasChildrenAnswer = answers['has_children'];
        if (hasChildrenAnswer === 'Ne') {
            return ALL_QUESTIONS.filter(q => q.section !== 'parents');
        }
        return ALL_QUESTIONS;
    }, [answers]);

    const currentQuestion = visibleQuestions[currentQuestionIndex];

    const handleAnswerChange = (questionId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const isAnswered = () => {
        if (!currentQuestion) return false;
        if (currentQuestion.isOptional) return true;
        const answer = answers[currentQuestion.id];
        if (answer === undefined || answer === null) return false;
        if (Array.isArray(answer) && answer.length === 0) return false;
        if (typeof answer === 'object' && !Array.isArray(answer) && Object.keys(answer).length !== currentQuestion.criteria?.length) return false;
        if (typeof answer === 'string' && answer.trim() === '') return false;
        return true;
    };

    const handleNext = () => {
        if (currentQuestionIndex < visibleQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl max-w-3xl w-full mx-auto">
            <ProgressBar current={currentQuestionIndex} total={visibleQuestions.length} />
            {currentQuestion && (
              <>
                <div className="mb-8 min-h-[300px]">
                    <h2 key={currentQuestion.id} className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 animate-fade-in-up">{currentQuestion.text}</h2>
                    <QuestionRenderer
                        question={currentQuestion}
                        value={answers[currentQuestion.id]}
                        onChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    />
                </div>
                <div className="flex justify-between items-center mt-10">
                    <button
                        onClick={handleBack}
                        disabled={currentQuestionIndex === 0}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Nazad
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!isAnswered()}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                        {currentQuestionIndex === visibleQuestions.length - 1 ? 'Završi' : 'Dalje'}
                    </button>
                </div>
              </>
            )}
        </div>
    );
};


// --- Glavna aplikacija (iz App.tsx) ---
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

// --- Renderiranje aplikacije (iz index.tsx) ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
