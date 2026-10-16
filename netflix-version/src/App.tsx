import { lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { viewerProfiles, type ProfileId, type Project, type SectionId } from './data/portfolio';
import { SmoothScrollProvider, useSmoothScroll } from './hooks/smoothScroll';
import CustomCursor from './components/CustomCursor';
import OpeningSequence from './components/OpeningSequence';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ContinueWatching from './components/ContinueWatching';
import Scene from './components/Scene';
import About from './components/About';
import Seasons from './components/Seasons';
import Originals from './components/Originals';
import TopPicks from './components/TopPicks';
import Skills from './components/Skills';
import Achievements from './components/Achievements';
import Certifications from './components/Certifications';
import ResumeSection from './components/ResumeViewer';
import FinalCTA from './components/FinalCTA';
import { EASE } from './components/fx';

// Overlays are only needed on demand — split them out of the first load.
const PlayIntro = lazy(() => import('./components/PlayIntro'));
const ProjectModal = lazy(() => import('./components/ProjectModal'));
const ResumeModal = lazy(() => import('./components/ResumeModal'));

export type Theme = 'light' | 'dark' | 'netflix';
type Stage = 'opening' | 'home';

const STORAGE_KEY = 'parth-series-profile';

function readStoredProfile(): ProfileId | null {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return viewerProfiles.some((p) => p.id === v) ? (v as ProfileId) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const urlParam = new URLSearchParams(window.location.search).get('theme')?.toLowerCase();
      if (urlParam === 'light' || urlParam === 'dark' || urlParam === 'netflix') {
        return urlParam;
      }
      if (urlParam === 'purple') return 'dark';
      if (urlParam === 'newsletter' || urlParam === 'news-letter') return 'light';
      const saved = localStorage.getItem('theme')?.toLowerCase();
      if (saved === 'light' || saved === 'dark' || saved === 'netflix') {
        return saved as Theme;
      }
      if (saved === 'purple') return 'dark';
      if (saved === 'newsletter' || saved === 'news-letter') return 'light';
    } catch {
      /* ignore */
    }
    return 'netflix';
  });

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global handler for external messages or window.switchTheme
  useEffect(() => {
    (window as any).switchTheme = (t: Theme) => {
      if (t === 'light' || t === 'dark' || t === 'netflix') {
        setTheme(t);
      }
    };
    const onMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'SET_THEME' && (e.data.theme === 'light' || e.data.theme === 'dark' || e.data.theme === 'netflix')) {
        setTheme(e.data.theme);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    try {
      localStorage.setItem('theme', t);
    } catch {
      /* ignore */
    }
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SET_THEME', theme: t }, '*');
    } else if (t === 'light' || t === 'dark') {
      window.location.href = `../?theme=${t}`;
    }
  };

  return (
    <SmoothScrollProvider>
      <Series theme={theme} onThemeChange={handleThemeChange} />
    </SmoothScrollProvider>
  );
}

function Series({ theme, onThemeChange }: { theme: Theme; onThemeChange: (t: Theme) => void }) {
  const stored = readStoredProfile();
  const [stage, setStage] = useState<Stage>(stored ? 'home' : 'opening');
  const [profileId] = useState<ProfileId>(stored ?? 'parth');
  const [playing, setPlaying] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const { lock, unlock } = useSmoothScroll();

  const order = viewerProfiles.find((p) => p.id === profileId)!.order;

  useEffect(() => {
    if (stage === 'home') return;
    lock();
    return unlock;
  }, [stage, lock, unlock]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const closeIntro = useCallback(() => setPlaying(false), []);
  const closeProject = useCallback(() => setProject(null), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);

  const sections: Record<SectionId, ReactNode> = {
    about: <About />,
    journey: <Seasons />,
    originals: <Originals onOpen={setProject} />,
    picks: <TopPicks onOpen={setProject} />,
    skills: <Skills />,
    moments: <Achievements />,
    certifications: <Certifications />,
    story: <ResumeSection onView={() => setResumeOpen(true)} />,
  };

  return (
    <LayoutGroup>
      <div className="grain" aria-hidden />
      <CustomCursor />

      <AnimatePresence mode="wait">
        {stage === 'opening' && (
          <OpeningSequence
            key="opening"
            onDone={() => {
              window.scrollTo(0, 0);
              setStage('home');
            }}
          />
        )}
      </AnimatePresence>

      {stage === 'home' && (
        <motion.div
          initial={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <Navbar order={order} theme={theme} onThemeChange={onThemeChange} />
          <main>
            <Hero key={`hero-${profileId}`} onPlay={() => setPlaying(true)} onResume={() => setResumeOpen(true)} profileId={profileId} />
            <ContinueWatching order={order} />
            {order.map((id) => (
              <Scene key={id} id={id} className={id === 'originals' ? '!py-0 sm:!py-0' : ''}>
                {sections[id]}
              </Scene>
            ))}
            <FinalCTA onReplay={() => setStage('opening')} />
          </main>
        </motion.div>
      )}

      <Suspense fallback={null}>
        <AnimatePresence>{playing && <PlayIntro key="intro" onClose={closeIntro} />}</AnimatePresence>
        <AnimatePresence>{project && <ProjectModal key="project" project={project} onClose={closeProject} onSwitch={setProject} />}</AnimatePresence>
        <AnimatePresence>{resumeOpen && <ResumeModal key="resume" onClose={closeResume} />}</AnimatePresence>
      </Suspense>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className="glass fixed bottom-6 left-1/2 z-[150] w-[min(92vw,420px)] -translate-x-1/2 rounded-xl px-5 py-3 text-center text-sm text-bone"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
