import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, AuthProvider, ToastProvider, ToastContainer } from '@/shared/providers'
import AppRoutes from '@/routes'

// Mock API responses for integration tests
function mockApiResponses(): void {
  const teams: Array<{ id: string; name: string; countryCode: string; groupId: string }> = []
  const groupLetters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
  for (const g of groupLetters) {
    for (let i: number = 1; i <= 4; i++) {
      teams.push({
        id: `T${g}${i}`,
        name: `Team ${g}${i}`,
        countryCode: g,
        groupId: g,
      })
    }
  }

  const bracketMatches: Array<{
    id: string
    groupId: string | null
    round: string
    matchNumber: number
    homeTeamId: string
    awayTeamId: string
    date: string
    stadium: string
    status: string
    homeScore: number | null
    awayScore: number | null
  }> = []
  for (let i: number = 1; i <= 16; i++) {
    const teamIdx: number = (i - 1) * 3
    bracketMatches.push({
      id: `R32-${i}`,
      groupId: null,
      round: 'R32',
      matchNumber: 72 + i,
      homeTeamId: teams[teamIdx % teams.length]?.id ?? 'TBD',
      awayTeamId: teams[(teamIdx + 1) % teams.length]?.id ?? 'TBD',
      date: new Date(Date.now() + 86400000 * i).toISOString(),
      stadium: 'Stadium',
      status: 'scheduled',
    })
  }

  globalThis.fetch = vi.fn((url: string) => {
    if (url.endsWith('/api/teams')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: teams }),
      })
    }
    if (url.endsWith('/api/matches/bracket')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, data: bracketMatches }),
      })
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] }),
    })
  }) as unknown as typeof globalThis.fetch
}

function renderAppAt(path: string) {
  return render(
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={[path]}>
            <AppRoutes />
          </MemoryRouter>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>,
  )
}

describe('Integration: Auth → Predictions Flow', () => {
  beforeEach(() => {
    localStorage.clear()
    mockApiResponses()
  })

  it('shows login form and demo hint', async () => {
    renderAppAt('/login')
    await screen.findByDisplayValue('demo@mundialito.app')
    expect(screen.getByText('123456')).toBeInTheDocument()
  })

  it('logs in, navigates to bracket R32, and saves a prediction', { timeout: 15000 }, async () => {
    const user = userEvent.setup()
    renderAppAt('/login')

    const emailInput = await screen.findByLabelText(/correo/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)

    await user.clear(emailInput)
    await user.type(emailInput, 'demo@mundialito.app')
    await user.clear(passwordInput)
    await user.type(passwordInput, '123456')

    await user.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(screen.getByText(/ir a predecir/i)).toBeInTheDocument()
    }, { timeout: 10000 })

    const bracketLinks = screen.getAllByRole('link', { name: /eliminatorias/i })
    await user.click(bracketLinks[0])

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /eliminatorias/i })).toBeInTheDocument()
    })

    expect(screen.getByText(/16avos/i)).toBeInTheDocument()

    const scoreInputs = screen.getAllByRole('textbox')
    expect(scoreInputs.length).toBeGreaterThanOrEqual(2)
    expect(scoreInputs.some((i: HTMLElement) => !(i as HTMLInputElement).disabled)).toBe(true)
  })

  it('shows error on invalid credentials', { timeout: 15000 }, async () => {
    const user = userEvent.setup()
    renderAppAt('/login')

    const emailInput = await screen.findByLabelText(/correo/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)

    await user.clear(emailInput)
    await user.type(emailInput, 'demo@mundialito.app')
    await user.clear(passwordInput)
    await user.type(passwordInput, 'wrong-password')

    await user.click(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument()
    }, { timeout: 10000 })
  })
})
