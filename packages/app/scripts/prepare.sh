#!/usr/bin/env bash

mv ./node_modules/capacitor-appmetrica-plugin/CapacitorAppmetricaPlugin.podspec ./node_modules/capacitor-appmetrica-plugin/CapacitorAppmetricaPlugin.txt
sed -i '' 's/12.0/13.0/g' ./node_modules/capacitor-appmetrica-plugin/CapacitorAppmetricaPlugin.txt
mv ./node_modules/capacitor-appmetrica-plugin/CapacitorAppmetricaPlugin.txt ./node_modules/capacitor-appmetrica-plugin/CapacitorAppmetricaPlugin.podspec

mv ./node_modules/capacitor-pass-to-wallet/CapacitorPassToWallet.podspec ./node_modules/capacitor-pass-to-wallet/CapacitorPassToWallet.txt
sed -i '' 's/12.0/13.0/g' ./node_modules/capacitor-pass-to-wallet/CapacitorPassToWallet.txt
mv ./node_modules/capacitor-pass-to-wallet/CapacitorPassToWallet.txt ./node_modules/capacitor-pass-to-wallet/CapacitorPassToWallet.podspec
