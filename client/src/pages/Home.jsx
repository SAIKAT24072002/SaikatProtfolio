import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Experience from '../sections/Experience';
import Education from '../sections/Education';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import portfolioService from '../services/portfolioService';
import { CardSkeleton, ListSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const SECTION_LOADERS = {
  skills: portfolioService.getSkills,
  experiences: portfolioService.getExperiences,
  education: portfolioService.getEducation,
  projects: portfolioService.getProjects,
};

const createInitialSectionState = () => ({
  skills: { data: [], loading: true, error: null },
  experiences: { data: [], loading: true, error: null },
  education: { data: [], loading: true, error: null },
  projects: { data: [], loading: true, error: null },
});

const SectionErrorFallback = ({ id, title, message, onRetry, backgroundClass = 'bg-white dark:bg-dark-bg' }) => {
  return (
    <section id={id} className={`py-20 px-4 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300 ${backgroundClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/10 p-6 text-center space-y-4">
          <EmptyState title={title} message={message} />
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-xl border border-amber-300 dark:border-amber-800 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100/70 dark:hover:bg-amber-950/30 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    </section>
  );
};

const SkillsSkeletonSection = () => {
  return (
    <section id="skills" className="py-20 px-4 bg-slate-50 dark:bg-dark-bg/60 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-pulse">
          <div className="h-10 w-64 mx-auto rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto mt-3"></div>
          <div className="h-4 w-80 max-w-full mx-auto rounded bg-slate-200 dark:bg-slate-800 mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl p-6 glass-card animate-pulse space-y-4">
              <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-800"></div>
              <ListSkeleton items={4} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TimelineSkeletonSection = ({ id, accentClass, backgroundClass }) => {
  return (
    <section id={id} className={`py-20 px-4 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300 ${backgroundClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-pulse">
          <div className="h-10 w-72 max-w-full mx-auto rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className={`h-1.5 w-16 rounded-full mx-auto mt-3 ${accentClass}`}></div>
        </div>
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-6 md:pl-8 space-y-12">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative space-y-3 animate-pulse">
              <div className={`absolute -left-[35px] md:-left-[43px] mt-1.5 h-8 w-8 rounded-full ring-4 ring-slate-50 dark:ring-dark-bg ${accentClass}`}></div>
              <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="h-7 w-56 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
                <div className="h-3 w-11/12 rounded bg-slate-200 dark:bg-slate-800"></div>
                <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectsSkeletonSection = () => {
  return (
    <section id="projects" className="py-20 px-4 bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-pulse">
          <div className="h-10 w-64 mx-auto rounded bg-slate-200 dark:bg-slate-800"></div>
          <div className="h-1.5 w-16 rounded-full bg-slate-200 dark:bg-slate-800 mx-auto mt-3"></div>
          <div className="h-4 w-96 max-w-full mx-auto rounded bg-slate-200 dark:bg-slate-800 mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { profile, setHasExperience } = useOutletContext();
  const [sections, setSections] = useState(createInitialSectionState);
  const isMountedRef = useRef(true);

  const loadSection = useCallback(async (sectionKey) => {
    setSections((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        loading: true,
        error: null,
      },
    }));

    try {
      const data = await SECTION_LOADERS[sectionKey]();
      if (!isMountedRef.current) {
        return;
      }

      setSections((prev) => ({
        ...prev,
        [sectionKey]: {
          data,
          loading: false,
          error: null,
        },
      }));

      if (sectionKey === 'experiences') setHasExperience(data.length > 0);
    } catch (err) {
      if (!isMountedRef.current) {
        return;
      }

      setSections((prev) => ({
        ...prev,
        [sectionKey]: {
          data: [],
          loading: false,
          error: err.message || 'This section is taking longer than expected to load.',
        },
      }));

      if (sectionKey === 'experiences') setHasExperience(false);
    }
  }, [setHasExperience]);

  useEffect(() => {
    isMountedRef.current = true;
    Object.keys(SECTION_LOADERS).forEach((sectionKey) => {
      loadSection(sectionKey);
    });

    return () => {
      isMountedRef.current = false;
    };
  }, [loadSection]);

  return (
    <div className="overflow-hidden">
      <Hero profile={profile} />
      <About profile={profile} />

      {sections.skills.loading ? (
        <SkillsSkeletonSection />
      ) : sections.skills.error ? (
        <SectionErrorFallback
          id="skills"
          title="Skills are still warming up"
          message={sections.skills.error}
          backgroundClass="bg-slate-50 dark:bg-dark-bg/60"
          onRetry={() => loadSection('skills')}
        />
      ) : (
        <Skills skills={sections.skills.data} />
      )}

      {!sections.experiences.loading && !sections.experiences.error && sections.experiences.data.length > 0 && (
        <Experience experiences={sections.experiences.data} />
      )}

      {sections.education.loading ? (
        <TimelineSkeletonSection
          id="education"
          accentClass="bg-indigo-200 dark:bg-indigo-900/60"
          backgroundClass="bg-slate-50 dark:bg-dark-bg/60"
        />
      ) : sections.education.error ? (
        <SectionErrorFallback
          id="education"
          title="Education is still warming up"
          message={sections.education.error}
          backgroundClass="bg-slate-50 dark:bg-dark-bg/60"
          onRetry={() => loadSection('education')}
        />
      ) : (
        <Education education={sections.education.data} />
      )}

      {sections.projects.loading ? (
        <ProjectsSkeletonSection />
      ) : sections.projects.error ? (
        <SectionErrorFallback
          id="projects"
          title="Projects are still warming up"
          message={sections.projects.error}
          backgroundClass="bg-white dark:bg-dark-bg"
          onRetry={() => loadSection('projects')}
        />
      ) : (
        <Projects projects={sections.projects.data} />
      )}

      <Contact profile={profile} />
    </div>
  );
};

export default Home;
