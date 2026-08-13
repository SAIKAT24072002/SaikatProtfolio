import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import portfolioService from '../services/portfolioService';
import { DetailSkeleton } from '../components/SkeletonLoader';
import { getCloudinarySrcSet, getOptimizedCloudinaryImage } from '../utils/cloudinary';

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const data = await portfolioService.getProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        setError(err.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [slug]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 rounded-2xl glass-card text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Project Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{error || "The project you are looking for does not exist."}</p>
        <Link to="/" className="inline-block px-4 py-2 text-xs font-bold text-white bg-primary-600 rounded-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Back button */}
      <div>
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-dark-textMuted hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          Back to Projects
        </button>
      </div>

      {/* Header and Title */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-sans text-slate-900 dark:text-white">
          {project.title}
        </h1>
        
        {/* Technology Badges */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech) => (
              <span 
                key={tech} 
                className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 border border-primary-100 dark:border-primary-900/40"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Large Project Image Banner */}
      {project.imageUrl && (
        <div className="rounded-2xl overflow-hidden aspect-[21/9] border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-950 shadow-md">
          <img
            src={getOptimizedCloudinaryImage(project.imageUrl, { width: 1280, height: 550 })}
            srcSet={getCloudinarySrcSet(project.imageUrl, [640, 960, 1280], { heightRatio: 0.43 })}
            sizes="(min-width: 896px) 864px, calc(100vw - 2rem)"
            alt={project.title}
            width="1280"
            height="550"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Details Grid Description */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
        
        {/* Left Side: Long Description and core details */}
        <div className="md:col-span-8 space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Project Overview</h2>
            <p className="text-slate-600 dark:text-dark-textMuted leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {project.fullDescription}
            </p>
          </div>

          {/* Challenges & Solutions */}
          {(project.challenges || project.solutions) && (
            <div className="grid grid-cols-1 gap-6 border-t border-slate-100 dark:border-slate-800/80 pt-8">
              {project.challenges && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-red-500 flex items-center gap-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-red-500" />
                    Challenges Encountered
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-dark-textMuted leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              )}
              {project.solutions && (
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-emerald-500 flex items-center gap-1.5">
                    <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                    Solutions Implemented
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-dark-textMuted leading-relaxed">
                    {project.solutions}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Features and Links */}
        <div className="md:col-span-4 space-y-6">
          {/* Quick action URLs */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-5 bg-slate-50/50 dark:bg-slate-900/10 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Project Links
            </h3>
            
            <div className="space-y-2.5">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-lg shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <FaGithub className="h-4 w-4" />
                  GitHub Repository
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Website Demo
                </a>
              )}
            </div>
          </div>

          {/* Project Features details */}
          {project.features && project.features.length > 0 && (
            <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-5 bg-slate-50/50 dark:bg-slate-900/10 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Key Features
              </h3>
              <ul className="list-disc pl-4 text-xs text-slate-600 dark:text-dark-textMuted space-y-2">
                {project.features.map((feature, index) => (
                  <li key={index} className="leading-normal">{feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;
