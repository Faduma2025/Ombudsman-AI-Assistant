import React, { useState } from 'react';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { CategoryCard } from '../components/dashboard/CategoryCard';
import { useCategories } from '../hooks/useCategories';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

type Institution = 'All Institutions' | 'World Bank' | 'IMF';

export const Dashboard: React.FC = () => {
  const { categories, loading } = useCategories();
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>('All Institutions');

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
            Explore administrative tribunal decisions across multilateral institutions using AI. Search cases, compare tribunal reasoning, identify recurring workplace issues, and derive practical lessons from documented decisions.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
            Sources: World Bank Administrative Tribunal · IMF Administrative Tribunal
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
            Classification: IOA Uniform Reporting Categories
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Disclaimer:</span> The information provided may not apply exactly to your situation, as individual circumstances vary. However, it may offer helpful guidance in determining the best course of action. Additional cases will be added over time.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Institution:
          </span>
          <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            {(['All Institutions', 'World Bank', 'IMF'] as Institution[]).map((institution) => (
              <button
                key={institution}
                onClick={() => setSelectedInstitution(institution)}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors
                  ${institution === 'All Institutions' ? 'rounded-l-lg' : ''}
                  ${institution === 'IMF' ? 'rounded-r-lg' : ''}
                  ${institution !== 'All Institutions' && institution !== 'IMF' ? 'border-x border-gray-300 dark:border-gray-600' : ''}
                  ${
                    selectedInstitution === institution
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                {institution}
              </button>
            ))}
          </div>
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
