import { HeroSection } from './components/hero/HeroSection';
import { CustomCursor } from './components/ui/CustomCursor';
import { useScrollChoreography } from './hooks/useScrollChoreography';
import './styles/index.css';

export function App() {
  const { progress, scrollToSection } = useScrollChoreography();

  return (
    <main className="app-root">
      <CustomCursor />
      {/* Pinned 3D viewport containing Hero and Skills choreography */}
      <HeroSection scrollProgress={progress} onNavigate={scrollToSection} />

      {/* Virtual scroll track for Lenis smooth scrolling (Hero + Skills transition) */}
      <div className="scroll-spacer" aria-hidden="true" />
    </main>
  );
}

export default App;
