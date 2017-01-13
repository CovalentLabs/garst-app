const {exec} = require('child_process')

module.exports = {
  variables: [
    { name: "routename", description: "filename and foldername in snakecase, example: 'configure-search', 'about'" },
    { name: "RouteName"
    , default: ({routename}) => capitallize(routename)
    },
  ],
  outDir: "./src/@app",
  onComplete: (vars, renderedfiles) => {
    const s = vars["routename"]
    const c = vars.RouteName
    console.log(
    `
    Add to routing module (@app/routes/app-routing.module.ts)

/* Feature Modules */
import { ${c}Module } from './${s}/${s}.module';

@NgModule({
  imports: [
    // Feature Routes
    ${c}Module,

    View your new route at
    http://localhost:8080/#/${s}
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
