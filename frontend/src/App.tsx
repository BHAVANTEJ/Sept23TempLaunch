import { Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { Footer } from './components/Footer';
// import { RegisterPage } from './pages/RegisterPage';

function HomePage() {
  return (
    <main>
      <Hero />
      <Countdown />
      {/* About / Our purpose content is intentionally disabled for this launch version. */}
    </main>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/register" element={<RegisterPage />} /> */}
      </Routes>
      <Footer />
    </>
  );
}
export { App };
