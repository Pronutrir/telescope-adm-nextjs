import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ServerLoginForm } from './ServerLoginForm'

const mockNotify = { error: jest.fn(), success: jest.fn(), warning: jest.fn() }
const mockRouter = { push: jest.fn() }

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}))
jest.mock('@/contexts/LayoutContext', () => ({
  useLayout: () => ({ isMobile: false, mounted: true }),
}))
jest.mock('@/contexts/NotificationContext', () => ({
  useNotify: () => mockNotify,
}))
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

describe('ServerLoginForm', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renderiza campos de usuário e senha', () => {
    render(<ServerLoginForm />)
    expect(screen.getByPlaceholderText('Usuário ou Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar no sistema/i })).toBeInTheDocument()
  })

  it('exibe erros de validação ao submeter vazio', async () => {
    render(<ServerLoginForm />)
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))
    await waitFor(() => {
      expect(screen.getByText('Usuário é obrigatório!')).toBeInTheDocument()
      expect(screen.getByText('A senha é obrigatória!')).toBeInTheDocument()
    })
  })

  it('aplica classes dark mode no card', () => {
    jest.requireMock('@/contexts/ThemeContext').useTheme = () => ({ isDark: true })
    render(<ServerLoginForm />)
    const input = screen.getByPlaceholderText('Usuário ou Email')
    expect(input.className).toContain('text-slate-100')
  })

  it('desabilita botão quando formulário inválido', () => {
    render(<ServerLoginForm />)
    expect(screen.getByRole('button', { name: /entrar/i })).toBeDisabled()
  })

  it('exibe mensagem de carregamento durante submit', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, preferredHomePage: '/admin/dashboard' }),
    })

    render(<ServerLoginForm />)
    fireEvent.change(screen.getByPlaceholderText('Usuário ou Email'), { target: { value: 'usuario' } })
    fireEvent.change(screen.getByPlaceholderText('Senha'), { target: { value: 'senha123' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar no sistema/i }))

    await waitFor(() => {
      expect(screen.queryByText('Autenticando...')).toBeInTheDocument()
    })
  })
})
