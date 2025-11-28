import React, { useState, useCallback } from 'react';
import { generateDrugMonograph, generateDrugImage } from './services/geminiService';
import { type DrugMonograph as DrugMonographType } from './types';
import SearchBar from './components/SearchBar';
import DrugMonograph from './components/DrugMonograph';
import LoadingSpinner from './components/LoadingSpinner';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [monograph, setMonograph] = useState<DrugMonographType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async (drugName: string) => {
    if (!drugName.trim()) {
      setError('Please enter a drug name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMonograph(null);
    setImageUrl(null);
    setHasSearched(true);
    
    const [monographResult, imageResult] = await Promise.allSettled([
      generateDrugMonograph(drugName),
      generateDrugImage(drugName)
    ]);

    if (monographResult.status === 'fulfilled') {
      setMonograph(monographResult.value);
    } else {
      console.error("Monograph generation failed:", monographResult.reason);
      setError('Failed to generate the drug monograph. Please check the drug name and try again.');
    }

    if (imageResult.status === 'fulfilled') {
      setImageUrl(imageResult.value);
    } else {
      console.error("Image generation failed:", imageResult.reason);
      // We don't set a blocking error for the image, the app can still be useful without it.
    }

    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 text-gray-800 antialiased">
      <div className={`container mx-auto px-4 py-8 transition-all duration-500 ${hasSearched ? 'md:py-12' : 'flex min-h-screen items-center justify-center'}`}>
        <div className={`w-full max-w-4xl mx-auto ${hasSearched ? '' : 'text-center'}`}>
          <header className={`mb-8 transition-all duration-500 ${hasSearched ? 'flex items-center space-x-4' : 'flex flex-col items-center space-y-4'}`}>
            <Logo className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
              MedicoWeb
            </h1>
          </header>

          <main>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <div className="mt-8">
              {isLoading && <LoadingSpinner />}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {monograph && (
                <div className="animate-fade-in">
                  <DrugMonograph data={monograph} imageUrl={imageUrl} isLoadingImage={isLoading} />
                </div>
              )}
              {!isLoading && !error && !monograph && hasSearched && (
                 <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-center" role="alert">
                    No data found for the specified drug.
                </div>
              )}
               {!hasSearched && (
                  <p className="text-gray-500 mt-4 text-lg">Your AI-powered drug reference guide.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;