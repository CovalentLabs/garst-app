const {exec} = require('child_process')

module.exports = {
  variables: [
    { name: "itemtype"
    , description: 'Snakecase component filename. Examples: text, lock-update, etc' },
    { name: "ItemType"
    , default: ({itemtype}) => capitallize(itemtype)
    },
  ],
  outDir: "./src/@app/routes/lobby/lobby-messages/item-group/item",
  onComplete: (vars, renderedfiles) => {
    // renderedfiles: { baseDir: string, filename: string, contents: string }[]
    const s = vars["itemtype"]
    const c = vars.ItemType

    console.log(`
Import:
    import { Item${c}Component } from './item-${s}/item-${s}.component';

Add to items component:
    export const ITEM_COMPONENTS = [
      ${c}Component,
    ]

Now use this component by including its tag in your template files:
    <pw-item-${s}></pw-item-${s}>
`)
  }
}

function capitallize(str) {
  return String(str)
    .split('-')
    .map(a => a[0].toUpperCase() + a.slice(1))
    .join('')
}
