/**
 * 🧪 TESTES UNITÁRIOS - Página de Login Server-Side
 * 
 * Este arquivo testa o componente ServerSideLoginPage
 * 
 * CONCEITOS IMPORTANTES:
 * 
 * 1. describe() - Agrupa testes relacionados
 * 2. it() ou test() - Define um teste específico
 * 3. expect() - Verifica se algo é verdadeiro
 * 4. render() - Renderiza o componente para teste
 * 5. screen - Permite buscar elementos na tela
 * 6. fireEvent - Simula interações do usuário
 * 7. waitFor - Espera por mudanças assíncronas
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import ServerSideLoginPage from '../page'

// ============================================
// 🎭 MOCKS (Simulações)
// ============================================
// Mocks são "versões falsas" de dependências externas
// Usamos para isolar o componente e controlar o comportamento

// Mock do Next.js Router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

// Mock do Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // Remover props específicas do Next.js Image que não são HTML válidas
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { fill, priority, quality, placeholder, loading, ...htmlProps } = props
        // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
        return <img {...htmlProps} data-testid="next-image" />
    },
}))

// Mock do Context de Notificações
const mockNotify = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
}

jest.mock('@/contexts/NotificationContext', () => ({
    useNotify: () => mockNotify,
}))

// Mock do fetch global (para simular chamadas de API)
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

// ============================================
// 📝 GRUPO DE TESTES: Renderização
// ============================================
describe('ServerSideLoginPage - Renderização', () => {
    // beforeEach executa ANTES de cada teste
    beforeEach(() => {
        // Limpar todos os mocks antes de cada teste
        jest.clearAllMocks()

            // Configurar o mock do router
            ; (useRouter as jest.Mock).mockReturnValue({
                push: jest.fn(),
                replace: jest.fn(),
                back: jest.fn(),
            })
    })

    /**
     * ✅ TESTE 1: Verificar se os elementos principais aparecem na tela
     * 
     * O QUE TESTAR:
     * - Título "TELESCOPE" está visível?
     * - Campos de usuário e senha existem?
     * - Botão de login está presente?
     */
    it('deve renderizar o formulário de login com todos os elementos', () => {
        // 🔹 ARRANGE (Preparar)
        // Renderizar o componente
        render(<ServerSideLoginPage />)

        // 🔹 ACT (Agir)
        // Neste caso, não precisamos de ação, apenas verificar se renderizou

        // 🔹 ASSERT (Verificar)
        // Verificar se o título está na tela
        const title = screen.getByText('TELESCOPE')
        expect(title).toBeInTheDocument()

        // Verificar se o campo de usuário existe (pelo placeholder)
        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        expect(userInput).toBeInTheDocument()

        // Verificar se o campo de senha existe
        const passwordInput = screen.getByPlaceholderText('Senha')
        expect(passwordInput).toBeInTheDocument()

        // Verificar se o botão de login existe
        const submitButton = screen.getByRole('button', { name: /entrar/i })
        expect(submitButton).toBeInTheDocument()
    })

    /**
     * ✅ TESTE 2: Verificar estado inicial do botão
     * 
     * MOTIVO: O Formik NÃO valida automaticamente no mount
     * O botão fica habilitado até a primeira validação
     */
    it('deve ter o botão de login habilitado inicialmente (Formik não valida no mount)', () => {
        // ARRANGE
        render(<ServerSideLoginPage />)

        // ACT & ASSERT
        const submitButton = screen.getByRole('button', { name: /entrar/i })
        // Formik sem validateOnMount=true deixa botão habilitado inicialmente
        expect(submitButton).not.toBeDisabled()
    })
})

// ============================================
// 📝 GRUPO DE TESTES: Validação de Formulário
// ============================================
describe('ServerSideLoginPage - Validação', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({
                push: jest.fn(),
                replace: jest.fn(),
                back: jest.fn(),
            })
    })

    /**
     * ✅ TESTE 3: Mostrar erro quando usuário é muito curto
     * 
     * REGRA: Usuário deve ter no mínimo 3 caracteres
     */
    it('deve mostrar erro quando o usuário tem menos de 3 caracteres', async () => {
        // ARRANGE
        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')

        // ACT
        // Simular usuário digitando "ab" (2 caracteres)
        fireEvent.change(userInput, { target: { value: 'ab' } })
        // Simular que o usuário saiu do campo (blur)
        fireEvent.blur(userInput)

        // ASSERT
        // Esperar que a mensagem de erro apareça
        await waitFor(() => {
            const errorMessage = screen.getByText(/O usuário deve ter no mínimo 3 caracteres/i)
            expect(errorMessage).toBeInTheDocument()
        })
    })

    /**
     * ✅ TESTE 4: Mostrar erro quando a senha está vazia
     */
    it('deve mostrar erro quando a senha está vazia', async () => {
        // ARRANGE
        render(<ServerSideLoginPage />)

        const passwordInput = screen.getByPlaceholderText('Senha')

        // ACT
        fireEvent.change(passwordInput, { target: { value: '' } })
        fireEvent.blur(passwordInput)

        // ASSERT
        await waitFor(() => {
            const errorMessage = screen.getByText(/A senha é obrigatória/i)
            expect(errorMessage).toBeInTheDocument()
        })
    })

    /**
     * ✅ TESTE 5: Habilitar botão quando formulário é válido
     */
    it('deve habilitar o botão quando o formulário é válido', async () => {
        // ARRANGE
        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.teste' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })

        // ASSERT
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled()
        })
    })
})

