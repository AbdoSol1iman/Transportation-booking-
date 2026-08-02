const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../Model/User');
const { ROLES } = require('../config/roles');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI is missing in .env file!');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@transport.com';
    const adminPhone = process.env.ADMIN_PHONE || '01000000000';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { phone: adminPhone }],
    });

    if (existingAdmin) {
      console.log(`ℹ️ Admin user already exists: ${existingAdmin.email} (Role: ${existingAdmin.role})`);
      process.exit(0);
    }

    const adminUser = await User.create({
      fullName: 'System Administrator',
      email: adminEmail,
      phone: adminPhone,
      passwordHash: adminPassword,
      role: ROLES.ADMIN,
      status: 'active',
    });

    console.log('🎉 Super Admin account created successfully!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`🛡️ Role: ${adminUser.role}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating Admin account:', error);
    process.exit(1);
  }
};

seedAdmin();
