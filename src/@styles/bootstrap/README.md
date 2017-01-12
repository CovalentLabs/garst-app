## Bootstrap 4

We use bootstrap for general styling, helpers, and component styling.

Import these variables into your components scss file by using:

```css
@import 'bootstrap/custom';

```

**Files**:

- `./_custom.scss`: This is the custom.scss file which we use to customize
  Bootstrap, and we should import this file whereever we need to leverage
  these variables in Angular component level imports.
- `./_typography.scss`: This specifies all typography of our App.
- `./_colors.scss`: This specifies main colors of our App.
