import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightMode from '@mui/icons-material/LightMode'
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import { Box } from '@mui/material'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()

  const handleChange = (event) => {
    const selectMode = event.target.value
    setMode(selectMode)
  }

  return (
    <FormControl size="small" sx={{ minWidth: '60px' }}>
      <InputLabel
        id="label-dark-light-mode"
        sx={{
          color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
          '&.Mui-focused': { color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000' }
        }}
      >
        Mode
      </InputLabel>
      <Select
        labelId="label-dark-light-mode"
        id="dark-light-mode"
        value={mode}
        label="Chế độ"
        onChange={handleChange}
        sx={{
          color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
          '.MuiOutlinedInput-notchedOutline': { borderColor: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000' },
          '.MuiSvgIcon-root': { color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000' }
        }}
      >
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems:'center', gap:'1' }}>
            <LightMode fontSize='small' />
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems:'center', gap:'1' }}>
            <DarkModeOutlined fontSize='small' />
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display:'flex', alignItems:'center', gap:'1' }}>
            <SettingsBrightnessIcon fontSize='small'/>
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ModeSelect