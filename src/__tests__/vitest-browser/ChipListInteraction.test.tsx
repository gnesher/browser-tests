/// <reference types="@vitest/browser/matchers" />
import { describe, test, expect, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { ThemeProvider } from 'styled-components'
import { ChipList, TooltipProvider } from '@redislabsdev/redis-ui-components'
import { theme } from '@redislabsdev/redis-ui-styles'
import { page } from '@vitest/browser/context'

describe('ChipList Interaction', () => {
  test('calls onRemoveItem when remove button is clicked', async () => {
    const chips = [
      { label: "Chip text", key: "chip-1" }
    ]
    
    const onRemoveItem = vi.fn()

    render(
      <ThemeProvider theme={theme}>
        <TooltipProvider>
          <ChipList chips={chips} onRemoveItem={onRemoveItem} />
        </TooltipProvider>
      </ThemeProvider>
    )

    // Find the chip text to verify it's rendered
    await expect.element(page.getByText('Chip text')).toBeInTheDocument()
    
    // Find and click the button by looking for a button element
    const button = page.getByRole('button')
    await button.click()
    
    // Verify that onRemoveItem was called
    expect(onRemoveItem).toHaveBeenCalledTimes(1)
    expect(onRemoveItem).toHaveBeenCalledWith('chip-1')
  })

  test('disabled chips are rendered correctly', async () => {
    const chips = [
      { 
        label: "Disabled chip", 
        key: "chip-disabled", 
        disabled: true 
      }
    ]
    
    render(
      <ThemeProvider theme={theme}>
        <TooltipProvider>
          <ChipList chips={chips} onRemoveItem={() => {}} />
        </TooltipProvider>
      </ThemeProvider>
    )

    // Find the disabled chip text to verify it's rendered
    await expect.element(page.getByText('Disabled chip')).toBeInTheDocument()
    
    // The disabled chip should be in the document
    const disabledChipElement = page.getByText('Disabled chip')
    await expect.element(disabledChipElement).toBeInTheDocument()
  })
})
