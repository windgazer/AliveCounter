###
# adbforward.command
# Runs the adb forward command to allow for Android remote debugging.
# In order for this to work make sure:
# 
# 1. ADT (Android Developer Tools) are  installed and adb is on your path.
# 2. USB Debugging is enabled on your Android device.
# 3. Chrome 'Enable USB Web Debugging' is enabled on that device too.
# 
# Oh, and your USB cable is plugged into both your computer and Android
# device :)
# 
# Also, with `adb devices` you can verify if your device is available
# for debugging.  
#
# Simply double-click the .command file...

adb devices
adb forward tcp:9222 localabstract:chrome_devtools_remote