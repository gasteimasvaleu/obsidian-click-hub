import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bibliatoonkids.app',
  appName: 'BíbliaToon Club',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
    backgroundColor: '#000000',
    packageClassList: [
      'CAPCameraPlugin',
      'CAPLiveUpdatesPlugin',
      'PurchasesPlugin',
      'NativeAppleSignInPlugin'
    ]
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
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '895146984736-se9con0r5b6qatgtk1mfqcs6qq755m97.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    LiveUpdates: {
      appId: '688c8cc6', // <--- COLOQUE O SEU APP ID DO IONIC AQUI
      channel: 'Production',
      autoUpdateMethod: 'background',
      maxVersions: 3
    }
  },
};

export default config;




