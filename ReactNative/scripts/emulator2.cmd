<!-- :
@echo off && mode 050,03 && title <nul && title .\%~nx0 && for /f ^tokens^=* %%i in ('
%__APPDIR__%wScript.exe "%~dpnx0?.wsf" @pixel2xl " -no-boot-anim -memory 4096"^& cls ') do exit /b 2>nul >nul
--> <job> <script language = "vbscript"> Set WshShell =CreateObject( "WScript.Shell" )
WshShell.Run chr(34)&"%userprofile%\AppData\Local\Android\Sdk\emulator\emulator.exe"&_
Chr(34)&WScript.Arguments(0)&Chr(34), 0, False: Set WshShell = Nothing </script></job>