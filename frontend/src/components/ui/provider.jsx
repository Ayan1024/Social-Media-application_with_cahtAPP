'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

// You can extend the default theme if needed
const theme = extendTheme({})

export function Provider(props) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
