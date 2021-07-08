### Description
This Pattern shows an overlay of expandable table of contents sections.

### Usage Guidelines
* The overlay component will display with any children passed to it as such:
~~~
<Overlay>
    Children go here...
</Overlay>
~~~
* The title prop should be an arrow function that return any valid DOM elements or components.

### Variables
~~~
{
  // The overlay container id.
  id: {
    type: text / required
  },
  // A function that returns a link content or text to display.
  title: {
    type: coloredHeading / required
  }
}
~~~
