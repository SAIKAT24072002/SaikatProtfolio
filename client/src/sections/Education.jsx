import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const Education = ({ education = [] }) => {
  const hasEdu = education && education.length > 0;

  const sortedEducation = [...education].sort((a, b) => {
    // Sort by displayOrder, then by endYear descending
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return b.endYear.localeCompare(a.endYear);
  });

  return (
    <section id="education" className="py-20 px-4 bg-slate-50 dark:bg-dark-bg/60 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white sm:text-4xl">
            Education Background
          </h2>
          <div className="h-1.5 w-16 bg-primary-500 rounded-full mx-auto mt-3"></div>
        </div>

        {!hasEdu ? (
          <EmptyState title="No education records available." message="Academic degrees and certificates will display here." />
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-6 md:pl-8 space-y-12">
            {sortedEducation.map((edu) => (
              <div key={edu._id} className="relative group">
                
                {/* Bullet indicator */}
                <div className="absolute -left-[35px] md:-left-[43px] mt-1.5 p-2 bg-indigo-500 dark:bg-indigo-500 rounded-full text-white ring-4 ring-slate-50 dark:ring-dark-bg transition-transform group-hover:scale-110">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
                      <Calendar className="h-3 w-3" />
                      {edu.startYear} - {edu.endYear}
                    </span>
                    <h3 className="text-xl font-bold font-sans text-slate-800 dark:text-white">
                      {edu.degree}
                    </h3>
                    <h4 className="text-sm font-semibold text-slate-500 dark:text-dark-textMuted">
                      {edu.institution}
                    </h4>
                  </div>

                  {edu.description && (
                    <p className="text-sm text-slate-600 dark:text-dark-textMuted leading-relaxed">
                      {edu.description}
                    </p>
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

export default Education;
