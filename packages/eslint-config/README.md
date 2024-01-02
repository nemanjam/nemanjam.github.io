# eslint-config-custom

This set-up follows the guidance of the [official turbo repo docs](https://turbo.build/repo/docs/handbook/linting/eslint) as well as the [Astro eslint plugin](https://github.com/ota-meshi/eslint-plugin-astro) used in the [Astro docs](https://github.com/withastro/docs/blob/main/.eslintrc.js).

### Note

Let it be like this for now, it just exports `eslintrc.js` (`base.js`) with `package.json.files` and thats it. Otherwise `eslint .` path and options need to be forwarded.

### Note 2

Done, same as `prettier-config`. Must have both `main, bin` and `files` to export `base.js` `.eslintrc.js`.`
