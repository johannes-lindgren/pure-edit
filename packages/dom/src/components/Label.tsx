import { styled } from '@mui/material'
import { useFormControlContext } from '@mui/base'
import React from 'react'
import clsx from 'clsx'
import { Typography } from '@mui/material'

const Lab = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
}))

export const Label = styled(
  ({
    children,
    className,
  }: {
    children?: React.ReactNode
    className?: string
  }) => {
    const formControlContext = useFormControlContext()
    const [dirty, setDirty] = React.useState(false)

    React.useEffect(() => {
      if (formControlContext?.filled) {
        setDirty(true)
      }
    }, [formControlContext])

    if (formControlContext === undefined) {
      return <Lab>{children}</Lab>
    }

    const { error, required, filled } = formControlContext
    const showRequiredError = dirty && required && !filled

    return (
      <Lab
        className={clsx(className, error || showRequiredError ? 'invalid' : '')}
      >
        {children}
        {required ? ' *' : ''}
      </Lab>
    )
  },
)`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;

  &.invalid {
    color: red;
  }
`
