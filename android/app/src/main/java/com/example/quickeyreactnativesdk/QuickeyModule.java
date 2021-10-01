package com.quickeyreactnativesdk;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.Map;

public class QuickeyModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private final ReactApplicationContext reactContext;
    private Callback callback;
    static final int AUTHENTICATION_REQUEST = 1000;
    public QuickeyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("bundleIdentifier", reactContext.getApplicationInfo().packageName);
        return constants;
    }

    @NonNull
    @Override
    public String getName() {
        return "QuickeyModule";
    }

    @ReactMethod
    public void showUrl(String url, Callback callback) {
        final Activity activity = getCurrentActivity();
        final Uri parsedUrl = Uri.parse(url);
        this.callback = callback;

        try {
            if (activity != null) {
                AuthenticationActivity.authenticateUsingBrowser(activity, parsedUrl);
            } else {
                final WritableMap error = Arguments.createMap();
                error.putString("error", "qk.activity_not_available");
                error.putString("error_description", "Android Activity is null.");
                callback.invoke(error, null);
            }
        } catch (ActivityNotFoundException e){
            final WritableMap error = Arguments.createMap();
            error.putString("error", "qk.browser_not_available");
            error.putString("error_description", "No Browser application is installed.");
            callback.invoke(error, null);
        }
    }

    @ReactMethod
    public void hide() {
        // NO OP
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Callback cb = QuickeyModule.this.callback;
        if (cb == null) {
            return;
        }
        boolean hasResult = resultCode == RESULT_OK &&
                requestCode == AuthenticationActivity.AUTHENTICATION_REQUEST &&
                data.getData() != null;
        if (hasResult) {
            Map<String, String> resultData = new HashMap<>();
            resultData.put("email", data.getData().getQueryParameter("email"));
            resultData.put("provider", data.getData().getQueryParameter("provider"));
            JSONObject resultJSON = new JSONObject(resultData);
            cb.invoke(null, resultJSON.toString());
        } else {
            final WritableMap error = Arguments.createMap();
            error.putString("error", "qk.session.user_cancelled");
            error.putString("error_description", "User cancelled the Auth");
            cb.invoke(error, null);
        }
        QuickeyModule.this.callback = null;
    }

    @Override
    public void onNewIntent(Intent intent) {
        // NO OP
    }
}
