@echo off
set NEXT_TELEMETRY_DISABLED=1
npx --yes kill-port 3000
npm run build
start cmd /k "npm run start"
