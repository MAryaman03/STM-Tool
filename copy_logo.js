const fs = require('fs');
const src = 'e:/SMT_Tool/frontend/public/images/tabBarLogo.png';
const dest = 'e:/SMT_Tool/dashboard/public/tabBarLogo.png';
const src2 = 'E:/SMT_Tool/tabBarLogo.png';

if (fs.existsSync(src2)) {
  fs.copyFileSync(src2, dest);
  console.log('Copied from root');
} else if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Copied from frontend');
} else {
  console.log('File not found');
}
