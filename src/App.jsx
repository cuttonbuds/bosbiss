import Stem from './components/Stem.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';
import { About, Services, Products, Projects, Articles, Contact } from './components/Sections.jsx';
import { useTheme, useReveal } from './hooks.js';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  useReveal();

  return (
    <>
      <Stem />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero theme={theme} />
        <About />
        <Services />
        <Products />
        <Projects />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
