import * as React from 'react'
import { FunctionComponent } from 'react'
import { SxProps } from '@mui/system'
import { Box, Theme } from '@mui/material'
import { Bracket } from './Bracket.tsx'

export const BracketContainer: FunctionComponent<{
  children?: React.ReactNode
  BracketComponent?: React.ComponentType<{ sx?: SxProps<Theme> }>
}> = (props) => {
  const { children, BracketComponent = Bracket } = props
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 0,
      }}
    >
      <BracketComponent
        sx={{
          color: 'divider',
          width: (theme) => theme.spacing(2),
        }}
      />
      <Box sx={{ flex: 1, py: 1 }}>{children}</Box>
    </Box>
  )
}
