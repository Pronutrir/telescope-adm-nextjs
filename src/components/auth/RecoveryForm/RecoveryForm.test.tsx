import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RecoveryForm } from './RecoveryForm'

const mockUpdatePassword = jest.fn()
const mockRouter = { push: jest.fn() }

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}))
jest.mock('@/contexts/LayoutContext', () => ({
  useLayout: () => ({ isMobile: false, mounted: true }),
}))
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    updatePassword: mockUpdatePassword,
    isLoading: false,
    notification: { message: '', type: 'info' },
    clearNotification: jest.fn(),
  }),
}))
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => ({ get: () => '' }),
}))

describe('RecoveryForm', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renderiza os campos corretamente', () => {
    render(<RecoveryForm />)
    expect(screen.getByPlaceholderText('Usuário')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Nova senha')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirmar nova senha')).toBeInTheDocument()
  })

  it('exibe erros de validação ao submeter vazio', async () => {
    render(<RecoveryForm />)
    fireEvent.click(screen.getByRole('button', { name: /alterar senha/i }))
    await waitFor(() => {
      expect(screen.getByText('Usuário é obrigatório!')).toBeInTheDocument()
      expect(screen.getByText('Nova senha é obrigatória!')).toBeInTheDocument()
    })
  })

  it('exibe erro quando senhas não coincidem', async () => {
    render(<RecoveryForm />)
    fireEvent.change(screen.getByPlaceholderText('Nova senha'), { target: { value: 'Senha123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmar nova senha'), { target: { value: 'Diferente1' } })
    fireEvent.blur(screen.getByPlaceholderText('Confirmar nova senha'))
    await waitFor(() => {
      expect(screen.getByText('As senhas devem ser iguais!')).toBeInTheDocument()
    })
  })

  it('navega para login ao clicar em Voltar', () => {
    render(<RecoveryForm />)
    fireEvent.click(screen.getByRole('button', { name: /voltar para a página de login/i }))
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/server-login')
  })

  it('aplica classes dark mode', () => {
    jest.requireMock('@/contexts/ThemeContext').useTheme = () => ({ isDark: true })
    const { container } = render(<RecoveryForm />)
    expect(container.querySelector('.bg-white\\/10')).toBeInTheDocument()
  })

  it('exibe requisitos de senha', () => {
    render(<RecoveryForm />)
    expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument()
    expect(screen.getByText('Pelo menos 1 número')).toBeInTheDocument()
  })
})
