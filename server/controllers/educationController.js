import Education from '../models/Education.js';

// @desc    Get all education milestones
// @route   GET /api/education
// @access  Public
export const getEducation = async (req, res, next) => {
  try {
    const education = await Education.find().sort({ displayOrder: 1, endYear: -1 });
    res.status(200).json({ success: true, education });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new education milestone
// @route   POST /api/education
// @access  Private
export const createEducation = async (req, res, next) => {
  const { degree, institution, startYear, endYear, description, displayOrder } = req.body;

  try {
    const educationItem = await Education.create({
      degree,
      institution,
      startYear,
      endYear,
      description,
      displayOrder: parseInt(displayOrder) || 0
    });
    res.status(201).json({ success: true, educationItem });
  } catch (err) {
    next(err);
  }
};

// @desc    Update education milestone
// @route   PUT /api/education/:id
// @access  Private
export const updateEducation = async (req, res, next) => {
  const { degree, institution, startYear, endYear, description, displayOrder } = req.body;

  try {
    let educationItem = await Education.findById(req.params.id);
    if (!educationItem) {
      res.status(404);
      return next(new Error('Education record not found.'));
    }

    educationItem.degree = degree || educationItem.degree;
    educationItem.institution = institution || educationItem.institution;
    educationItem.startYear = startYear || educationItem.startYear;
    educationItem.endYear = endYear || educationItem.endYear;
    educationItem.description = description ?? educationItem.description;
    educationItem.displayOrder = displayOrder !== undefined ? parseInt(displayOrder) : educationItem.displayOrder;

    await educationItem.save();
    res.status(200).json({ success: true, educationItem });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete education milestone
// @route   DELETE /api/education/:id
// @access  Private
export const deleteEducation = async (req, res, next) => {
  try {
    const educationItem = await Education.findById(req.params.id);
    if (!educationItem) {
      res.status(404);
      return next(new Error('Education record not found.'));
    }

    await educationItem.deleteOne();
    res.status(200).json({ success: true, message: 'Education record deleted.' });
  } catch (err) {
    next(err);
  }
};
