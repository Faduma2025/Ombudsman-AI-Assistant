/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        category: {
          1: '#3B82F6',  // Blue - Compensation & Benefits
          2: '#10B981',  // Green - Evaluative Relationships
          3: '#8B5CF6',  // Purple - Peer and Colleague Relationships
          4: '#F59E0B',  // Amber - Career Progression
          5: '#EF4444',  // Red - Legal, Regulatory, Financial
          6: '#06B6D4',  // Cyan - Safety, Health, Physical Environment
          7: '#6366F1',  // Indigo - Services/Administrative
          8: '#EC4899',  // Pink - Organizational, Strategic
          9: '#14B8A6',  // Teal - Values, Ethics, Standards
        },
      },
    },
  },
  plugins: [],
}
