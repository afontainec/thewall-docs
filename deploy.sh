#!/usr/bin/env sh

# abort on errors
set -e

git checkout master
git pull origin master
npm run docs:build


# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'thewall.accionet.net' > CNAME

git init
git add -A
git commit -m 'chore: deploy'

git push -f https://github.com/afontainec/thewall-docs.git master:gh-pages

cd ../../../
git add .
git commit -am "chore: build docs"
npm version patch -m "chore: release version %s [skip ci]"
git push --tags
git push origin master
git checkout dev
git merge master
git push origin dev