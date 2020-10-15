#!/bin/sh

cp gradle.properties.in gradle.properties

if [ "${VERSION}" ]
then
  echo "COMPILATION_VERSION=${VERSION}" >> gradle.properties
else
  echo "COMPILATION_VERSION=1.0" >> gradle.properties
fi

echo "MYAPP_RELEASE_STORE_FILE=my-upload-key.keystore" >> gradle.properties
echo "MYAPP_RELEASE_KEY_ALIAS=${KEYALIAS}" >> gradle.properties
echo "MYAPP_RELEASE_STORE_PASSWORD=${STOREPASSWORD}" >> gradle.properties
echo "MYAPP_RELEASE_KEY_PASSWORD=${KEYPASSWORD}" >> gradle.properties