// ============================================
// 📝 EXERCÍCIO PARA VOCÊ! 🎯
// ============================================
// Agora é sua vez! Vou deixar comentários guiando você:

describe('ServerSideLoginPage - Seu Teste (EXERCÍCIO)', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({
                push: jest.fn(),
                replace: jest.fn(),
                back: jest.fn(),
            })
    })

    /**
     * 🎓 EXERCÍCIO 1: Testar validação de caracteres inválidos
     * 
     * OBJETIVO: Verificar se mostra erro quando usuário tem caracteres inválidos
     * REGRA: Usuário só pode ter letras, números, ponto, underline, @ e hífen
     * 
     * DICAS:
     * 1. Renderizar o componente
     * 2. Pegar o input de usuário
     * 3. Digitar algo com caractere inválido (ex: "user#name" - # é inválido)
     * 4. Fazer blur
     * 5. Verificar se aparece a mensagem "Usuário contém caracteres inválidos"
     */
    it('EXERCÍCIO: deve mostrar erro quando o usuário contém caracteres inválidos', async () => {
        // ARRANGE
        render(<ServerSideLoginPage />)

        // ACT
        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        fireEvent.change(userInput, { target: { value: 'user#name' } }) // # é inválido
        fireEvent.blur(userInput)

        // ASSERT
        await waitFor(() => {
            expect(screen.getByText(/Usuário contém caracteres inválidos/i)).toBeInTheDocument()
        })
    })

    /**
     * 🎓 EXERCÍCIO 2: Testar senha com mais de 100 caracteres
     * 
     * OBJETIVO: Verificar se mostra erro quando senha é muito longa
     * REGRA: Senha deve ter no máximo 100 caracteres
     */
    it('EXERCÍCIO: deve mostrar erro quando a senha tem mais de 100 caracteres', async () => {
        // ARRANGE
        render(<ServerSideLoginPage />)

        // ACT
        const passwordInput = screen.getByPlaceholderText('Senha')
        const longPassword = 'a'.repeat(101) // Criar senha com 101 caracteres
        fireEvent.change(passwordInput, { target: { value: longPassword } })
        fireEvent.blur(passwordInput)

        // ASSERT
        await waitFor(() => {
            expect(screen.getByText(/A senha deve ter no máximo 100 caracteres/i)).toBeInTheDocument()
        })
    })
})

// ============================================
// � GRUPO DE TESTES: Submit do Formulário  
// ============================================
describe('ServerSideLoginPage - Submit', () => {
    let mockRouterPush: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()

        // Configurar mocks
        mockRouterPush = jest.fn()

            // Mock do router
            ; (useRouter as jest.Mock).mockReturnValue({
                push: mockRouterPush,
                replace: jest.fn(),
                back: jest.fn(),
            })

        // O mockNotify já está configurado no topo do arquivo
    })

    /**
     * ✅ TESTE 6: Submit com sucesso
     * 
     * CONCEITOS NOVOS:
     * - mockImplementation(): Define o comportamento do mock
     * - JSON.stringify(): Como testar chamadas de API
     * - setTimeout mock: Como testar delays
     */
    it('deve fazer login com sucesso e redirecionar', async () => {
        // ARRANGE
        // Mock da resposta da API (sucesso)
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: true,
                    user: { id: 1, name: 'Usuário Teste' }
                })
            } as Response)
        )

        // Mock do setTimeout para não esperar 1.5s no teste
        jest.useFakeTimers()

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        // Preencher formulário válido
        fireEvent.change(userInput, { target: { value: 'usuario.teste' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })

        // Submeter formulário
        fireEvent.click(submitButton)

        // ASSERT
        // Verificar se fetch foi chamado com dados corretos
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'usuario.teste',
                    password: 'senha123'
                }),
            })
        })

        // Verificar se notificação de sucesso foi chamada
        await waitFor(() => {
            expect(mockNotify.success).toHaveBeenCalledWith(
                'Login realizado com sucesso! Redirecionando...',
                expect.objectContaining({
                    title: 'Sucesso',
                    duration: 3000
                })
            )
        })

        // Avançar o tempo do setTimeout
        jest.advanceTimersByTime(1500)

        // Verificar se houve redirecionamento
        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/admin/gerenciador-pdfs')
        })

        // Limpar timers
        jest.useRealTimers()
    })

    /**
     * ✅ TESTE 7: Submit com erro de credenciais
     */
    it('deve mostrar erro quando credenciais são inválidas', async () => {
        // ARRANGE
        // Mock da resposta da API (erro)
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({
                    success: false,
                    message: 'Usuário ou senha inválidos'
                })
            } as Response)
        )

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.erro' } })
        fireEvent.change(passwordInput, { target: { value: 'senhaerrada' } })
        fireEvent.click(submitButton)

        // ASSERT
        await waitFor(() => {
            expect(mockNotify.error).toHaveBeenCalledWith(
                expect.stringContaining('Senha incorreta'),
                expect.objectContaining({
                    title: 'Falha na Autenticação',
                    duration: 0
                })
            )
        })

        // Verificar que NÃO houve redirecionamento
        expect(mockRouterPush).not.toHaveBeenCalled()
    })
})

