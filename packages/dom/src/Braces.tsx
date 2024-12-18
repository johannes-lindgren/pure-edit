import { SxProps } from '@mui/system'
import { FunctionComponent } from 'react'
import { Box, Theme, styled } from '@mui/material'
import * as React from 'react'

const BracesRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  transform: translateX(-50%);
  width: 2em;

  & > * {
    flex: 1;
    width: 100%;
  }
`

const Braces1 = styled('div')`
  border-left: 2px solid currentColor;
  border-top-left-radius: 12px;
  margin-left: 100%;
`
const Braces2 = styled('div')`
  border-right: 2px solid currentColor;
  border-bottom-right-radius: 12px;
`
const Braces3 = styled('div')`
  border-right: 2px solid currentColor;
  border-top-right-radius: 12px;
`
const Braces4 = styled('div')`
  border-left: 2px solid currentColor;
  border-bottom-left-radius: 12px;
  margin-left: 100%;
`

export const Braces: FunctionComponent<{
  sx?: SxProps<Theme>
}> = (props) => {
  return (
    <BracesRoot sx={props.sx}>
      <Braces1 />
      <Braces2 />
      <Braces3 />
      <Braces4 />
    </BracesRoot>
  )
}
