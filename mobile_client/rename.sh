#!/usr/bin/env bash

newAppName=$1
onScreenName=$2
newLowerCaseName=`echo $newAppName | tr '[:upper:]' '[:lower:]'`

appRoot=`dirname $0`

[ -z "${newAppName}" ] && echo 'Missing required parameter newAppName' && exit 1

if [ -z "$onScreenName" ]; then
  echo "No on-screen mame passed. SEMA will be used."
fi

# We need 
if [ ! -d "node_modules" ]; then
  echo "node_modules directory not found. Installing dependencies..."
  yarn
fi

# Gather all modification targets
filesToModify=$(grep -riIl 'SEMAPOS' --exclude='rename.sh' $appRoot/*)
filesToRename=$(find "${appRoot}/ios" "${appRoot}/android" -type f -ipath '*SEMAPOS*')

# Replace strings in files
for fileToModify in $filesToModify; do
  sed -i.bak "s/SEMAPOS/${newAppName}/g;s/SEMAPOS/${newLowerCaseName}/g" $fileToModify
done
find "${appRoot}" -name '*.bak' -exec rm {} \;

if [ -d "${appRoot}/.git" -a -n "$(command -v git)" ]; then
  # Stage all string replacements and set up to stage renames, below
  git add --update
  mvCmd="git mv"
else
  mvCmd="mv"
fi

for fileToRename in $filesToRename; do
  newName=$(echo $fileToRename | sed "s/SEMAPOS/$newAppName/g;s/SEMAPOS/$newLowerCaseName/g")
  mkdir -p $(dirname "$newName") && $mvCmd "$fileToRename" "$newName"
done

# Remove leftover empty directories
rmdir -p $(find "$appRoot" -ipath '*SEMAPOS*' -type d) 2>/dev/null

# Check if if it's empty or not
if [ -n "$onScreenName" ]; then
    sed -i.bak "s/SEMA/${onScreenName}/g" android/app/src/main/res/values/strings.xml
    rm android/app/src/main/res/values/strings.xml.bak
fi

YELLOW='\033[1;33m'
CLEAR='\033[0m'
printf "\nRenamed application to ${newAppName}."
if [ -n "$onScreenName" ]; then
  printf "\nAlso changed the on-screen name to $onScreenName."
fi

printf "${YELLOW}\n\nIf you have previously built the application, please clean your build artifacts"
echo "${YELLOW}\n\nAndroid:\n(cd android; ./gradlew clean)${CLEAR}\n"

read -p "Would you like to clean your Android build? [Y/n] " yesorno

if [ "$yesorno" = "y" ] || [ "$yesorno" = "Y" ] || [ -z "$yesorno" ]; then
  cd android; ./gradlew clean
fi