

## Plan: Fix Android MainActivity for Google Sign-In

**Problem**: The `@capgo/capacitor-social-login` plugin requires the Android `MainActivity.java` to implement a specific interface and override `onActivityResult`. Without this, the plugin throws "You cannot use scopes without modifying the main activity."

**Solution**: Update `MainActivity.java` to implement the required interface.

### Changes

**File: `android/app/src/main/java/com/bibliatoonkids/app/MainActivity.java`**

Replace with:

```java
package com.bibliatoonkids.app;

import android.content.Intent;
import com.getcapacitor.BridgeActivity;
import ee.forgr.capacitor.social.login.GoogleProvider;
import ee.forgr.capacitor.social.login.ModifiedMainActivityForSocialLoginPlugin;

public class MainActivity extends BridgeActivity implements ModifiedMainActivityForSocialLoginPlugin {
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        GoogleProvider.Companion.handleOnActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void IHaveModifiedTheMainActivityForTheUseWithSocialLoginPlugin() {}
}
```

**File: `fix-android-appid.cjs`** — Also update the script that regenerates `MainActivity.java` to include this new code, so future builds don't overwrite it with the bare version.

### After approval

1. I'll update both files
2. You'll need to rebuild the Android app (`npm run build && npx cap sync android`) and redeploy — this is a **native code change**, so Live Update won't work. You need to rebuild the APK/AAB in Android Studio.

