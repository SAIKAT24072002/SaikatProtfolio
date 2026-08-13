import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const Skills = ({ skills = [] }) => {
  // Categorize skills
  const categories = ['Frontend', 'Backend', 'Database', 'Tools'];

  // Helper to dynamically get Lucide Icons
  const renderSkillIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName];
    if (IconComponent) {
      return <IconComponent className="h-6 w-6 text-primary-500" />;
    }
    // Fallback Icon
    return <LucideIcons.Code className="h-6 w-6 text-primary-500" />;
  };

  const hasSkills = skills && skills.length > 0;

  if (!hasSkills) return null;

  // Group skills by category and sort by displayOrder
  const getSkillsByCategory = (category) => {
    return skills
      .filter((s) => s.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  return (
    <section id="skills" className="py-20 px-4 bg-slate-50 dark:bg-dark-bg/60 border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white sm:text-4xl">
            My Technical Stack
          </h2>
          <div className="h-1.5 w-16 bg-primary-500 rounded-full mx-auto mt-3"></div>
          <p className="text-slate-500 dark:text-dark-textMuted mt-4 max-w-lg mx-auto">
            Dynamic toolkit fetched directly from the database and updated in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => {
              const categorySkills = getSkillsByCategory(category);
              if (categorySkills.length === 0) return null;
              return (
                <div 
                  key={category}
                  className="rounded-2xl p-6 glass-card hover:border-primary-500/20 dark:hover:border-primary-500/40 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-4 font-sans">
                    {category}
                  </h3>
                  
                    <ul className="space-y-3.5">
                      {categorySkills.map((skill) => (
                        <motion.li 
                          key={skill._id}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="p-1.5 rounded bg-slate-100 dark:bg-slate-900">
                            {renderSkillIcon(skill.icon)}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {skill.name}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
