const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const dns = require('dns');

// Configure public DNS servers to resolve MongoDB Atlas SRV records reliably on Windows
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const { User } = require('./models');
const { Profile } = require('./models');
const { Project } = require('./models');
const { Experience } = require('./models');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'password123';

const seed = async () => {
  try {
    await User.deleteMany();
    await Profile.deleteMany();
    await Project.deleteMany();
    await Experience.deleteMany();

    const user = await User.create({ email: DEFAULT_ADMIN_EMAIL, password: DEFAULT_ADMIN_PASSWORD });
    
    await Profile.create({
      name: 'Mahendra Baghel',
      title: 'AI • ML • Data Engineer',
      description: 'Final-year Computer Science Engineering student specializing in Artificial Intelligence, Machine Learning, Deep Learning and Data Analytics.',
      cgpa: '8.2',
      projectsCount: '4+',
      internshipsCount: '3+',
      problemsSolved: '30+',
      email: 'msb10102005@gmail.com'
    });

    await Project.create([
      { title: 'Real-Time Emotion Detection', category: 'dl', technologies: ['Python', 'TensorFlow'] },
      { title: 'Sign Language Translator', category: 'dl', technologies: ['Python', 'CNN'] }
    ]);

    await Experience.create([
      { company: 'Google for Developers', position: 'AI/ML Intern', startDate: 'Jul 2024', endDate: 'Sep 2024' }
    ]);

    console.log(`Data seeded! Admin login: ${DEFAULT_ADMIN_EMAIL} / ${DEFAULT_ADMIN_PASSWORD}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seed();
