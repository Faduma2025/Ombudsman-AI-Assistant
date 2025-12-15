import React from 'react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const SUGGESTED_QUESTIONS = [
  "What are the most common issues in Compensation & Benefits cases?",
  "What's the typical outcome for promotion disputes?",
  "Explain the difference between Evaluative and Peer Relationships categories",
  "What lessons can be learned from retaliation cases?",
  "What percentage of cases favor the applicant?",
  "Tell me about disciplinary action cases"
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelect }) => {
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="text-xl mr-2">💡</span>
        Suggested Questions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="text-left text-sm p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500 transition-all font-medium"
          >
            <span className="text-blue-600 dark:text-blue-400 mr-2">→</span>
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};
