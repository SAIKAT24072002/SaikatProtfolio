const emailRegex = /^\S+@\S+\.\S+$/;

export const validateMessage = (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400);
    return next(new Error('Please provide a valid name.'));
  }
  if (!email || !emailRegex.test(email)) {
    res.status(400);
    return next(new Error('Please provide a valid email address.'));
  }
  if (!subject || typeof subject !== 'string' || !subject.trim() || subject.length > 100) {
    res.status(400);
    return next(new Error('Subject is required and must not exceed 100 characters.'));
  }
  if (!message || typeof message !== 'string' || !message.trim() || message.length > 2000) {
    res.status(400);
    return next(new Error('Message body is required and must not exceed 2000 characters.'));
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !emailRegex.test(email)) {
    res.status(400);
    return next(new Error('Please provide a valid email address.'));
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    res.status(400);
    return next(new Error('Password is required.'));
  }

  next();
};

export const validateSkill = (req, res, next) => {
  const { name, icon, category } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400);
    return next(new Error('Skill name is required.'));
  }
  if (!icon || typeof icon !== 'string' || !icon.trim()) {
    res.status(400);
    return next(new Error('Lucide icon name is required.'));
  }
  if (!category || !['Frontend', 'Backend', 'Database', 'Tools'].includes(category)) {
    res.status(400);
    return next(new Error('Category must be Frontend, Backend, Database, or Tools.'));
  }

  next();
};

export const validateExperience = (req, res, next) => {
  const { position, company, startDate } = req.body;

  if (!position || typeof position !== 'string' || !position.trim()) {
    res.status(400);
    return next(new Error('Position role title is required.'));
  }
  if (!company || typeof company !== 'string' || !company.trim()) {
    res.status(400);
    return next(new Error('Company name is required.'));
  }
  if (!startDate || isNaN(Date.parse(startDate))) {
    res.status(400);
    return next(new Error('A valid start date is required.'));
  }

  next();
};

export const validateEducation = (req, res, next) => {
  const { degree, institution, startYear, endYear } = req.body;

  if (!degree || typeof degree !== 'string' || !degree.trim()) {
    res.status(400);
    return next(new Error('Degree name is required.'));
  }
  if (!institution || typeof institution !== 'string' || !institution.trim()) {
    res.status(400);
    return next(new Error('Institution name is required.'));
  }
  if (!startYear || !startYear.trim()) {
    res.status(400);
    return next(new Error('Start year is required.'));
  }
  if (!endYear || !endYear.trim()) {
    res.status(400);
    return next(new Error('End year is required.'));
  }

  next();
};
