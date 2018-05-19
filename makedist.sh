#/bin/bash
rm -rf dist
mkdir dist
node_modules/.bin/electron-packager ./app/ gitlit --all --out dist/

cd dist

for d in *; do
  if [[ -d "$d" ]]; then
    tar czf "$d.tgz" "$d"
    rm -rf "$d"
  fi
done

cd ..
