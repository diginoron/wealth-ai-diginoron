import React from 'react';

interface AIInsightCardProps {
  interpretation: string;
  loading: boolean;
  error: string | null;
}

const AIInsightCard: React.FC<AIInsightCardProps> = ({ interpretation, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-blue-100 p-6 rounded-xl shadow-md w-full max-w-4xl mt-8 text-center animate-pulse">
        <p className="text-xl text-blue-800">Generating AI weather insight...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative w-full max-w-4xl mt-8 text-center" role="alert">
        <span className="block sm:inline">Error generating AI insight: {error}</span>
      </div>
    );
  }

  if (!interpretation) {
    return null; // Don't render anything if no interpretation and no loading/error
  }

  return (
    <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl shadow-lg w-full max-w-4xl mt-8 transform transition-all hover:scale-102 duration-300">
      <h3 className="text-2xl font-bold text-indigo-700 mb-4 text-center">AI Weather Insight</h3>
      <p className="text-gray-800 leading-relaxed text-lg text-justify">
        {interpretation}
      </p>
    </div>
  );
};

export default AIInsightCard;
