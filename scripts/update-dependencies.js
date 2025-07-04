#!/usr/bin/env node

// update-dependencies.js
// This script updates dependencies to ensure compatibility and fix deprecation warnings

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

console.log(`${colors.blue}=== BabyCare App Dependency Update Tool ===${colors.reset}`);
console.log(`${colors.yellow}This script will update dependencies to fix deprecation warnings${colors.reset}\n`);

try {
  // 1. Fix NumPy version for backend
  console.log(`${colors.blue}[1/5] Updating Flask API dependencies...${colors.reset}`);
  try {
    // Make sure we're on the correct version of NumPy for Numba compatibility
    execSync('pip install numpy==2.2.0', { stdio: 'inherit' });
    console.log(`${colors.green}✓ NumPy updated to version 2.2.0${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠ Error updating NumPy, you may need to run as administrator${colors.reset}`);
    console.log(`${colors.yellow}⚠ Try manually running: pip install numpy==2.2.0${colors.reset}`);
  }

  // 2. Add expo-audio as a preparation for migration
  console.log(`\n${colors.blue}[2/5] Adding expo-audio as preparation for migration from expo-av...${colors.reset}`);
  try {
    execSync('npm install --save expo-audio', { stdio: 'inherit' });
    console.log(`${colors.green}✓ Added expo-audio package${colors.reset}`);
  } catch (error) {
    console.log(`${colors.yellow}⚠ Error adding expo-audio, it might not be available yet${colors.reset}`);
    console.log(`${colors.yellow}⚠ You'll need to check expo's documentation for the correct package${colors.reset}`);
  }

  // 3. Update React Native dependencies to fix style warnings
  console.log(`\n${colors.blue}[3/5] Checking for React Native updates...${colors.reset}`);
  execSync('npm update', { stdio: 'inherit' });
  console.log(`${colors.green}✓ Dependencies updated${colors.reset}`);

  // 4. Add migration document reminder
  console.log(`\n${colors.blue}[4/5] Creating expo-av migration document...${colors.reset}`);
  const migrationDoc = path.join(process.cwd(), 'docs', 'expo-av-migration.md');
  if (fs.existsSync(migrationDoc)) {
    console.log(`${colors.green}✓ Migration document already exists${colors.reset}`);
  } else {
    try {
      if (!fs.existsSync(path.join(process.cwd(), 'docs'))) {
        fs.mkdirSync(path.join(process.cwd(), 'docs'));
      }
      console.log(`${colors.yellow}⚠ Migration document not found. Please create it manually.${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}✗ Error creating docs directory${colors.reset}`);
    }
  }

  // 5. Update Flask API to use timezone-aware datetime
  console.log(`\n${colors.blue}[5/5] Updating Flask API to use timezone-aware datetime...${colors.reset}`);
  const appPyPath = path.join(process.cwd(), 'cry-ai-api', 'app.py');
  
  if (fs.existsSync(appPyPath)) {
    try {
      let content = fs.readFileSync(appPyPath, 'utf8');
      
      // Add timezone import
      if (!content.includes('from datetime import timezone')) {
        content = content.replace(
          'import datetime',
          'import datetime\nfrom datetime import timezone'
        );
      }
      
      // Replace utcnow with now(timezone.utc)
      content = content.replace(
        /datetime\.datetime\.utcnow\(\)/g,
        'datetime.datetime.now(timezone.utc)'
      );
      
      fs.writeFileSync(appPyPath, content);
      console.log(`${colors.green}✓ Flask API updated to use timezone-aware datetime${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}✗ Error updating app.py${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}✗ app.py not found${colors.reset}`);
  }

  console.log(`\n${colors.green}=== Updates Completed ===${colors.reset}`);
  console.log(`${colors.yellow}Note: Some warnings may still appear from third-party libraries.${colors.reset}`);
  console.log(`${colors.yellow}Please refer to docs/expo-av-migration.md for guidance on migrating from expo-av.${colors.reset}`);
} catch (error) {
  console.log(`\n${colors.red}Error during update process:${colors.reset}`, error);
  process.exit(1);
}
