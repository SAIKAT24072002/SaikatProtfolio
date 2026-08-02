import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, FileDown } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Hero = ({ profile }) => {
  const socialLinks = profile?.socialLinks || {};
  const [skipAnimation, setSkipAnimation] = useState(false);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem('hero_animated');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasAnimated || prefersReducedMotion) {
      setSkipAnimation(true);
    } else {
      sessionStorage.setItem('hero_animated', 'true');
    }
  }, []);

  const name = profile?.name || "SAIKAT KHAMRAI";
  const title = profile?.title || "Full Stack MERN Developer";
  const bio = profile?.bio || "I build responsive, secure, and highly scalable web applications utilizing React, Node.js, Express, and MongoDB.";

  // CHARACTER-BY-CHARACTER typing and spring reveal for SAIKAT KHAMRAI
  const renderLetters = (text, startDelay, className = "") => {
    if (!text) return null;
    const chars = Array.from(text);
    
    return (
      <span className={className}>
        {chars.map((char, idx) => {
          if (skipAnimation) {
            return <span key={idx}>{char}</span>;
          }
          return (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: startDelay + (idx * 0.02)
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </span>
    );
  };

  // WORD-BY-WORD sliding reveal helper
  const renderWords = (text, startDelay, wordDuration = 0.08, wrapperClass = "", wordClass = "") => {
    if (!text) return null;
    const words = text.split(" ");
    
    return (
      <span className={wrapperClass}>
        {words.map((word, idx) => {
          if (skipAnimation) {
            return (
              <span key={idx} className={`inline-block ${wordClass}`}>
                {word}&nbsp;
              </span>
            );
          }
          
          return (
            <span key={idx} className="inline-block overflow-hidden py-0.5">
              <motion.span
                className={`inline-block ${wordClass}`}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: startDelay + (idx * wordDuration)
                }}
              >
                {word}&nbsp;
              </motion.span>
            </span>
          );
        })}
      </span>
    );
  };

  // Buttons Stagger animation
  const buttonVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: skipAnimation ? 0 : 1.2
      }
    }
  };

  // Social Links Stagger animation
  const socialVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: skipAnimation ? 0 : 1.4
      }
    }
  };

  return (
    <section id="hero" className="min-h-[90vh] flex items-center justify-center relative overflow-hidden px-4 py-20 bg-gradient-to-b from-slate-50 to-white dark:from-dark-bg dark:to-dark-bg transition-colors duration-300">
      
      {/* Premium Ambient Background Accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-primary-500/10 blur-[80px] pointer-events-none dark:block hidden"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none dark:block hidden"></div>

      <div className="max-w-5xl mx-auto text-center z-10 w-full">
        <div className="space-y-6">
          
          {/* STEP 1: Hi, I'm */}
          <div>
            {renderWords(
              "Hi, I'm", 
              0.1, 
              0.12, 
              "text-primary-600 dark:text-primary-400 font-semibold tracking-wider text-sm sm:text-base uppercase"
            )}
          </div>
          
          {/* STEP 2 & 3: Character name and moving title gradient */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white leading-[1.1] pb-2">
            <span className="block mb-2">
              {renderLetters(name, 0.3, "")}
            </span>
            <span className="block">
              {renderWords(title, 0.6, 0.05, "", "gradient-text-animated")}
            </span>
          </h1>

          {/* STEP 4: Bio Description */}
          <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-dark-textMuted max-w-2xl mx-auto leading-relaxed">
            {renderWords(bio, 0.85, 0.025, "", "")}
          </p>

          {/* STEP 5: Staggered CTA Buttons */}
          <motion.div 
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 w-full max-w-md mx-auto sm:max-w-none"
          >
            {/* Primary: View Projects */}
            <button
              onClick={() => handleScrollTo('projects')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-500 dark:to-indigo-500 hover:from-primary-700 hover:to-indigo-700 dark:hover:from-primary-600 dark:hover:to-indigo-600 rounded-xl shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-300 group"
            >
              View Projects
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            
            {/* Secondary: Contact Me */}
            <button
              onClick={() => handleScrollTo('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-300"
            >
              Contact Me
            </button>

            {/* Tertiary: Resume */}
            {profile?.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl border border-dashed border-primary-500/40 text-primary-600 dark:text-primary-400 hover:bg-primary-500/5 hover:-translate-y-0.5 hover:scale-[1.03] transition-all duration-300"
              >
                <FileDown className="h-4.5 w-4.5" />
                Resume
              </a>
            )}
          </motion.div>

          {/* STEP 6: Social Links */}
          <motion.div 
            variants={socialVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-6 pt-6"
          >
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-200"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            )}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
