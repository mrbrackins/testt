package com.shoutemapp;

import androidx.multidex.MultiDexApplication;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.hermes.reactexecutor.HermesExecutorFactory;
import com.facebook.react.bridge.JavaScriptExecutorFactory;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
//NativeModuleInjectionMark-mainApplication-import
import com.microsoft.codepush.react.CodePush;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.airbnb.android.react.maps.MapsPackage;

import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    //NativeModuleInjectionMark-mainApplication-body

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        //NativeModuleInjectionMark-mainApplication-rnhost-body
        
protected String getJSBundleFile() {
  return CodePush.getJSBundleFile();
}


        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          //NativeModuleInjectionMark-mainApplication-getPackages
          packages.add(new CodePush(null, getApplicationContext(), BuildConfig.DEBUG));
          packages.add(new FBSDKPackage());
          packages.add(new MapsPackage());

          return packages;
        }
    };

    protected String getJSMainModuleName() {
        return "index";
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
        //NativeModuleInjectionMark-mainApplication-oncreate-end

    }
    /**
    * Loads Flipper in React Native templates.
    * Call this in the onCreate method with something like:
    * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    *
    * @param context
    */
    private static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.shoutemapp.ReactNativeFlipper");
        aClass
          .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
          .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
