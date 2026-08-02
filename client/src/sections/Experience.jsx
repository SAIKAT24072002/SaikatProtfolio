import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const Experience = ({ experiences = [] }) => {
  const hasExp = experiences && experiences.length > 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const sortedExperiences = [...experiences].sort((a, b) => {
    // Sort by displayOrder first, then date descending
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(b.startDate) - new Date(a.startDate);
  });

  return (
    <section id="experience" className="py-20 px-4 bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white sm:text-4xl">
            Experience Timeline
          </h2>
          <div className="h-1.5 w-16 bg-primary-500 rounded-full mx-auto mt-3"></div>
        </div>

        {!hasExp ? (
          <EmptyState title="No Work History Found" message="Work experience and project involvements will display here." />
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-6 md:pl-8 space-y-12">
            {sortedExperiences.map((exp) => (
              <div key={exp._id} className="relative group">
                
                {/* Bullet node indicator */}
                <div className="absolute -left-[35px] md:-left-[43px] mt-1.5 p-2 bg-primary-500 dark:bg-primary-500 rounded-full text-white ring-4 ring-slate-50 dark:ring-dark-bg transition-transform group-hover:scale-110">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>

                <div className="space-y-3">
                  {/* Title & Organization info */}
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(exp.startDate)} - {exp.currentStatus ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    <h3 className="text-xl font-bold font-sans text-slate-800 dark:text-white">
                      {exp.position}
                    </h3>
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-dark-textMuted">
                      {exp.company}
                    </h4>
                  </div>

                  {/* Bullet points description list */}
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-dark-textMuted space-y-1.5">
                    {exp.description.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>

                  {/* Skills badge triggers */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.technologies.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-2.5 py-1 text-xs rounded bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Experience;
