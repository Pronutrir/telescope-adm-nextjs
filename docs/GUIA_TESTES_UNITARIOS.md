# 🎓 Guia de Testes Unitários - React Testing Library

## 📖 **Conceitos Básicos**

### **1. Estrutura de um Teste**

```typescript
describe('Nome do Grupo de Testes', () => {
  it('deve fazer algo específico', () => {
    // ARRANGE (Preparar) - Configurar o teste
    // ACT (Agir) - Executar a ação
    // ASSERT (Verificar) - Confirmar resultado
  })
})
```

### **2. Hooks de Ciclo de Vida**

```typescript
beforeEach(() => {
  // Executado ANTES de cada teste
  jest.clearAllMocks()
})

afterEach(() => {
  // Executado DEPOIS de cada teste
  cleanup()
})

beforeAll(() => {
  // Executado UMA VEZ antes de todos os testes
})

afterAll(() => {
  // Executado UMA VEZ depois de todos os testes
})
```

## 🔍 **Buscar Elementos na Tela**

### **Por Texto**
```typescript
// Texto exato
screen.getByText('TELESCOPE')

// Texto parcial (case-insensitive com regex)
screen.getByText(/telescope/i)

// Com função
screen.getByText((content, element) => content.includes('TELE'))
```

### **Por Placeholder**
```typescript
screen.getByPlaceholderText('Usuário ou Email')
screen.getByPlaceholderText(/usuário/i)
```

### **Por Label**
```typescript
screen.getByLabelText('Usuário')
screen.getByLabelText(/senha/i)
```

### **Por Role (Mais Recomendado - Acessibilidade)**
```typescript
// Botão
screen.getByRole('button', { name: /entrar/i })

// Input de texto
screen.getByRole('textbox', { name: /usuário/i })

// Checkbox
screen.getByRole('checkbox', { name: /lembrar-me/i })

// Link
screen.getByRole('link', { name: /esqueci a senha/i })
```

### **Por Test ID (Use como último recurso)**
```typescript
// No JSX: <div data-testid="login-form">
screen.getByTestId('login-form')
```

### **Diferenças entre get, query e find**

```typescript
// getBy - Lança erro se não encontrar (use para elementos que DEVEM existir)
screen.getByText('TELESCOPE')

// queryBy - Retorna null se não encontrar (use para verificar AUSÊNCIA)
expect(screen.queryByText('Erro')).not.toBeInTheDocument()

// findBy - Retorna Promise, espera elemento aparecer (use para assíncrono)
const message = await screen.findByText('Login bem-sucedido')
```

## 🎭 **Simular Interações do Usuário**

### **Digitar em um Input**
```typescript
import { fireEvent } from '@testing-library/react'

const input = screen.getByPlaceholderText('Usuário')
fireEvent.change(input, { target: { value: 'meu.usuario' } })
```

### **Clicar em um Botão**
```typescript
const button = screen.getByRole('button', { name: /entrar/i })
fireEvent.click(button)
```

### **Simular Blur (sair do campo)**
```typescript
const input = screen.getByPlaceholderText('Senha')
fireEvent.blur(input)
```

### **Simular Focus (focar no campo)**
```typescript
fireEvent.focus(input)
```

### **Simular Submit de Formulário**
```typescript
const form = screen.getByRole('form') // ou getByTestId('login-form')
fireEvent.submit(form)
```

### **User Event (Mais Realista - Recomendado)**
```typescript
import userEvent from '@testing-library/user-event'

const user = userEvent.setup()

// Digitar (simula digitação real, letra por letra)
await user.type(input, 'meu.usuario')

// Clicar
await user.click(button)

// Limpar input
await user.clear(input)

// Tab (navegar entre campos)
await user.tab()
```

## ✅ **Asserções (Verificações)**

### **Elemento na Tela**
```typescript
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()
```

### **Visibilidade**
```typescript
expect(element).toBeVisible()
expect(element).not.toBeVisible()
```

### **Habilitado/Desabilitado**
```typescript
expect(button).toBeDisabled()
expect(button).toBeEnabled()
expect(button).not.toBeDisabled()
```

### **Valores de Input**
```typescript
expect(input).toHaveValue('meu.usuario')
expect(input).toHaveValue('')
```

### **Classes CSS**
```typescript
expect(element).toHaveClass('text-red-500')
expect(element).toHaveClass('text-red-500', 'font-bold')
```

