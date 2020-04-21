# Front-end Boilerplate using Sass and Gulp 4

This setup:

* Compile the SCSS files to CSS
* Autoprefix and minify the CSS file
* Concatenate the JS files
* Uglify the JS files
* Minify images and create webp copies
* Move final images, CSS and JS files to the `/dist` folder

To use webp:
```
<picture>
	<source srcset="images/img.webp" type="image/webp">
	<img src="images/img.png" alt="www.septembris.lv custom html website from scratch" loading="lazy">
</picture>
```
To start:
* Run `npm install`
* Run `gulp` to run the default Gulp task
