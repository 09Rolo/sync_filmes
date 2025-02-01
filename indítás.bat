@echo off
color 2

cd %cd%/rendszer

npm start

echo Sikeresen elindult!
echo.
ping localhost -n 2 >nul
exit