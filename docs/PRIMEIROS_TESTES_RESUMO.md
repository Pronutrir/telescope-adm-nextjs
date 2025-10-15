# 🎓 RESUMO: Começando com Testes Unitários

## ✅ **O que foi criado**

### 1. **Arquivo de Teste** 
📁 `src/app/auth/server-login/__tests__/page.test.tsx`

Este arquivo contém:
- ✅ 5 testes de exemplo **completos e funcionando**
- ✅ 2 exercícios para **você praticar**
- ✅ Comentários explicativos em **cada linha**
- ✅ Estrutura AAA (Arrange, Act, Assert)

### 2. **Guia de Referência**
📁 `docs/GUIA_TESTES_UNITARIOS.md`

Um guia completo com:
- 📖 Conceitos básicos
- 🔍 Como buscar elementos
- 🎭 Como simular interações
- ✅ Como fazer verificações
- 💡 Exemplos práticos
- 🚀 Comandos úteis

## 📝 **O que você aprendeu**

### **1. Estrutura de um Teste (AAA)**
```typescript
it('deve fazer algo', () => {
  // ARRANGE (Preparar) - Configurar o teste
  render(<Component />)
  
  // ACT (Agir) - Executar a ação
  fireEvent.click(button)
  
  // ASSERT (Verificar) - Confirmar resultado
  expect(result).toBeTruthy()
})
```

### **2. Renderizar Componentes**
```typescript
render(<ServerSideLoginPage />)
```

### **3. Buscar Elementos na Tela**
```typescript
// Por texto
screen.getByText('TELESCOPE')

// Por placeholder
screen.getByPlaceholderText('Usuário ou Email')

// Por role (mais recomendado)
screen.getByRole('button', { name: /entrar/i })
```

### **4. Simular Interações**
```typescript
// Digitar em um input
fireEvent.change(input, { target: { value: 'usuario' } })

// Clicar em botão
fireEvent.click(button)

// Sair do campo (blur)
fireEvent.blur(input)
```

### **5. Verificações (Assertions)**
```typescript
// Elemento está na tela
expect(element).toBeInTheDocument()

// Botão está desabilitado
expect(button).toBeDisabled()

// Input tem valor
expect(input).toHaveValue('usuario')
```

### **6. Operações Assíncronas**
```typescript
await waitFor(() => {
  expect(screen.getByText('Erro')).toBeInTheDocument()
})
```

### **7. Mocks (Simulações)**
```typescript
// Mock de módulo
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock de API
global.fetch = jest.fn()
```

## 🎯 **Próximos Passos - Seu Exercício**

### **Exercício 1: Caracteres Inválidos**
Complete o teste que verifica se aparece erro quando usuário tem caracteres inválidos.

**Dica:** O regex permite apenas `[a-zA-Z0-9._@-]`

```typescript
it('deve mostrar erro quando o usuário contém caracteres inválidos', async () => {
  // 1. Renderizar o componente
  render(<ServerSideLoginPage />)
  
  // 2. Pegar o input de usuário
  const userInput = screen.getByPlaceholderText('Usuário ou Email')
  
  // 3. Digitar algo com caractere inválido (ex: "user#name" - # é inválido)
  fireEvent.change(userInput, { target: { value: 'user#name' } })
  
  // 4. Fazer blur
  fireEvent.blur(userInput)
  
  // 5. Verificar se aparece a mensagem de erro
  await waitFor(() => {
    expect(screen.getByText(/Usuário contém caracteres inválidos/i)).toBeInTheDocument()
  })
})
```

### **Exercício 2: Senha Muito Longa**
Complete o teste que verifica se aparece erro quando senha tem mais de 100 caracteres.

```typescript
it('deve mostrar erro quando a senha tem mais de 100 caracteres', async () => {
  render(<ServerSideLoginPage />)
  
  const passwordInput = screen.getByPlaceholderText('Senha')
  
  // Criar uma string com 101 caracteres
  const longPassword = 'a'.repeat(101)
  
  fireEvent.change(passwordInput, { target: { value: longPassword } })
  fireEvent.blur(passwordInput)
  
  await waitFor(() => {
    expect(screen.getByText(/A senha deve ter no máximo 100 caracteres/i)).toBeInTheDocument()
  })
})
```

