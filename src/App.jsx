import Stem from './components/Stem.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';
import { About, Services, Products, Projects, Articles, Testimonials, Contact } from './components/Sections.jsx';
import { useTheme } from './hooks.js';
import { useSiteContent } from './lib/useSiteContent.js';
import { ContentContext } from './lib/ContentContext.js';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const content = useSiteContent();

  return (
    <ContentContext.Provider value={content}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Stem />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main id="main">
        <Hero theme={theme} />
        <About />
        <Services />
        <Products />
        <Projects />
        <Articles />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </ContentContext.Provider>
  );
}
