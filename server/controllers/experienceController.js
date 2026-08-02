import Experience from '../models/Experience.js';

// @desc    Get all experience logs
// @route   GET /api/experiences
// @access  Public
export const getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ displayOrder: 1, startDate: -1 });
    res.status(200).json({ success: true, experiences });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new experience timeline item
// @route   POST /api/experiences
// @access  Private
export const createExperience = async (req, res, next) => {
  const { 
    position, 
    company, 
    startDate, 
    endDate, 
    currentStatus, 
    description, 
    technologies, 
    displayOrder 
  } = req.body;

  try {
    const experience = await Experience.create({
      position,
      company,
      startDate,
      endDate: currentStatus ? null : endDate,
      currentStatus,
      description,
      technologies,
      displayOrder: parseInt(displayOrder) || 0
    });
    res.status(201).json({ success: true, experience });
  } catch (err) {
    next(err);
  }
};

// @desc    Update experience timeline item
// @route   PUT /api/experiences/:id
// @access  Private
export const updateExperience = async (req, res, next) => {
  const { 
    position, 
    company, 
    startDate, 
    endDate, 
    currentStatus, 
    description, 
    technologies, 
    displayOrder 
  } = req.body;

  try {
    let experience = await Experience.findById(req.params.id);
    if (!experience) {
      res.status(404);
      return next(new Error('Experience item not found.'));
    }

    experience.position = position || experience.position;
    experience.company = company || experience.company;
    experience.startDate = startDate || experience.startDate;
    experience.currentStatus = currentStatus !== undefined ? currentStatus : experience.currentStatus;
    
    if (experience.currentStatus) {
      experience.endDate = null;
    } else {
      experience.endDate = endDate || experience.endDate;
    }

    experience.description = description || experience.description;
    experience.technologies = technologies || experience.technologies;
    experience.displayOrder = displayOrder !== undefined ? parseInt(displayOrder) : experience.displayOrder;

    await experience.save();
    res.status(200).json({ success: true, experience });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete experience timeline item
// @route   DELETE /api/experiences/:id
// @access  Private
export const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      res.status(404);
      return next(new Error('Experience item not found.'));
    }

    await experience.deleteOne();
    res.status(200).json({ success: true, message: 'Experience item deleted.' });
  } catch (err) {
    next(err);
  }
};