## 🚀 **Como Executar os Testes**

### **Opção 1: Mover para tests/unit**
```bash
# Mover o arquivo para a pasta tests/unit
mv src/app/auth/server-login/__tests__/page.test.tsx tests/unit/login-page.test.tsx

# Executar os testes
npm run test:unit
```

### **Opção 2: Criar configuração para testes de componentes**
Adicionar no `package.json`:
```json
{
  "scripts": {
    "test:components": "jest --testPathPattern=\"src/.*/__.tests__.*\\.test\\.tsx?$\" --watchAll=false"
  }
}
```

Depois executar:
```bash
npm run test:components
```

### **Opção 3: Modo Watch (Recomendado para desenvolvimento)**
```bash
# Executar em modo watch (re-executa ao salvar)
npm run test:unit -- --watch

# Pressione 'p' e digite 'login' para filtrar apenas testes de login
```

## 📊 **O que Testar na Página de Login**

### ✅ **Testes Básicos (Já criados)**
- [x] Renderização de elementos
- [x] Botão desabilitado com campos vazios
- [x] Validação de usuário curto
- [x] Validação de senha vazia
- [x] Botão habilitado com dados válidos

### 🎯 **Próximos Testes (Para você praticar)**
- [ ] Validação de caracteres inválidos
- [ ] Validação de senha muito longa
- [ ] Submit do formulário
- [ ] Chamada de API bem-sucedida
- [ ] Tratamento de erro de API
- [ ] Estado de loading
- [ ] Redirecionamento após login
- [ ] Notificações de sucesso/erro

## 💡 **Dicas Importantes**

### ✅ **Boas Práticas**
1. **Um teste, uma verificação**: Cada teste deve verificar UMA coisa específica
2. **Testes independentes**: Um teste não deve depender de outro
3. **Nomes descritivos**: `deve mostrar erro quando senha é vazia`
4. **Usar waitFor**: Sempre que houver operação assíncrona
5. **Limpar mocks**: Usar `beforeEach(() => jest.clearAllMocks())`

### ❌ **Evite**
1. **Testar implementação**: Teste comportamento do usuário, não código interno
2. **Testes grandes**: Divida em testes menores
3. **Hardcoded delays**: Use `waitFor` em vez de `setTimeout`
4. **Ignorar acessibilidade**: Use `getByRole` sempre que possível

## 🎓 **Fluxo de Aprendizado Recomendado**

### **Nível 1: Fundamentos** (Você está aqui! 🎉)
- [x] Entender estrutura de teste (AAA)
- [x] Renderizar componentes
- [x] Buscar elementos
- [x] Simular interações básicas
- [x] Fazer verificações simples

### **Nível 2: Intermediário** (Próximos passos)
- [ ] Testar submit de formulários
- [ ] Mock de chamadas de API
- [ ] Testar estados de loading
- [ ] Testar redirecionamentos
- [ ] Testar notificações

### **Nível 3: Avançado** (Futuro)
- [ ] Testes de integração
- [ ] Testes de performance
- [ ] Testes E2E
- [ ] Snapshots
- [ ] Cobertura de código > 80%

## 📚 **Recursos para Continuar Aprendendo**

1. **Documentação Oficial**
   - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
   - [Jest](https://jestjs.io/docs/getting-started)

2. **Guias Práticos**
   - [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
   - [Testing Best Practices](https://kentcdodds.com/blog/write-tests)

3. **Vídeos**
   - [Testing Library Tutorial](https://www.youtube.com/results?search_query=react+testing+library+tutorial)

## 🎉 **Parabéns!**

Você deu o primeiro passo para escrever código mais confiável e profissional!

**Próxima aula:** Vamos completar os exercícios juntos e adicionar testes de submit e API! 🚀
