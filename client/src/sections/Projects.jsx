import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import EmptyState from '../components/EmptyState';

const Projects = ({ projects = [] }) => {
  const hasProj = projects && projects.length > 0;

  // Sort: Featured first, then displayOrder, then newest
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <section id="projects" className="py-20 px-4 bg-white dark:bg-dark-bg border-t border-slate-100 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight font-sans text-slate-900 dark:text-white sm:text-4xl">
            Featured Projects
          </h2>
          <div className="h-1.5 w-16 bg-primary-500 rounded-full mx-auto mt-3"></div>
          <p className="text-slate-500 dark:text-dark-textMuted mt-4 max-w-lg mx-auto">
            Explore live production demonstrations, GitHub repos, and in-depth structural details.
          </p>
        </div>

        {!hasProj ? (
          <EmptyState title="No Projects Found" message="Check back later as I upload my production applications." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProjects.map((project) => (
              <div 
                key={project._id} 
                className="group flex flex-col h-full rounded-2xl overflow-hidden glass-card hover:shadow-xl hover:border-primary-500/20 dark:hover:border-primary-500/40 transition-all duration-300 relative"
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-3 py-1 text-[10px] font-bold text-white bg-amber-500 rounded-full shadow">
                    <Star className="h-3 w-3 fill-white" />
                    FEATURED
                  </div>
                )}

                {/* Project Image Frame */}
                <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      No Screenshot Available
                    </div>
                  )}
                </div>

                {/* Card Content body */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-dark-textMuted line-clamp-3 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Tech Badges */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-900/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                          title="View Repository"
                        >
                          <FaGithub className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                          title="View Live Demo"
                        >
                          <ExternalLink className="h-4.5 w-4.5" />
                        </a>
                      )}
                    </div>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default Projects;