### **Atributos**
```typescript
expect(input).toHaveAttribute('type', 'password')
expect(input).toHaveAttribute('placeholder')
```

### **Texto no Elemento**
```typescript
expect(element).toHaveTextContent('TELESCOPE')
expect(element).toHaveTextContent(/telescope/i)
```

### **Estilo**
```typescript
expect(element).toHaveStyle({ color: 'red' })
expect(element).toHaveStyle('display: none')
```

## ⏱️ **Assíncrono (Esperar por Mudanças)**

### **waitFor - Esperar até condição ser verdadeira**
```typescript
import { waitFor } from '@testing-library/react'

await waitFor(() => {
  expect(screen.getByText('Sucesso')).toBeInTheDocument()
})

// Com timeout customizado (padrão: 1000ms)
await waitFor(() => {
  expect(screen.getByText('Carregando...')).toBeInTheDocument()
}, { timeout: 3000 })
```

### **waitForElementToBeRemoved - Esperar elemento sumir**
```typescript
import { waitForElementToBeRemoved } from '@testing-library/react'

const loader = screen.getByText('Carregando...')
await waitForElementToBeRemoved(loader)
```

### **findBy - Buscar elemento assíncrono**
```typescript
// Automaticamente espera até 1000ms
const message = await screen.findByText('Login bem-sucedido')
```

## 🎭 **Mocks**

### **Mock de Função**
```typescript
const mockFunction = jest.fn()

// Chamar função
mockFunction('arg1', 'arg2')

// Verificar se foi chamada
expect(mockFunction).toHaveBeenCalled()
expect(mockFunction).toHaveBeenCalledTimes(1)
expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2')

// Definir retorno
mockFunction.mockReturnValue('valor')
mockFunction.mockResolvedValue('valor async') // Para Promises
mockFunction.mockRejectedValue(new Error('erro')) // Para erros
```

### **Mock de Módulo**
```typescript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Configurar comportamento
;(useRouter as jest.Mock).mockReturnValue({
  push: jest.fn(),
  replace: jest.fn(),
})
```

### **Mock de Fetch**
```typescript
global.fetch = jest.fn()

// Simular resposta bem-sucedida
;(fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  status: 200,
  json: async () => ({ success: true, user: { name: 'João' } }),
} as Response)

// Simular erro
;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
```

## 🎯 **Boas Práticas**

### ✅ **FAÇA**
- Teste comportamento do usuário, não implementação
- Use `screen.getByRole` sempre que possível (melhor para acessibilidade)
- Teste casos de sucesso E falha
- Use `waitFor` para operações assíncronas
- Mantenha testes isolados (sem dependências entre eles)
- Use `beforeEach` para limpar mocks

### ❌ **EVITE**
- Testar detalhes de implementação (ex: estado interno)
- Usar `data-testid` sem necessidade
- Testes muito grandes (divida em testes menores)
- Hardcoded delays (use `waitFor`)
- Acessar elementos internos do componente

## 📊 **Cobertura de Testes**

### **O que Testar?**
```
✅ Renderização de elementos principais
✅ Validações de formulário
✅ Interações do usuário (click, type, submit)
✅ Chamadas de API (mock)
✅ Estados de loading
✅ Mensagens de erro
✅ Redirecionamentos
✅ Casos extremos (edge cases)
```

## 🚀 **Comandos Úteis**

```bash
# Executar todos os testes
npm run test:unit

# Executar em modo watch (re-executa ao salvar)
npm run test:unit -- --watch

# Executar apenas um arquivo
npm run test:unit -- page.test

# Ver cobertura de código
npm run test:unit -- --coverage

# Executar apenas testes que falharam
npm run test:unit -- --onlyFailures

# Executar com mais detalhes
npm run test:unit -- --verbose

# Atualizar snapshots
npm run test:unit -- --updateSnapshot
```

## 💡 **Exemplo Completo**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from './page'

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve fazer login com sucesso', async () => {
    // ARRANGE
    const user = userEvent.setup()
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)
    
    render(<LoginPage />)

    // ACT
    const userInput = screen.getByPlaceholderText('Usuário')
    const passwordInput = screen.getByPlaceholderText('Senha')
    const submitButton = screen.getByRole('button', { name: /entrar/i })

    await user.type(userInput, 'usuario.teste')
    await user.type(passwordInput, 'senha123')
    await user.click(submitButton)

    // ASSERT
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/session', expect.any(Object))
    })
  })
})
```

## 📚 **Recursos Adicionais**

- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
