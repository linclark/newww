### Copyright 2013 the Obvious Corporation

# LESS Coding Guidelines

The Obvious Corporation uses [LESS](http://lesscss.org/) as its CSS preprocessor. It's helpful to become familiar with its dynamic behavior before reading these guidelines.

## Naming Conventions

Classes and IDs are lowercase with words separated by a dash:

**Right:**
```css
.user-profile {}
.post-header {}
#top-navigation {}
```

**Wrong:**
```css
.userProfile {}
.postheader {}
#top_navigation {}
```

Image file names are lowercase with words separated by a dash:

**Right:**
```
icon-home.png
```

**Wrong:**
```
iconHome.png
icon_home.png
iconhome.png
```

Image file names are prefixed with their usage.

**Right:**
```
icon-home.png
bg-container.jpg
bg-home.jpg
sprite-top-navigation.png
```

**Wrong:**
```
home-icon.png
container-background.jpg
bg.jpg
top-navigation.png
```

## IDs vs. Classes

You should almost never need to use IDs. Broken behavior due to ID collisions are hard to track down and annoying.

## Color Units

When implementing feature styles, you should only be using color variables provided by colors.less.

When adding a color variable to colors.less, using RGB and RGBA color units are preferred over hex, named, HSL, or HSLA values.

**Right:**
```css
rgb(50, 50, 50);
rgba(50, 50, 50, 0.2);
```

**Wrong:**
```css
#FFF;
#FFFFFF;
white;
hsl(120, 100%, 50%);
hsla(120, 100%, 50%, 1);
```

## z-index scale

Please use the z-index scale defined in z-index.less. `@z-index-1 - @z-index-9` are provided. @z-index-9 is the `kill -9` of our z-index scale and really should never be used.

## Font Weight

With the additional support of web fonts `font-weight` plays a more important role than it once did. Different font weights will render typefaces specifically created for that weight, unlike the old days where `bold` could be just an algorithm to fatten a typeface. Obvious uses the numerical value of `font-weight` to enable the best representation of a typeface. The following table is a guide:

Raw font weights should not be specified. Instead, use the appropriate font mixin: `.wf-sans-i7, .wf-sans-n7, etc.`

The suffix defines the weight and style:

```CSS
n = normal
i = italic
4 = normal font-weight
7 = bold font-weight
```

Refer to type.less for type size, letter-spacing, and line height. Raw sizes, spaces, and line heights should be avoided outside of type.less.


```CSS
ex:

@type-micro
@type-smallest
@type-smaller
@type-small
@type-base
@type-large
@type-larger
@type-largest
@type-jumbo
```

See [Mozilla Developer Network — font-weight](https://developer.mozilla.org/en/CSS/font-weight) for further reading.

## Componentizing

Always look to abstract components. Medium has a very strong, very consistent style and the reuse of components across designs helps to improve this consistency at an implementation level.

A name like `.homepage-nav` limits its use. Instead think about writing styles in such a way that they can be reused in other parts of the app. Instead of `.homepage-nav`, try instead `.nav` or `.nav-bar`. Ask yourself if this component could be reused in another context (chances are it could!).

Components should belong to their own less file. For example, all general button definitions should belong in buttons.less.

## Name-spacing

Name-spacing is great! But it should be done at a component level – never at a page level.

Also, namespacing should be made at a descriptive, functional level. Not at a page location level. For example, `.profile-header` could become `.header-hero-unit`.

**Wrong:**

```css
.nav,
.home-nav,
.profile-nav,
```

**Right:**

```css
.nav,
.nav-bar,
.nav-list
```

## Style Scoping

Medium pages should largely be reusing the general component level styles defined above. Page level name-spaces however can be helpful for overriding generic components in very specific contexts.

Page level overrides should be minimal and under a single page level class nest.

```CSS
.home-page {
  .nav {
    margin-top: 10px;
  }
}
```

## Nesting

Don't nest. Ever.

Nesting makes it harder to tell at a glance where css selector optimizations can be made.

**Wrong:**

```css
.list-btn {
  .list-btn-inner {
    .btn {
      background: red;
    }
    .btn:hover {
      .opacity(.4);
    }
  }
}
```

**Right:**

```CSS
.list-btn .btn-inner {
  background: red;
}
.list-btn .btn-inner:hover {
  .opacity(.4);
}
```

## Spacing

CSS rules should be comma seperated but live on new lines:

**Right:**
```css
.content,
.content-edit {
  …
}
```

**Wrong:**
```css
.content, .content-edit {
  …
}
```

CSS blocks should be seperated by a single new line. not two. not 0.

**Right:**
```css
.content {
  …
}
.content-edit {
  …
}
```

**Wrong:**
```css
.content {
  …
}

.content-edit {
  …
}
```

## Comments

Use Less style comments to annotate styles because they are compiled out. Use them to seperate logical groups of styles within a document. Always use the following style comment:


**Right:**

// Title of section
// --------------------------------------------------

```

**Wrong:**
```css

/* Title of section
 **********************/

```


## Quotes

Quotes are optional in CSS and LESS. Obvious chooses to use quotes as it is visually clearer that the string is not a selector or a style property.

**Right:**
```css
background-image: url("/img/you.jpg");
font-family: "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial;
```

**Wrong:**
```css
background-image: url(/img/you.jpg);
font-family: Helvetica Neue Light, Helvetica Neue, Helvetica, Arial;
```

## Performance

### Specificity

Although in the name (cascading style sheets) cascading can introduce unnecessary performance overhead for applying styles. Take the following example:

```css
ul.user-list li span a:hover { color: red; }
```


Styles are resolved during the renderer's layout pass. The selectors are resolved right to left, exiting when it has been detected the selector does not match. Therefore, in this example every a tag has to be inspected to see if it resides inside a span and a list. As you can imagine this requires a lot of DOM walking and and for large documents can cause a significant increase in the layout time. For further reading checkout: https://developers.google.com/speed/docs/best-practices/rendering#UseEfficientCSSSelectors

If we know we want to give all `a` elements inside the `.user-list` red on hover we can simplify this style to:

```css
.user-list a:hover { color: red; }
```

If we want to only style specific `a` elements inside `.user-list` we can give them a specific class:

```css
.user-list .link-primary:hover { color: red; }
```

### Mixins

Make sure to take into consideration the output of using LESS' powerful mixins. They are best used for grouping browser-specific code or as powerful ways to contain functionality. They are not a good way to add additional styles to an element as you will be sending duplicate styles across the wire.

**Wrong:**

```html
<button class="btn-secondary">Click me</button>
```

```css
.btn-primary {
  color: red;
  background: black;
  width: 120px;
  height: 60px
  border-radius: 6px
}
.btn-secondary {
  .btn-primary;
  color: green;
}
.btn-disabled {
  .btn-primary;
  color: gray;
  background: darkgray;
}
```

Generated Output:
```css
.btn-primary {
  color: red;
  background: black;
  width: 120px;
  height: 60px
  border-radius: 6px
}
.btn-secondary {
  color: red;
  background: black;
  width: 120px;
  height: 60px
  border-radius: 6px
  color: green;
}
.btn-disabled {
  color: red;
  background: black;
  width: 120px;
  height: 60px
  border-radius: 6px
  color: gray;
  background: darkgray;
}
```

**Right:**

```html
<button class="btn btn-secondary">Click me</button>
```

```css
.btn {
  width: 120px;
  height: 60px
  border-radius: 6px
}
.btn-primary {
  color: red;
  background: black;
}
.btn-disabled {
  color: gray;
  background: darkgray;
}
```

Generated Output:
```css
.btn {
  width: 120px;
  height: 60px
  border-radius: 6px
}
.btn-primary {
  color: red;
  background: black;
}
.btn-disabled {
  color: gray;
  background: darkgray;
}
```

## Vendor-Prefixes

Encapsulate vendor-prefixes into reusable parameterized LESS mixins:

**Right:**

```css
.user-page-avatar {
  .transition(width .2s ease-in);
}

.transition(@transition) {
  -webkit-transition: @transition;
     -moz-transition: @transition;
      -ms-transition: @transition;
       -o-transition: @transition;
          transition: @transition;
}
```

**Wrong:**

```css
.user-page-avatar {
  -webkit-transition: width .2s ease-in;
     -moz-transition: width .2s ease-in;
      -ms-transition: width .2s ease-in;
       -o-transition: width .2s ease-in;
          transition: width .2s ease-in;
}
```
