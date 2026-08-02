import React from 'react';
import { motion } from 'framer-motion';

const About = ({ profile }) => {
  if (!profile) return null;

  return (
    <section id="about" className="py-20 px-4 bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white sm:text-4xl">
            About Me
          </h2>
          <div className="h-1.5 w-16 bg-primary-500 rounded-full mx-auto mt-3"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Profile Image Column */}
          <div className="md:col-span-5 flex justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative group max-w-sm w-full"
            >
              {/* Outer decorative card border */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-500 opacity-30 blur group-hover:opacity-75 transition duration-500"></div>
              
              <div className="relative rounded-2xl overflow-hidden glass-card aspect-square">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    No Image
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* About Description Column */}
          <div className="md:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold font-sans text-slate-800 dark:text-slate-200">
                I am a passionate developer focused on performance and design
              </h3>
              
              <p className="text-slate-600 dark:text-dark-textMuted leading-relaxed whitespace-pre-line">
                {profile.about || "Let's build outstanding scalable MERN stack projects. I am dedicated to clean code architecture, smooth transitions, and state-of-the-art security patterns."}
              </p>

              {/* Technical interests badges */}
              <div className="pt-4 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Full-Stack Dev</h4>
                  <p className="text-xs text-slate-500 dark:text-dark-textMuted mt-1">Robust logic spanning React to Mongo Mongoose schemas.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">Clean Coding</h4>
                  <p className="text-xs text-slate-500 dark:text-dark-textMuted mt-1">Modular structures, error handlings, validation protocols.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
