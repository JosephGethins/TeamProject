import fs from 'fs';
import path from 'path';

const envExamplePath = path.join(process.cwd(), 'env.example');
const envPath = path.join(process.cwd(), '.env');

// Check if .env file exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  process.exit(0);
}

// Copy env.example to .env
if (fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env file from env.example');
  console.log('');
  console.log('🔧 Next steps:');
  console.log('1. Get your Firebase service account key:');
  console.log('   - Go to https://console.firebase.google.com/');
  console.log('   - Select your project: student-quizhelper');
  console.log('   - Go to Project Settings → Service Accounts');
  console.log('   - Click "Generate new private key"');
  console.log('   - Download the JSON file');
  console.log('');
  console.log('2. Edit the .env file and add:');
  console.log('   - FIREBASE_CLIENT_EMAIL (from the JSON file)');
  console.log('   - FIREBASE_PRIVATE_KEY (from the JSON file, replace \\n with actual newlines)');
  console.log('');
  console.log('3. Enable Firestore Database in Firebase Console');
  console.log('4. Enable Authentication → Email/Password in Firebase Console');
  console.log('');
  console.log('5. Run: npm run dev');
} else {
  console.log('❌ env.example file not found');
  process.exit(1);
}



