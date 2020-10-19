#!/bin/sh

cp gradle.properties.in gradle.properties

if [ "${COMPILATION_NUMBER}" ]
then
  echo "COMPILATION_NUMBER=${COMPILATION_NUMBER}" >> gradle.properties
else
  echo "COMPILATION_NUMBER=0" >> gradle.properties
fi

echo "MYAPP_RELEASE_STORE_FILE=my-upload-key.keystore" >> gradle.properties
echo "MYAPP_RELEASE_KEY_ALIAS=${KEYALIAS}" >> gradle.properties
echo "MYAPP_RELEASE_STORE_PASSWORD=${STOREPASSWORD}" >> gradle.properties
echo "MYAPP_RELEASE_KEY_PASSWORD=${KEYPASSWORD}" >> gradle.properties