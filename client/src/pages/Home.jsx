import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Experience from '../sections/Experience';
import Education from '../sections/Education';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import portfolioService from '../services/portfolioService';
import { CardSkeleton } from '../components/SkeletonLoader';

const Home = () => {
  const { profile } = useOutletContext();
  const [data, setData] = useState({
    skills: [],
    experiences: [],
    education: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [skillsRes, expRes, eduRes, projRes] = await Promise.allSettled([
          portfolioService.getSkills(),
          portfolioService.getExperiences(),
          portfolioService.getEducation(),
          portfolioService.getProjects()
        ]);

        setData({
          skills: skillsRes.status === 'fulfilled' ? skillsRes.value : [],
          experiences: expRes.status === 'fulfilled' ? expRes.value : [],
          education: eduRes.status === 'fulfilled' ? eduRes.value : [],
          projects: projRes.status === 'fulfilled' ? projRes.value : []
        });
      } catch (err) {
        setError("Failed to retrieve portfolio assets. Please reload.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-12 animate-pulse">
        {/* Simple Page Loader UI */}
        <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={data.skills} />
      <Experience experiences={data.experiences} />
      <Education education={data.education} />
      <Projects projects={data.projects} />
      <Contact profile={profile} />
    </div>
  );
};

export default Home;
