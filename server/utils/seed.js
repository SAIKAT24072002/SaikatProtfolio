import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';

// Setup environment configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleSkills = [
  // Frontend
  { name: 'HTML', icon: 'FileCode', category: 'Frontend', displayOrder: 1 },
  { name: 'CSS', icon: 'Brush', category: 'Frontend', displayOrder: 2 },
  { name: 'JavaScript', icon: 'Code2', category: 'Frontend', displayOrder: 3 },
  { name: 'React', icon: 'Atom', category: 'Frontend', displayOrder: 4 },
  { name: 'Tailwind CSS', icon: 'Wind', category: 'Frontend', displayOrder: 5 },
  // Backend
  { name: 'Node.js', icon: 'Cpu', category: 'Backend', displayOrder: 1 },
  { name: 'Express.js', icon: 'Server', category: 'Backend', displayOrder: 2 },
  { name: 'REST API', icon: 'Globe', category: 'Backend', displayOrder: 3 },
  { name: 'JWT', icon: 'KeyRound', category: 'Backend', displayOrder: 4 },
  { name: 'Socket.io', icon: 'Zap', category: 'Backend', displayOrder: 5 },
  // Database
  { name: 'MongoDB', icon: 'Database', category: 'Database', displayOrder: 1 },
  { name: 'Mongoose', icon: 'Layers', category: 'Database', displayOrder: 2 },
  // Tools
  { name: 'Git', icon: 'GitBranch', category: 'Tools', displayOrder: 1 },
  { name: 'GitHub', icon: 'FolderGit', category: 'Tools', displayOrder: 2 },
  { name: 'Postman', icon: 'FileJson', category: 'Tools', displayOrder: 3 },
  { name: 'Vercel', icon: 'CloudUpload', category: 'Tools', displayOrder: 4 }
];

const sampleProfile = {
  name: 'SAIKAT KHAMRAI',
  title: 'Full Stack MERN Developer',
  bio: 'I build responsive, secure, and highly scalable web applications utilizing React, Node.js, Express, and MongoDB.',
  about: 'I am a highly motivated Full Stack Developer specializing in Javascript stacks. I focus on clean software architectures, performant database schema queries, and elegant user-friendly designs.',
  avatar: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
  resume: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.pdf',
  socialLinks: {
    github: 'https://github.com/saikatkhamrai',
    linkedin: 'https://linkedin.com/in/saikatkhamrai',
    email: 'saikat@portfolio.local',
    twitter: 'https://twitter.com'
  }
};

const sampleProjects = [
  {
    title: 'Real-Time Chat Application',
    slug: 'real-time-chat-application',
    shortDescription: 'Scalable MERN chatting system featuring private chatrooms and instant messaging routing.',
    fullDescription: 'A production-style real-time chat application engineered with React, Node.js, and Socket.io. Implements horizontal scaling features, protected router layouts, and session verification tokens.',
    imageUrl: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'Node.js', 'Express', 'Socket.io', 'MongoDB'],
    features: ['Instant private chats', 'User online state indicators', 'Message delivery receipts'],
    challenges: 'Preventing lag and race conditions during high concurrent socket room connections.',
    solutions: 'Implemented state caching and separate Mongoose write pipelines to avoid db blocking calls.',
    githubUrl: 'https://github.com/saikatkhamrai',
    liveUrl: 'https://example.com',
    featured: true,
    displayOrder: 1
  },
  {
    title: 'Notes Management Application',
    slug: 'notes-management-application',
    shortDescription: 'A secure note-taking utility with rich text editing and tag categorization.',
    fullDescription: 'A premium notes organizer featuring text configurations, tags search indexing, and profile sync layers. Integrated with full database validation protocols.',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    features: ['Auto-save changes', 'Note categories organizing', 'Secure user database sync'],
    challenges: 'Syncing state conflicts between server edits and browser offline saves.',
    solutions: 'Created timestamp-based version validations inside Mongoose schema rules.',
    githubUrl: 'https://github.com/saikatkhamrai',
    liveUrl: 'https://example.com',
    featured: false,
    displayOrder: 2
  }
];

const sampleExperiences = [
  {
    position: 'Full Stack MERN Developer Intern',
    company: 'Tech Academy Inc.',
    startDate: new Date('2025-01-01'),
    currentStatus: true,
    description: [
      'Developed clean RESTful API modules with input validators and exception limits.',
      'Constructed front-end dashboard panels with Framer Motion animations and collapsible sidebar menus.',
      'Designed Mongoose schemas with indexes to optimize search queries.'
    ],
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Git'],
    displayOrder: 1
  }
];

const sampleEducation = [
  {
    degree: 'Bachelor of Technology in Computer Science',
    institution: 'University of Technology',
    startYear: '2022',
    endYear: '2026',
    description: 'Specialization in Software Engineering and Database Management Systems. CGPA: 9.0',
    displayOrder: 1
  }
];

const seedDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('CRITICAL ERROR: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(mongoUri);
    console.log('DB connection successful. Initializing wipe...');

    // Clear existing collections
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});

    console.log('Wipe completed. Creating default admin account...');

    // Extract seed password from env, fallback to secure dev string
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@2026!';
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@portfolio.local';

    const adminUser = await User.create({
      username: 'admin',
      email: adminEmail,
      password: adminPassword
    });

    console.log('----------------------------------------------------');
    console.log(`SUCCESS: Admin account created!`);
    console.log(`Email Address: ${adminEmail}`);
    console.log(`Password: ${adminPassword} (Keep this password secure!)`);
    console.log('----------------------------------------------------');

    // Seed Profile
    await Profile.create(sampleProfile);
    console.log('Seeded Developer Profile settings.');

    // Seed Skills
    await Skill.insertMany(sampleSkills);
    console.log(`Seeded ${sampleSkills.length} Technical Skills.`);

    // Seed Projects
    await Project.insertMany(sampleProjects);
    console.log(`Seeded ${sampleProjects.length} Sample Showcase Projects.`);

    // Seed Experiences
    await Experience.insertMany(sampleExperiences);
    console.log('Seeded Timeline Work History.');

    // Seed Education
    await Education.insertMany(sampleEducation);
    console.log('Seeded Timeline Academic Background.');

    console.log('\nSeeding completed successfully! Process shutting down.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`Seeding script failure: ${err.message}`);
    process.exit(1);
  }
};

seedDatabase();
