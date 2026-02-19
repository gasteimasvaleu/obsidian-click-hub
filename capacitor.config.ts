import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bibliatoonkids.app',
  appName: 'BíbliaToon KIDS',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
  },
  server: {
    hostname: 'app.bibliatoonkids.com',
    iosScheme: 'https',
    androidScheme: 'https',
    allowNavigation: [
      '*.youtube.com',
      '*.youtube-nocookie.com',
      '*.googlevideo.com',
      '*.ytimg.com',
      '*.vimeo.com',
      '*.vimeocdn.com',
      '*.akamaized.net'
    ]
  },
  plugins: {
    LiveUpdates: {
      appId: '688c8cc6', // <--- COLOQUE O SEU APP ID DO IONIC AQUI
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 3
    }
  }
};

export default config;



