/// <reference types="@vitest/browser/matchers" />
import { describe, test, expect } from 'vitest'
import { render } from 'vitest-browser-react'
import { ThemeProvider } from 'styled-components'
import { ChipList, TooltipProvider } from '@redislabsdev/redis-ui-components'
import { theme } from '@redislabsdev/redis-ui-styles'
import { page } from '@vitest/browser/context'

describe('ChipList Component', () => {
  test('renders chips correctly', async () => {
    const chips = [
      { label: "Chip text", key: "chip-1" },
      {
        label: "Another chip",
        key: "chip-2",
        disabled: true,
        tooltip: "tooltip",
      },
    ]

    render(
      <ThemeProvider theme={theme}>
        <TooltipProvider>
          <ChipList chips={chips} onRemoveItem={(item) => console.log(item)} />
        </TooltipProvider>
      </ThemeProvider>
    )

    // Check if chips are rendered using the page object
    await expect.element(page.getByText('Chip text')).toBeInTheDocument()
    await expect.element(page.getByText('Another chip')).toBeInTheDocument()
    
    // The component should have the text content we expect
    const chipTextElement = page.getByText('Chip text')
    await expect.element(chipTextElement).toBeInTheDocument()
    
    const disabledChipElement = page.getByText('Another chip')
    await expect.element(disabledChipElement).toBeInTheDocument()
  })
})
