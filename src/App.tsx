import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CalendarPage from './pages/CalendarPage';
import SolicitationsPage from './pages/SolicitationsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/agenda" element={<CalendarPage />} />
      <Route path="/solicitacoes" element={<SolicitationsPage />} />
    </Routes>
  );
}