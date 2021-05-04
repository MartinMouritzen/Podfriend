import { createMuiTheme }	from '@material-ui/core/styles'

const theme = createMuiTheme({
	palette: {
		primary: { 500: '#0176e5' },
	},
	toggle: {
		thumbOnColor: 'yellow',
		trackOnColor: 'red'
	}
})
export default theme