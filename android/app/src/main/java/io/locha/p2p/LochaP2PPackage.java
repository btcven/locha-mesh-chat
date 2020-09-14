/*
 * Copyright 2020 Locha Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.locha.p2p;

import io.locha.p2p.service.ChatServiceModule;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import android.util.Log;

public class LochaP2PPackage implements ReactPackage {
    private static String TAG = "LochaP2P";

    @Override public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        Log.d(TAG, "Creating view managers");
        return Collections.emptyList();
    }

    @Override public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        Log.d(TAG, "Creating native modules");

        List<NativeModule> modules = new ArrayList<>();

        Log.d(TAG, "Adding ChatServiceModule");
        modules.add(new ChatServiceModule(reactContext));

        return modules;
    }
}