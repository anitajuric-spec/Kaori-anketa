
import React, { useState, useMemo, FC } from 'react';
import { Question, QuestionType, Answers } from '../types.ts';
import { ALL_QUESTIONS } from '../constants.ts';

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

export const SurveyForm: FC<{ onComplete: () => void }> = ({ onComplete }) => {
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
