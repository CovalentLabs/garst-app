
export const VITRE_COLUMNS = 12
export const VITRE_ROWS = 12

export const AMBER_COLORS =
`50 #FFF8E1
100 #FFECB3
200 #FFE082
300 #FFD54F
400 #FFCA28
500 #FFC107
600 #FFB300
700 #FFA000
800 #FF8F00
900 #FF6F00`
.split(/\n/g)
.map(a => a.split(/\s+/)[1])

export const AMBER_COLORS_LEN = AMBER_COLORS.length

type ViewType = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// Borrowed from _custom.css
export const GRID_BREAKPOINTS =
`  xs: 0,
  sm: 340px,
  md: 576px,
  lg: 768px,
  xl: 992px`
.replace(/\s+/g, '')
.split(',')
.map(function (b): [ViewType, number] {
  let [name, px] = b.split(':')
  return [<ViewType> name, parseFloat(px)]
})
.reverse()
