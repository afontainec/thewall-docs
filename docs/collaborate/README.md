
Welcome to **TheWall Collaborate**

This section is intended to help you (or anyone) to become part of the TheWall Community! TheWall is a beginners friendly environment, if you have any doubt just contact me: [antonio.fontainecorrea@gmail.com](antonio.fontainecorrea@gmail.com).

## Overview


The [TheWall Repo](https://github.com/afontainec/thewall) is hosted in github.

* [Github Repository](https://github.com/afontainec/thewall)
* [Issues](https://github.com/afontainec/thewall/issues)
* [Pull Requests](https://github.com/afontainec/thewall/pulls)

Pull Request are welcome. For major changes, please open an issue first to discuss what you would like to change. Please make sure to update tests appropriately.

If you want to help but don't know how, contact me [antonio.fontainecorrea@gmail.com](antonio.fontainecorrea@gmail.com) and we will discuss which functionalities of the backlog you can help with.


## Continuous Integration

  For any pull request to be approved will require for the test to pass with a minimum coverage. Moreover the linter will be checked. Linter warnings are allowed but non-preferred.

  To locally check this run:

  ```
  npm run test
  npm run coverage
  npm run linter
  ```

## commit

For commits, we follow [this guide](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits).

But in a nutshell every commit must be as follows:

```
git commit -m 'type(context): description
```

or

```
git commit -m 'type(context/subcontext): description
```

*Type* should answer why are you committing. Choose one of the following:

* **feat:** A new feature
* **fix:** A bug fix
* **docs:** Documentation only changes
* **style:** Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc)
* **refactor:** A code change that neither fixes a bug nor adds a feature
* **perf:** A code change that improves performance
* **test:** Adding missing or correcting existing tests
* **chore:** Changes to the build process or auxiliary tools and libraries such as documentation generation

*Context*, or also called scope is what you are working on? In which component, functionality or subdivision of the app are you working on. Optionally you can add a *subcontext*, for giving a more detailed information.

*Description* A description of what you are working on, it should be short. All together the commit shouldn't have more than 100 characters.

## Documentation

The documentation lives in [this repo](https://github.com/afontainec/thewall-docs). For every functionality you do develop the corresponding documentation must be added, otherwise the pull request will not be approved. Actually this same text is written in that repo! It is built with vuepress.

