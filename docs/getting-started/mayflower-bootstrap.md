# Mayflower Bootstrap

`mayflower-bootstrap` is a Mayflower \(Commonwealth design system\) inspired Bootstrap theme. This project is to offer a way to quickly and easily "Mayflowerize" Commonwealth digital products that are currently styled using Bootstrap 4.

{% hint style="info" %}
[**Mayflower Boostrap github repo**](https://github.com/massgov/mayflower-bootstrap)
{% endhint %}

{% hint style="info" %}
[**Mayflower Boostrap live examples**](https://massgov.github.io/mayflower-bootstrap/)
{% endhint %}

## Implementation

1. Copy and add the `css/` and `assets/` folders into your project folder.
2. Link to compiled and minified stylesheet `mayflower-bootstrap.min.css` from `css/` in the HTML `<head>`

   e.g. `<link rel="stylesheet" href="css/mayflower-bootstrap.min.css">`

3. Paste the following scripts before the closing body tag `</body>`

   ```text
   <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossorigin="anonymous"></script>
   <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossorigin="anonymous"></script>
   ```

## Development

### Prerequisites

* This works on Windows, macOS and Linux.
* Node Package Manager and Gulp are required. Make sure you can run `gulp -v` and `npm -v`.
* You can get Node at [nodejs.org](https://nodejs.org), then install gulp using `npm install gulp-cli -g`

### Getting started

1. Clone this repo
2. Run `npm install`
3. Run `gulp` to start building and watching any scss and html changes
4. Navigate to `localhost:6060` and see the live changes
5. Add any Bootstrap Sass variables into `scss/_custom-variables.scss` \(Boostrap [reference](https://github.com/twbs/bootstrap/blob/v4-dev/scss/_variables.scss)\)
6. Add any custom styles into `scss/_custom-styles.scss`. You can use Bootstrap's [mixins](https://github.com/twbs/bootstrap/tree/v4-dev/scss/mixins) here.

### Deployment

1. Make a pull request into `master` branch
2. Merge in changes
3. Checkout [https://massgov.github.io/mayflower-bootstrap/](https://massgov.github.io/mayflower-bootstrap/)

## Acknowledgments

This project was bootstrapped with [HackerThemes](https://hackerthemes.com).

