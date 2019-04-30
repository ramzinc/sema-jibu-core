# Create bundle
echo Generating the signing key
sudo keytool -genkey -v -keystore android/app/sema-pos-key.keystore -alias sema-pos-key -keyalg RSA -keysize 2048 -validity 10000

# Get keystore password from user
echo # Add a blank line so the user can clearly see the input request
read -s -p "Enter your keystore password again: " password
echo

# Setup Gradle variables
echo Adding keystore password to the gradle config file
sed -i -e "s/SEMA-RELEASE-KEY-PASSWORD/$password/g" android/gradle.properties

# Build the release apk
echo Generating the release APK
cd android
./gradlew assembleRelease
