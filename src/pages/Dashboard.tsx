import React from 'react';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { CategoryCard } from '../components/dashboard/CategoryCard';
import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { categories, loading } = useCategories();

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading tribunal cases..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Ombudsman AI Assistant
        </h1>
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-4 mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            This application analyzes and classifies tribunal cases from the <strong>World Bank Administrative Tribunal</strong>
            using the International Ombudsman Association's (IOA) 9 uniform reporting categories.
            The AI-powered assistant helps you explore case patterns, understand outcomes, and gain insights
            from 199 documented tribunal decisions.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Data Source: World Bank Administrative Tribunal | Classification: IOA Standards
          </p>
        </div>
      </div>

      <StatsOverview />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Tribunal Cases based on IOA Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((stats) => (
          <CategoryCard key={stats.category.id} stats={stats} />
        ))}
      </div>
    </div>
  );
};
