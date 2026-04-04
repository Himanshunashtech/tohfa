import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const BUCKET_NAME = 'product-images';
const ASSETS_DIR = path.join(__dirname, '../src/assets/products');
const ROOT_ASSETS_DIR = path.join(__dirname, '../src/assets');


// Load environment variables manually from .env
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let supabaseUrl = '';
let supabaseKey = '';

envLines.forEach(line => {
  const [key, value] = line.split('=');
  if (key && key.trim() === 'VITE_SUPABASE_URL') supabaseUrl = value.replace(/"/g, '').trim();
  if (key && key.trim() === 'VITE_SUPABASE_PUBLISHABLE_KEY') supabaseKey = value.replace(/"/g, '').trim();
});

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function signIn() {
  console.log('🔐 Signing in as admin...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@tofhaverse.com',
    password: 'TofhaAdmin2024!'
  });

  if (error) {
    console.error('❌ Sign in failed:', error.message);
    process.exit(1);
  }
  console.log('✅ Signed in successfully.');
}

async function uploadImages() {
  console.log(`🚀 Starting bulk upload to ${BUCKET_NAME}...`);

  try {
    let allFiles = [];

    // Scan src/assets/products (p29.jpg, etc.)
    if (fs.existsSync(ASSETS_DIR)) {
      const files = fs.readdirSync(ASSETS_DIR);
      allFiles = allFiles.concat(files.map(f => ({
        name: f,
        path: path.join(ASSETS_DIR, f)
      })));
    }

    // Scan src/assets (product-candle.jpg, etc.)
    if (fs.existsSync(ROOT_ASSETS_DIR)) {
      const files = fs.readdirSync(ROOT_ASSETS_DIR);
      allFiles = allFiles.concat(files.filter(f => f.startsWith('product-')).map(f => ({
        name: f,
        path: path.join(ROOT_ASSETS_DIR, f)
      })));
    }

    // Filter for valid images
    const targetImages = allFiles.filter(file => {
      const name = file.name.toLowerCase();
      return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp');
    });

    console.log(`📦 Found ${targetImages.length} images to upload.`);

    for (const file of targetImages) {
      console.log(`📤 Uploading ${file.name}...`);
      const fileBuffer = fs.readFileSync(file.path);

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(file.name, fileBuffer, {
          contentType: file.name.endsWith('.png') ? 'image/png' : 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.error(`❌ Failed to upload ${file.name}:`, error.message);
      } else {
        console.log(`✅ Uploaded ${file.name} successfully.`);
      }
    }

    console.log('✨ Bulk upload completed.');
  } catch (err) {
    console.error('💥 An error occurred during upload:', err.message);
  }
}

uploadImages();
