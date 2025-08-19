const { spawn } = require('child_process');
const path = require('path');

// Run init-pages script first
console.log('Initializing page content...');
const initProcess = spawn('npm', ['run', 'init-pages'], {
  stdio: 'inherit',
  shell: true
});

initProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`init-pages process exited with code ${code}`);
    return;
  }
  
  console.log('Page initialization complete. Starting server...');
  
  // Then start the server
  const serverProcess = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
});