const {exec} = require('child_process')

module.exports = {
  variables: [
    { name: "parentCompDir" },
    { name: "componentname", description: "filename and foldername in snakecase, example: 'configure-search-dropdown', 'about-modal'" },
    { name: "ComponentName"
    , default: ({componentname}) => capitallize(componentname)
    },
  ],
  outDir: "./src/@app/routes",
  onComplete: (vars, renderedfiles) => {
    const s = vars["componentname"]
    const c = vars.ComponentName
    console.log(
    `
Import:
    import { ${c}Component } from './${s}/${s}.component';

Add to parent module:
    @NgModule({
      imports: [ ... ],
      declarations: [ ${c}Component ]
    })
    class ParentModule {}

or for shared modules
    @NgModule({
      imports: [ ... ],
      declarations: [ ${c}Component, ],
      exports: [ ${c}Component, ]
    })
    class SharedModule {}

Now use this component by including its tag in your template files:
    <pw-${s}></pw-${s}>
`)

    // find component to open in vscode
    const component = renderedfiles.find(({filename}) => /\.component\.ts$/.test(filename))
    const componentFilepath = component.baseDir + '/' + component.filename

    exec(`code "${componentFilepath}"`)
  }
}

function capitallize(str) {
  return String(str)
    .split('-')
    .map(a => a[0].toUpperCase() + a.slice(1))
    .join('')
}
