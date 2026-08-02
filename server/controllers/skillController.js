import Skill from '../models/Skill.js';

// @desc    Get all technical skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ displayOrder: 1, createdAt: 1 });
    res.status(200).json({ success: true, skills });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res, next) => {
  const { name, icon, category, displayOrder } = req.body;

  try {
    const skill = await Skill.create({
      name,
      icon,
      category,
      displayOrder: parseInt(displayOrder) || 0
    });
    res.status(201).json({ success: true, skill });
  } catch (err) {
    next(err);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res, next) => {
  const { name, icon, category, displayOrder } = req.body;

  try {
    let skill = await Skill.findById(req.params.id);
    if (!skill) {
      res.status(404);
      return next(new Error('Skill not found.'));
    }

    skill.name = name || skill.name;
    skill.icon = icon || skill.icon;
    skill.category = category || skill.category;
    skill.displayOrder = displayOrder !== undefined ? parseInt(displayOrder) : skill.displayOrder;

    await skill.save();
    res.status(200).json({ success: true, skill });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      res.status(404);
      return next(new Error('Skill not found.'));
    }

    await skill.deleteOne();
    res.status(200).json({ success: true, message: 'Skill deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
