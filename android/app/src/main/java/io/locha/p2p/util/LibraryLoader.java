/*
 * Copyright 2019 The Exonum Team
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

package io.locha.p2p.util;

import android.util.Log;

/**
 * A loader of the native shared library with Locha P2P library bindings. It
 * loads the native library and also verifies that it is compatible with the
 * Java classes. The native library is compatible iff it has exactly the same
 * version as this Java library.
 *
 * <p>This class is thread-safe.
 */
public final class LibraryLoader {
    private static final String BINDING_LIB_NAME = "locha_p2p_jni";
    private static final String JAVA_LIBRARY_PATH_PROPERTY = "java.library.path";

    /**
     * The current version of the project. Must be updated on
     * <a href="https://wiki.bf.local/display/EJB/Java+Binding+Release+Checklist+Template">
     * each release</a>.
     */
    private static final String BINDING_VERSION = "0.1.0";

    private static final LibraryLoader INSTANCE = new LibraryLoader(BINDING_VERSION);

    private final String expectedLibVersion;
    private boolean loaded;

    /**
     * Creates a new library loader.
     *
     * @param libraryVersion the version of this library to verify that the native library
     * is compatible with it
     */
    private LibraryLoader(String libraryVersion) {
        Log.i("LochaP2P", String.format("Creating LibraryLoader with library version '%s'", libraryVersion));

        this.expectedLibVersion = libraryVersion;
        this.loaded = false;
    }

    /**
     * Loads the native library.
     *
     * @throws LinkageError if the native library cannot be loaded; or if it is incompatible
     *     with this library version
     */
    public static void load() {
        INSTANCE.loadOnce();
    }

    private synchronized void loadOnce() {
        Log.i("LochaP2P", "Loading library once");

        if (loaded) {
            // It has already been attempted to load the library (successfully or not)
            return;
        }

        try {
            // Try to load the library
            loadLibrary();

            // Check that it has the compatible version
            checkLibraryVersion();
        } finally {
            loaded = true;
        }
    }

    private static void loadLibrary() {
        try {
            Log.i("LochaP2P", String.format("Loading library '%s'", BINDING_LIB_NAME));
            System.loadLibrary(BINDING_LIB_NAME);
        } catch (UnsatisfiedLinkError e) {
            // Throw a new exception with a _full_ error message so that it is always available,
            // even if the logger is not configured.
            throw new LinkageError("Couldn't laod LochaP2P library", e);
        }
    }

    private void checkLibraryVersion() {
        Log.i("LochaP2P", "Checking LochaP2P library version");

        String nativeLibVersion = nativeGetLibraryVersion();

        Log.i("LochaP2P", String.format("Native library version: '%s'", nativeLibVersion));

        if (!expectedLibVersion.equals(nativeLibVersion)) {
            String message = String.format(
                "Mismatch between versions of Java library and native '%s' library:%n"
                    + "  Java library version:   %s%n"
                    + "  Native library version: %s%n",
                BINDING_LIB_NAME, expectedLibVersion, nativeLibVersion);
            throw new LinkageError(message);
        }
    }

    private static native String nativeGetLibraryVersion();
}
