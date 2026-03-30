

## Hide Google Sign-In on Web

The Google button currently shows on web because the condition is `platform !== 'ios'`. Since you're not using the web version anymore, we should restrict it to Android only.

### Change

**`src/pages/Login.tsx`** — Change the condition wrapping the Google button from `platform !== 'ios'` to `platform === 'android'`. This way it only appears on the native Android app.

