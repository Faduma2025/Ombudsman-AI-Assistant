# Ombudsman AI Assistant

An intelligent React application that analyzes World Bank Administrative Tribunal cases, classifies them into 9 IOA (International Ombudsman Association) categories, provides insights and visualizations, and offers AI-powered chat for personalized advice.

## Features

- **Dashboard Overview**: View statistics and case distribution across all 9 IOA categories
- **Category Insights**: Deep dive into each category with:
  - Ruling distribution (Applicant vs Bank wins)
  - Key lessons learned from cases
  - Complete case listings with details
- **AI Chat Assistant**: Ask questions about cases, patterns, and get personalized advice using OpenAI GPT
- **199 Tribunal Cases**: Complete database of World Bank Administrative Tribunal cases
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 9 IOA Categories

1. **Compensation & Benefits** - Salary, benefits, and financial compensation issues
2. **Evaluative Relationships** - Performance evaluations and supervisor relationships
3. **Peer and Colleague Relationships** - Workplace relationships and peer interactions
4. **Career Progression and Development** - Promotions and career advancement
5. **Legal, Regulatory, Financial and Compliance** - Legal matters and regulatory compliance
6. **Safety, Health, and Physical Environment** - Workplace safety and health concerns
7. **Services/Administrative Issues** - Administrative processes and services
8. **Organizational, Strategic, and Mission Related** - Strategic decisions and organizational changes
9. **Values, Ethics, and Standards** - Ethical standards and code of conduct

## Tech Stack

- **Frontend**: React 18 + TypeScript 5
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router 6
- **Charts**: Recharts
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Faduma2025/Ombudsman-AI-Assistant.git
cd Ombudsman-AI-Assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your-api-key-here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── api/
│   └── chat.ts                        # Vercel serverless function for OpenAI
├── public/
│   └── data/
│       └── tribunal-cases.csv         # 199 tribunal cases
├── src/
│   ├── components/
│   │   ├── layout/                    # Header, Layout components
│   │   ├── dashboard/                 # Dashboard components
│   │   ├── category/                  # Category detail components
│   │   ├── chat/                      # AI chat components
│   │   └── common/                    # Reusable components
│   ├── pages/                         # Main pages
│   ├── hooks/                         # Custom React hooks
│   ├── context/                       # React Context providers
│   ├── services/                      # Data services
│   ├── types/                         # TypeScript type definitions
│   └── utils/                         # Utility functions
└── ...
```

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add your OpenAI API key in the Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add `OPENAI_API_KEY` with your API key value

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable `OPENAI_API_KEY`
5. Deploy

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Lint code with ESLint

## Data Source

The application analyzes 199 cases from the World Bank Administrative Tribunal. Each case includes:
- Case number
- Applicant's claim
- Tribunal decision
- Lessons learned
- IOA category classification
- Ruling outcome (Applicant/Bank/Partially Applicant)

## AI Chat Features

The AI assistant can help you:
- Understand case patterns and trends
- Get advice based on historical case data
- Learn about IOA categories
- Analyze outcomes for specific types of cases

Example questions:
- "What are common issues in Compensation & Benefits cases?"
- "What's the typical outcome for promotion disputes?"
- "Explain the difference between Evaluative and Peer Relationships categories"

## License

This project is created for educational and analytical purposes.

## Acknowledgments

- World Bank Administrative Tribunal for case data
- International Ombudsman Association for category standards
- OpenAI for GPT-3.5-turbo API

## Support

For issues or questions, please open an issue on GitHub.
