import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const BUCKET_NAME = 'campaigns';
const ASSETS_DIR = path.join(__dirname, '../src/assets/campaign');

// Load environment variables manually from .env
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let supabaseUrl = '';
let supabaseKey = '';

envLines.forEach(line => {
  const [key, value] = line.split('=');
  // Prioritize Service Role Key for administrative uploads, fallback to Publishable if needed
  if (key && key.trim() === 'VITE_SUPABASE_URL') supabaseUrl = value.replace(/"/g, '').trim();
  if (key && key.trim() === 'VITE_SUPABASE_SERVICE_ROLE_KEY') supabaseKey = value.replace(/"/g, '').trim();
  if (!supabaseKey && key && key.trim() === 'VITE_SUPABASE_PUBLISHABLE_KEY') supabaseKey = value.replace(/"/g, '').trim();
});

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadCampaignAssets() {
  console.log(`🚀 Starting campaign assets upload to "${BUCKET_NAME}" bucket...`);
  // No sign-in required as per RLS "Public Upload" policy or Service Role key usage.

  try {
    if (!fs.existsSync(ASSETS_DIR)) {
      console.error(`❌ Assets directory not found: ${ASSETS_DIR}`);
      return;
    }

    const files = fs.readdirSync(ASSETS_DIR);
    const targetFiles = files.filter(file => {
      const name = file.toLowerCase();
      return (
        name.endsWith('.jpg') || 
        name.endsWith('.jpeg') || 
        name.endsWith('.png') || 
        name.endsWith('.webp') ||
        name.endsWith('.mp4') || 
        name.endsWith('.mov') || 
        name.endsWith('.avi') ||
        name.endsWith('.webm')
      );
    });

    console.log(`📦 Found ${targetFiles.length} campaign assets to upload.`);

    for (const fileName of targetFiles) {
      console.log(`📤 Uploading ${fileName}...`);
      const filePath = path.join(ASSETS_DIR, fileName);
      const fileBuffer = fs.readFileSync(filePath);

      let contentType = 'application/octet-stream';
      if (fileName.endsWith('.png')) contentType = 'image/png';
      else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (fileName.endsWith('.webp')) contentType = 'image/webp';
      else if (fileName.endsWith('.mp4')) contentType = 'video/mp4';
      else if (fileName.endsWith('.mov')) contentType = 'video/quicktime';
      else if (fileName.endsWith('.avi')) contentType = 'video/x-msvideo';
      else if (fileName.endsWith('.webm')) contentType = 'video/webm';

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, fileBuffer, {
          contentType: contentType,
          upsert: true
        });

      if (error) {
        console.error(`❌ Failed to upload ${fileName}:`, error.message);
      } else {
        console.log(`✅ Uploaded ${fileName} successfully.`);
      }
    }

    console.log('✨ Campaign assets upload completed.');
  } catch (err) {
    console.error('💥 An error occurred during upload:', err.message);
  }
}

uploadCampaignAssets();
