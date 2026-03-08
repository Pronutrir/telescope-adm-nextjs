import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AlterarSenhaForm } from './AlterarSenhaForm'

const mockRouterPush = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockRouterPush }) }))

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, theme: 'light', toggleTheme: jest.fn(), setTheme: jest.fn() }),
}))
jest.mock('@/contexts/LayoutContext', () => ({
  useLayout: () => ({ isMobile: false, sidebarOpen: true, mounted: true }),
}))

const mockShowSuccess = jest.fn()
const mockShowError = jest.fn()
jest.mock('@/contexts/NotificationContext', () => ({
  useNotifications: () => ({ showSuccess: mockShowSuccess, showError: mockShowError }),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

const mockSessionStorage: Record<string, string> = {}
Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: (key: string) => mockSessionStorage[key] ?? null,
    setItem: (key: string, val: string) => { mockSessionStorage[key] = val },
    removeItem: (key: string) => { delete mockSessionStorage[key] },
  },
  writable: true,
})

describe('AlterarSenhaForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    delete mockSessionStorage['temp_password']
  })

  it('renderiza título obrigatório', () => {
    render(<AlterarSenhaForm />)
    expect(screen.getByText('Alteração de Senha Obrigatória')).toBeInTheDocument()
  })

  it('exibe campo de senha atual quando não há savedPassword', () => {
    render(<AlterarSenhaForm />)
    expect(screen.getByLabelText('Senha Atual')).toBeInTheDocument()
  })

  it('oculta campo de senha atual quando há savedPassword no sessionStorage', () => {
    mockSessionStorage['temp_password'] = 'senhaTemp123!'
    render(<AlterarSenhaForm />)
    expect(screen.queryByLabelText('Senha Atual')).not.toBeInTheDocument()
  })

  it('mostra erro quando submete sem senha atual (sem savedPassword)', async () => {
    render(<AlterarSenhaForm />)
    fireEvent.click(screen.getByRole('button', { name: /alterar senha/i }))
    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'Por favor, digite sua senha atual.',
        expect.any(Object)
      )
    })
  })

  it('toggle de visibilidade funciona nos campos', () => {
    render(<AlterarSenhaForm />)
    const toggleBtn = screen.getAllByRole('button', { name: /mostrar senha/i })[0]
    fireEvent.click(toggleBtn)
    expect(screen.getAllByRole('button', { name: /ocultar senha/i })[0]).toBeInTheDocument()
  })

  it('exibe barra de força ao digitar nova senha', async () => {
    mockSessionStorage['temp_password'] = 'senhaTemp123!'
    render(<AlterarSenhaForm />)
    const newPwdInput = screen.getByLabelText('Nova Senha')
    fireEvent.change(newPwdInput, { target: { value: 'Teste@1' } })
    await waitFor(() => {
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  it('chama API e redireciona em caso de sucesso', async () => {
    mockSessionStorage['temp_password'] = 'senhaTemp123!'
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<AlterarSenhaForm />)
    fireEvent.change(screen.getByLabelText('Nova Senha'), { target: { value: 'NovaSenh@1' } })
    fireEvent.change(screen.getByLabelText('Confirmar Nova Senha'), { target: { value: 'NovaSenh@1' } })
    fireEvent.click(screen.getByRole('button', { name: /alterar senha/i }))

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalled()
    })
  })
})
