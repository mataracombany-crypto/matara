@echo off
chcp 65001 >nul
cd /d "%~dp0"
python update_products.py
echo.
echo اضغط أي مفتاح لإغلاق...
pause >nul
