const {exec} = require('child_process')

/**
 * This template creates a starter ngcomponent template
 */
module.exports = {
  variables: [
    { name: "compParentDirVar"
    , default: () => "parentDir"
    , description: "Folder var for parent module of template's target. Recommended to use default. Must end with `Dir`"  },
    { name: "templatename"
    , description: "filename and foldername in snakecase, example: 'ngdropdown', 'ngmodal', 'ngbutton', etc"
    },
    { name: "CompNameVar"
    , description: "Variable name used (as in: ${ComponentName}Component) example: 'DropdownName', 'ModalName', 'ButtonName', etc"
    },
    { name: "compnamevar"
    , description: "Variable name used for folder variable identifier (as in: {componentname}.component.html"
    , default: ({CompNameVar}) => CompNameVar.toLowerCase()
    },
  ],
  onComplete: (vars, renderedfiles) => {
    const s = vars.templatename

    console.log(`Use your template with
    undergen ${s} ${vars.CompNameVar}:Something
    `)
  }
}
