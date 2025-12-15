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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          World Bank Administrative Tribunal Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze cases across 9 IOA categories and get AI-powered insights
        </p>
      </div>

      <StatsOverview />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          IOA Categories
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
