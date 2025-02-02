@echo off

rem command line arguments
SET CONFIGURATION_PATH=%1
SET SAMPLE_DATABASE_PATH=%2

IF "%CONFIGURATION_PATH%"=="" SET CONFIGURATION_PATH="..\config\sample-databases\DefaultConfiguration"
echo "Configuration path=%CONFIGURATION_PATH%"

echo Clone and build Cloudbeaver

IF EXIST drivers rmdir /S /Q drivers
IF EXIST cloudbeaver rmdir /S /Q cloudbeaver
mkdir cloudbeaver
mkdir cloudbeaver\server
mkdir cloudbeaver\conf
mkdir cloudbeaver\workspace
mkdir cloudbeaver\web

echo Pull cloudbeaver platform

cd ..\..
rem IF NOT EXIST react-data-grid git clone https://github.com/dbeaver/react-data-grid.git

echo Pull dbeaver platform

IF NOT EXIST dbeaver git clone https://github.com/dbeaver/dbeaver.git
cd cloudbeaver\deploy

echo Build cloudbeaver server

cd ..\server\product\aggregate
call mvn clean verify -Dheadless-platform

cd ..\..\..\deploy

echo Copy server packages

xcopy /E /Q ..\server\product\web-server\target\products\io.cloudbeaver.product\all\all\all\* cloudbeaver\server >NUL
copy scripts\* cloudbeaver >NUL
mkdir cloudbeaver\samples

IF NOT "%SAMPLE_DATABASE_PATH%"=="" (
    mkdir cloudbeaver\samples\db
    xcopy /E /Q %SAMPLE_DATABASE_PATH% cloudbeaver\samples\db >NUL
)
copy ..\config\core\* cloudbeaver\conf >NUL
copy %CONFIGURATION_PATH%\GlobalConfiguration\.dbeaver\data-sources.json cloudbeaver\conf\initial-data-sources.conf >NUL
copy %CONFIGURATION_PATH%\*.conf cloudbeaver\conf >NUL

move drivers cloudbeaver >NUL

echo Build static content

cd ..\

rem cd ..\react-data-grid
rem call npm i
rem call npm run build
rem call npm run build:types
rem call yarn link

cd ..\cloudbeaver\webapp

call yarn
rem call yarn link "react-data-grid"
call lerna bootstrap
call lerna run build --no-bail --stream --scope=@cloudbeaver/product-default &::-- -- --env source-map

cd ..\deploy

echo Copy static content

xcopy /E /Q ..\webapp\packages\product-default\lib cloudbeaver\web >NUL

echo Cloudbeaver is ready. Run run-server.bat in cloudbeaver folder to start the server.

pause
