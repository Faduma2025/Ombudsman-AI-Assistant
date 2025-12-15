import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { CasesProvider } from './context/CasesContext';
import { Dashboard } from './pages/Dashboard';
import { CategoryDetail } from './pages/CategoryDetail';
import { Chat } from './pages/Chat';

function App() {
  return (
    <CasesProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category/:categoryId" element={<CategoryDetail />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Layout>
      </Router>
    </CasesProvider>
  );
}

export default App;