// ============================================
// 📝 GRUPO DE TESTES: Estados de Loading 
// ============================================
describe('ServerSideLoginPage - Estados de Loading', () => {
    let mockRouterPush: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()

        mockRouterPush = jest.fn()

            ; (useRouter as jest.Mock).mockReturnValue({
                push: mockRouterPush,
                replace: jest.fn(),
                back: jest.fn(),
            })
    })

    /**
     * ✅ TESTE 7: Verificar spinner durante loading
     * 
     * CONCEITOS NOVOS:
     * - Estado de loading: Como testar mudanças de UI baseadas em estado
     * - CSS classes: Como buscar elementos pela classe CSS
     * - Timers: Como testar componentes que usam delays
     */
    it('deve mostrar spinner durante o loading do login', async () => {
        // ARRANGE
        // Mock da API que demora para responder (simular loading)
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({
                            success: true,
                            user: { id: 1, name: 'Usuário Teste' }
                        })
                    } as Response)
                }, 100) // 100ms de delay
            })
        )

        jest.useFakeTimers()

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // Verificar que NÃO há spinner inicialmente
        expect(document.querySelector('.animate-spin')).not.toBeInTheDocument()

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.teste' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })
        fireEvent.click(submitButton)

        // ASSERT - Verificar que o spinner aparece durante loading
        await waitFor(() => {
            // Buscar o div que contém a classe animate-spin
            const spinner = document.querySelector('.animate-spin')
            expect(spinner).toBeInTheDocument()
        })

        // Verificar que o botão fica desabilitado durante loading
        expect(submitButton).toBeDisabled()

        // Avançar timers para completar o login
        jest.advanceTimersByTime(100)

        // Aguardar que o loading termine
        await waitFor(() => {
            expect(document.querySelector('.animate-spin')).not.toBeInTheDocument()
        })

        jest.useRealTimers()
    })

    /**
     * ✅ TESTE 8: Verificar botão desabilitado durante loading
     */
    it('deve desabilitar o botão durante o loading', async () => {
        // ARRANGE
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        ok: true,
                        json: () => Promise.resolve({ success: true })
                    } as Response)
                }, 50)
            })
        )

        jest.useFakeTimers()

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.teste' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })
        fireEvent.click(submitButton)

        // ASSERT
        await waitFor(() => {
            expect(submitButton).toBeDisabled()
        })

        // Completar o loading
        jest.advanceTimersByTime(50)

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled()
        })

        jest.useRealTimers()
    })
})

