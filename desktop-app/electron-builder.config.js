// desktop-app/electron-builder.config.js
module.exports = {
  appId: 'com.jobtracker.app',
  productName: 'Job Application Assistant',
  directories: {
    output: 'release',
    buildResources: 'build',
  },
  files: [
    'dist/**/*',
    'electron/**/*',
    'package.json',
  ],
  mac: {
    target: ['dmg', 'zip'],
    icon: 'build/icon.icns',
    category: 'public.app-category.productivity',
  },
  win: {
    target: ['nsis', 'portable'],
    icon: 'build/icon.ico',
  },
  linux: {
    target: ['AppImage', 'deb'],
    icon: 'build/icon.png',
    category: 'Office',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
};