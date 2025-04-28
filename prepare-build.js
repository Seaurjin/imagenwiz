/**
 * Script to restore the application build and fix language selector issues
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the current timestamp for backup naming
const timestamp = new Date().toISOString().replace(/[:.]/g, '_');

async function prepareBuild() {
  try {
    console.log('🔄 Starting application rebuild process...');
    
    // Current static files directory
    const staticDir = path.join(__dirname, 'frontend', 'dist');
    
    // Create backup of maintenance page
    const backupDir = path.join(__dirname, `temp-maintenance-${timestamp}`);
    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
      fs.mkdirSync(path.join(__dirname, 'temp'));
    }
    
    // Check if there are any files in the maintenance directory
    const maintenanceFiles = fs.readdirSync(staticDir);
    if (maintenanceFiles.length === 0) {
      console.log('⚠️ No maintenance files found, nothing to backup');
    } else {
      try {
        // Copy current maintenance page to backup
        execSync(`cp -r ${staticDir} ${backupDir}`);
        console.log(`✅ Backed up maintenance page to ${backupDir}`);
      } catch (err) {
        console.log('⚠️ Failed to backup maintenance page:', err.message);
        // Continue anyway - this is just a backup
      }
    }
    
    // Create a rebuild steps script for restoring the application
    const rebuildScript = path.join(__dirname, 'rebuild-application.sh');
    const scriptContent = `#!/bin/bash
# Automated rebuild script for iMagenWiz
echo "🔄 Starting application rebuild process..."

# Check if restore backup exists
if [ -d "frontend/dist-backup" ]; then
  echo "✅ Found frontend backup, restoring..."
  rm -rf frontend/dist
  cp -r frontend/dist-backup frontend/dist
else
  echo "⚠️ No backup found, rebuilding from scratch..."
  cd frontend && npm run build
fi

# Copy our fix scripts to the production build
echo "📝 Copying fix scripts to build directory..."
cp frontend/dist/removeSecondLanguageSelector.js frontend/dist/
cp frontend/dist/index.html frontend/dist/index.original.html

# Update the main index.html to load our language selector fix
echo "🔧 Updating index.html to include language selector fix..."
sed -i '/<body>/a \\    <!-- Script to remove duplicate language selectors -->\\    <script src="\\/removeSecondLanguageSelector.js"><\\/script>' frontend/dist/index.html

echo "✅ Rebuild complete!"
`;
    
    // Write the rebuild script
    fs.writeFileSync(rebuildScript, scriptContent, { mode: 0o755 }); // Make executable
    console.log(`✅ Created rebuild script at ${rebuildScript}`);
    
    // Execute the rebuild script
    console.log('🚀 Executing rebuild script...');
    execSync(`bash ${rebuildScript}`, { stdio: 'inherit' });
    
    console.log('✅ Build preparation completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error during build preparation:', error);
    return false;
  }
}

// Run the build preparation
prepareBuild()
  .then(success => {
    if (success) {
      console.log('🎉 Build preparation completed successfully!');
    } else {
      console.error('❌ Build preparation failed!');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ Unhandled error during build preparation:', err);
    process.exit(1);
  });