// ============================================
// � GRUPO DE TESTES: Erros de API 
// ============================================
describe('ServerSideLoginPage - Erros de API', () => {
    let mockRouterPush: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()

        mockRouterPush = jest.fn()

            ; (useRouter as jest.Mock).mockReturnValue({
                push: mockRouterPush,
                replace: jest.fn(),
                back: jest.fn(),
            })
    })

    /**
     * ✅ TESTE 9: Erro de usuário bloqueado
     * 
     * CONCEITOS NOVOS:
     * - Diferentes tipos de erro da API
     * - Mensagens específicas baseadas no conteúdo da resposta
     */
    it('deve mostrar erro específico quando usuário está bloqueado', async () => {
        // ARRANGE
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: false,
                    message: 'Usuário bloqueado temporariamente'
                })
            } as Response)
        )

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.bloqueado' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })
        fireEvent.click(submitButton)

        // ASSERT
        await waitFor(() => {
            expect(mockNotify.error).toHaveBeenCalledWith(
                expect.stringContaining('Usuário bloqueado'),
                expect.objectContaining({
                    title: 'Falha na Autenticação',
                    duration: 0
                })
            )
        })
    })

    /**
     * ✅ TESTE 10: Erro de sessão expirada
     */
    it('deve mostrar erro específico quando sessão está expirada', async () => {
        // ARRANGE
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    success: false,
                    message: 'Token expirado, faça login novamente'
                })
            } as Response)
        )

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.teste' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })
        fireEvent.click(submitButton)

        // ASSERT
        await waitFor(() => {
            expect(mockNotify.error).toHaveBeenCalledWith(
                expect.stringContaining('Sessão expirada'),
                expect.objectContaining({
                    title: 'Falha na Autenticação'
                })
            )
        })
    })

    /**
     * ✅ TESTE 11: Erro de timeout de rede
     * 
     * CONCEITOS NOVOS:
     * - Como simular erros de rede (Promise.reject)
     * - Diferentes tipos de erro (timeout, network, fetch)
     */
    it('deve mostrar erro de timeout quando a requisição demora muito', async () => {
        // ARRANGE
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            Promise.reject(new Error('timeout'))
        )

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.teste' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })
        fireEvent.click(submitButton)

        // ASSERT
        await waitFor(() => {
            expect(mockNotify.error).toHaveBeenCalledWith(
                expect.stringContaining('Timeout na conexão'),
                expect.objectContaining({
                    title: 'Problema de Conectividade'
                })
            )
        })
    })

    /**
     * ✅ TESTE 12: Erro de rede (network error)
     */
    it('deve mostrar erro de rede quando não há conectividade', async () => {
        // ARRANGE
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            Promise.reject(new Error('network error'))
        )

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.teste' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })
        fireEvent.click(submitButton)

        // ASSERT
        await waitFor(() => {
            expect(mockNotify.error).toHaveBeenCalledWith(
                expect.stringContaining('Erro de rede'),
                expect.objectContaining({
                    title: 'Problema de Conectividade'
                })
            )
        })
    })

    /**
     * ✅ TESTE 13: Erro de servidor indisponível (fetch error)
     */
    it('deve mostrar erro de servidor quando fetch falha', async () => {
        // ARRANGE
        ; (global.fetch as jest.MockedFunction<typeof fetch>).mockImplementation(() =>
            Promise.reject(new TypeError('fetch error'))
        )

        render(<ServerSideLoginPage />)

        const userInput = screen.getByPlaceholderText('Usuário ou Email')
        const passwordInput = screen.getByPlaceholderText('Senha')
        const submitButton = screen.getByRole('button', { name: /entrar/i })

        // ACT
        fireEvent.change(userInput, { target: { value: 'usuario.teste' } })
        fireEvent.change(passwordInput, { target: { value: 'senha123' } })
        fireEvent.click(submitButton)

        // ASSERT
        await waitFor(() => {
            expect(mockNotify.error).toHaveBeenCalledWith(
                expect.stringContaining('Servidor indisponível'),
                expect.objectContaining({
                    title: 'Problema de Conectividade'
                })
            )
        })
    })
})

// ============================================
// �📚 PRÓXIMOS PASSOS
// ============================================
/*
  VOCÊ APRENDEU:
  ✅ Como estruturar testes (describe, it, expect)
  ✅ Como renderizar componentes (render)
  ✅ Como buscar elementos (screen.getByText, getByPlaceholderText)
  ✅ Como simular interações (fireEvent.change, fireEvent.blur)
  ✅ Como esperar por mudanças assíncronas (waitFor)
  ✅ Como usar mocks para isolar dependências
  ✅ Como testar submit de formulários
  ✅ Como mockar chamadas de API (fetch)
  ✅ Como testar redirecionamentos
  ✅ Como testar notificações
  ✅ Como usar fake timers (jest.useFakeTimers)

  PRÓXIMOS TÓPICOS:
  1. ✅ Testar submit do formulário (CONCLUÍDO!)
  2. ✅ Testar chamadas de API (CONCLUÍDO!)
  3. ✅ Testar redirecionamento (CONCLUÍDO!)
  4. ✅ Testar notificações (CONCLUÍDO!)
  5. ✅ Testar estados de loading (CONCLUÍDO!)
  6. ✅ Completar exercícios (.skip) (CONCLUÍDO!)
  7. ✅ Testar diferentes tipos de erro da API (CONCLUÍDO!)
  8. Testar casos extremos (usuário muito longo, edge cases)
  9. Expandir para outros componentes (Button, Card, etc.)

  COMANDOS ÚTEIS:
  - npm run test:unit -- --watch    # Executar testes em modo watch
  - npm run test:unit -- page.test  # Executar apenas este arquivo
  - npm run test:unit -- --coverage # Ver cobertura de testes
*/
