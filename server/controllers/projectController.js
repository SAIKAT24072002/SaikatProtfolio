import Project from '../models/Project.js';
import { uploadToCloudinary } from '../services/uploadService.js';

// @desc    Get all projects list
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ featured: -1, displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    next(err);
  }
};

// @desc    Get project by slug
// @route   GET /api/projects/:slug
// @access  Public
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      res.status(404);
      return next(new Error('Project not found.'));
    }
    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  const { 
    title, 
    slug, 
    shortDescription, 
    fullDescription, 
    challenges, 
    solutions, 
    githubUrl, 
    liveUrl, 
    featured, 
    displayOrder 
  } = req.body;

  if (!req.file) {
    res.status(400);
    return next(new Error('Please upload a cover screenshot for the project.'));
  }

  try {
    // Check if slug is unique
    const existing = await Project.findOne({ slug });
    if (existing) {
      res.status(400);
      return next(new Error('A project with this URL slug already exists. Please choose a unique slug.'));
    }

    // Parse tech/features lists which come from multipart appends
    let technologies = [];
    if (req.body.technologies) {
      technologies = Array.isArray(req.body.technologies) 
        ? req.body.technologies 
        : [req.body.technologies];
    }

    let features = [];
    if (req.body.features) {
      features = Array.isArray(req.body.features) 
        ? req.body.features 
        : [req.body.features];
    }

    // Stream image to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');

    const project = await Project.create({
      title,
      slug,
      shortDescription,
      fullDescription,
      imageUrl,
      technologies,
      features,
      challenges,
      solutions,
      githubUrl,
      liveUrl,
      featured: featured === 'true' || featured === true,
      displayOrder: parseInt(displayOrder) || 0
    });

    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  const { 
    title, 
    slug, 
    shortDescription, 
    fullDescription, 
    challenges, 
    solutions, 
    githubUrl, 
    liveUrl, 
    featured, 
    displayOrder 
  } = req.body;

  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      return next(new Error('Project not found.'));
    }

    // Check slug collision
    if (slug && slug !== project.slug) {
      const existing = await Project.findOne({ slug });
      if (existing) {
        res.status(400);
        return next(new Error('This slug is already occupied by another project.'));
      }
      project.slug = slug;
    }

    project.title = title || project.title;
    project.shortDescription = shortDescription || project.shortDescription;
    project.fullDescription = fullDescription || project.fullDescription;
    project.challenges = challenges ?? project.challenges;
    project.solutions = solutions ?? project.solutions;
    project.githubUrl = githubUrl ?? project.githubUrl;
    project.liveUrl = liveUrl ?? project.liveUrl;
    project.featured = featured !== undefined ? (featured === 'true' || featured === true) : project.featured;
    project.displayOrder = displayOrder !== undefined ? parseInt(displayOrder) : project.displayOrder;

    // Parse array variables
    if (req.body.technologies) {
      project.technologies = Array.isArray(req.body.technologies) 
        ? req.body.technologies 
        : [req.body.technologies];
    }
    
    if (req.body.features) {
      project.features = Array.isArray(req.body.features) 
        ? req.body.features 
        : [req.body.features];
    }

    // If new cover screenshot file buffer is sent, upload it
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'portfolio/projects');
      project.imageUrl = imageUrl;
    }

    await project.save();
    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      return next(new Error('Project not found.'));
    }

    await project.deleteOne();
    res.status(200).json({ success: true, message: 'Project removed from showcase.' });
  } catch (err) {
    next(err);
  }
};
