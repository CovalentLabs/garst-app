const {exec} = require('child_process')

module.exports = {
  variables: [
    { name: "<%=compnamevar%>"
    , description: 'Snakecase component filename. Examples: CtaButton, AlertMessage, FlashDismissable, etc' },
    { name: "<%=CompNameVar%>"
    , default: ({<%=compnamevar%>}) => capitallize(<%=compnamevar%>)
    },
  ],
  outDir: "./src/@app",
  onComplete: (vars, renderedfiles) => {
    // renderedfiles: { baseDir: string, filename: string, contents: string }[]
    const s = vars["<%=compnamevar%>"]
    const c = vars.<%=CompNameVar%>

    console.log(`
Import:
    import { ${c}Component } from './${s}/${s}.component';

Add to parent module:
    @NgModule({
      imports: [ ... ],
      declarations: [ ${c}Component ]
    })
    class ParentModule {}

OR, for shared modules add to both declarations and exports:
    @NgModule({
      imports: [ ... ],
      declarations: [ ${c}Component, ],
      exports: [ ${c}Component, ]
    })
    class SharedModule {}

Now use this component by including its tag in your template files:
    <pw-${s}></pw-${s}>
`)
  }
}

function capitallize(str) {
  return String(str)
    .split('-')
    .map(a => a[0].toUpperCase() + a.slice(1))
    .join('')
}
