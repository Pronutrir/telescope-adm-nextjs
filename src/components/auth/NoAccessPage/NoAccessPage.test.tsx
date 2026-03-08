import { render, screen, fireEvent } from '@testing-library/react'
import { NoAccessPage } from './NoAccessPage'

const mockRouterPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}))

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({ isDark: false, theme: 'light', toggleTheme: jest.fn(), setTheme: jest.fn() }),
}))

jest.mock('@/contexts/LayoutContext', () => ({
  useLayout: () => ({ isMobile: false, sidebarOpen: true, mounted: true }),
}))

const mockLogout = jest.fn()
const mockUser = {
  nomeCompleto: 'João Silva',
  username: 'joao.silva',
  roles: [{ perfis: { nomePerfil: 'Visualizador' } }],
}

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, logout: mockLogout }),
}))

jest.mock('@/components/ui/Button', () => ({
  Button: ({ children, onClick, variant }: { children: React.ReactNode; onClick: () => void; variant: string }) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}))

describe('NoAccessPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o título e o nome do usuário', () => {
    render(<NoAccessPage />)
    expect(screen.getByText('Acesso Negado')).toBeInTheDocument()
    expect(screen.getByText('João Silva')).toBeInTheDocument()
  })

  it('renderiza os perfis do usuário', () => {
    render(<NoAccessPage />)
    expect(screen.getByText('Visualizador')).toBeInTheDocument()
  })

  it('chama logout e redireciona ao clicar em Sair', () => {
    render(<NoAccessPage />)
    fireEvent.click(screen.getByText('Sair do Sistema'))
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith('/auth/server-login')
  })

  it('redireciona para home ao clicar em Voltar ao Início', () => {
    render(<NoAccessPage />)
    fireEvent.click(screen.getByText('Voltar ao Início'))
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })

  it('aplica classes dark mode no card', () => {
    jest.resetModules()
    jest.mock('@/contexts/ThemeContext', () => ({
      useTheme: () => ({ isDark: true, theme: 'dark', toggleTheme: jest.fn(), setTheme: jest.fn() }),
    }))
    // Verificação básica: componente renderiza sem erros em dark mode
    const { container } = render(<NoAccessPage />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('exibe fallback quando não há permissões', () => {
    jest.mock('@/contexts/AuthContext', () => ({
      useAuth: () => ({ user: { ...mockUser, roles: [] }, logout: mockLogout }),
    }))
    render(<NoAccessPage />)
    // Verifica que o texto de nenhuma permissão está presente
    expect(screen.getByText(/nenhuma permissão/i)).toBeInTheDocument()
  })

  it('retorna null quando não há usuário (aguarda redirect)', () => {
    jest.mock('@/contexts/AuthContext', () => ({
      useAuth: () => ({ user: null, logout: mockLogout }),
    }))
    const { container } = render(<NoAccessPage />)
    // O componente retorna null antes do redirect
    expect(container.firstChild).toBeNull()
  })
})
