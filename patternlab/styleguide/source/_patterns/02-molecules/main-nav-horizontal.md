### Description
The main navigation for the site.

### Status
* Stable as of 5.0.0

### JavaScript Used
* Main Nav (js/modules/mainNavHorizontal.js)

### Variables
~~~
mainNav: [{
  href:
    type: url/required
  text:
    type: string/required
  active:
    type: boolean
  subNav:[{
    href:
      type: url/required
    text:
      type: string/required
  }]
}]
~~~
