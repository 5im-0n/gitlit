#/bin/bash
rm -rf dist
mkdir dist
node_modules/.bin/electron-packager ./app/ gitlit --all --out dist/
