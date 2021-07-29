git checkout master
git pull origin master
npm run docs:build
git add .
git commit -am "build docs"
npm version patch -m "chore: release version %s [skip ci]"
git push heroku master
git push --tags
git push origin master
git checkout dev
git merge master
git push origin dev