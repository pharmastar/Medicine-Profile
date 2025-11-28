import React, { useState, useCallback } from 'react';
import { calculateIndividualDose } from '../services/geminiService';

interface DoseCalculatorProps {
  drugName: string;
}

const DoseCalculator: React.FC<DoseCalculatorProps> = ({ drugName }) => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [dose, setDose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = useCallback(async () => {
    if (!age || !weight) {
      setError('Please enter both age and weight.');
      return;
    }
    setIsLoading(true);
    setError('');
    setDose('');

    try {
      const result = await calculateIndividualDose(drugName, parseInt(age, 10), parseInt(weight, 10));
      setDose(result);
    } catch (e) {
      setError('Failed to calculate dose. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [drugName, age, weight]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age (years)</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g., 35"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 70"
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <button
        onClick={handleCalculate}
        disabled={isLoading || !age || !weight}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Calculating...' : 'Calculate Dose'}
      </button>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      {isLoading && (
         <div className="flex justify-center items-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-2 text-sm text-gray-600">Calculating...</p>
        </div>
      )}

      {dose && !isLoading && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="font-semibold text-gray-800">Calculated Dose Suggestion:</p>
          <p className="text-gray-700 whitespace-pre-wrap">{dose}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-xs">
        <p><strong className="font-bold">Disclaimer:</strong> This is an AI-generated dose suggestion based on standard parameters. It is not a substitute for professional medical advice. Always consult a qualified healthcare provider for any medical concerns or before making any decisions related to your health or treatment.</p>
      </div>
    </div>
  );
};

export default DoseCalculator;
