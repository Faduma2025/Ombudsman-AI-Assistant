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
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Suggested Questions:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {SUGGESTED_QUESTIONS.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question)}
            className="text-left text-sm p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};
