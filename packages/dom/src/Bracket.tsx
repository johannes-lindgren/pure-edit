import { SxProps } from '@mui/system'
import * as React from 'react'
import { FunctionComponent } from 'react'
import { Box, styled, Theme } from '@mui/material'

const BracketRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  transform: translateX(-50%);

  & > * {
    flex: 1;
    width: 50%;
  }
`

const Bracket1 = styled('div')`
  border-left: 2px solid currentColor;
  border-top: 2px solid currentColor;
  border-top-left-radius: 0;
  margin-left: 100%;
`

const Bracket2 = styled('div')`
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  border-bottom-left-radius: 0;
  margin-left: 100%;
`

export const Bracket: FunctionComponent<{
  sx?: SxProps<Theme>
}> = (props) => {
  return (
    <BracketRoot sx={props.sx}>
      <Bracket1 />
      <Bracket2 />
    </BracketRoot>
  )
}
