# 👤 Página de Perfil do Usuário

Página completa de gerenciamento de perfil de usuário com múltiplas funcionalidades e interface moderna.

## 📋 Funcionalidades

### ✅ Implementadas

1. **Editar Perfil**
   - Formulário completo de edição de dados pessoais
   - Validação com Yup e Formik
   - Campos: nome, email, telefone, celular, endereço, etc.
   - Salvamento com feedback visual
   - Integração com API

2. **Foto de Perfil**
   - Upload de avatar com preview
   - Validação de tamanho (máx 2MB) e tipo de arquivo
   - Exibição de iniciais quando não há foto
   - Design responsivo com animações

3. **Informações da Conta**
   - Visualização completa dos dados do usuário
   - Status da conta (Ativo/Inativo)
   - Informações de integração API
   - Tempo de acesso
   - Data de criação

4. **Permissões**
   - Visualização de todas as permissões do usuário
   - Modal com lista detalhada
   - Contagem total de permissões
   - Categorização por tipo

5. **Segurança**
   - Alteração de senha com validação forte
   - Indicador visual de força da senha
   - Requisitos de segurança explícitos
   - Confirmação de senha
   - Toggle para mostrar/ocultar senha

6. **Atividades Recentes**
   - Log de ações do usuário
   - Timeline visual com ícones
   - Timestamps relativos (há X minutos/horas)
   - Categorização por tipo de atividade

## 🎨 Componentes Criados

### 1. UserProfileHeader
**Localização:** `src/components/profile/UserProfileHeader.tsx`

Hero section com gradiente e informações de boas-vindas.

```tsx
<UserProfileHeader user={user} isDark={isDark} />
```

### 2. UserProfileForm
**Localização:** `src/components/profile/UserProfileForm.tsx`

Formulário completo de edição com validação.

```tsx
<UserProfileForm 
  user={user} 
  isDark={isDark}
  isLoading={isLoading}
  setIsLoading={setIsLoading}
/>
```

### 3. UserAvatarUpload
**Localização:** `src/components/profile/UserAvatarUpload.tsx`

Upload de foto de perfil com preview e validação.

```tsx
<UserAvatarUpload
  currentAvatar={user.avatar}
  userName={user.nomeCompleto}
  onUpload={handleAvatarUpload}
  isDark={isDark}
/>
```

### 4. UserInfoCard
**Localização:** `src/components/profile/UserInfoCard.tsx`

Card com informações detalhadas da conta.

```tsx
<UserInfoCard user={user} isDark={isDark} />
```

### 5. UserPermissionsCard
**Localização:** `src/components/profile/UserPermissionsCard.tsx`

Visualização de permissões com modal detalhado.

```tsx
<UserPermissionsCard 
  user={user} 
  isDark={isDark}
  isLoading={isLoading}
/>
```

### 6. UserSecuritySettings
**Localização:** `src/components/profile/UserSecuritySettings.tsx`

Formulário de alteração de senha com validação forte.

```tsx
<UserSecuritySettings
  onChangePassword={handleChangePassword}
  isDark={isDark}
/>
```

### 7. UserActivityLog
**Localização:** `src/components/profile/UserActivityLog.tsx`

Timeline de atividades recentes do usuário.

```tsx
<UserActivityLog 
  activities={activities} 
  isDark={isDark}
/>
```

## 🔧 Estrutura de Arquivos

```
src/
├── app/
│   └── admin/
│       └── profile/
│           ├── page.tsx              # Página principal com abas
│           └── README.md             # Este arquivo
│
└── components/
    └── profile/
        ├── index.ts                  # Exports centralizados
        ├── UserProfileHeader.tsx     # Header da página
        ├── UserProfileForm.tsx       # Formulário de edição
        ├── UserAvatarUpload.tsx      # Upload de avatar
        ├── UserInfoCard.tsx          # Card de informações
        ├── UserPermissionsCard.tsx   # Card de permissões
        ├── UserSecuritySettings.tsx  # Configurações de segurança
        └── UserActivityLog.tsx       # Log de atividades
```

## 🎯 Como Usar

### Básico

A página já está configurada e pode ser acessada em:

```
/admin/profile
```

### Sistema de Abas

A página usa um sistema de abas para organizar o conteúdo:

1. **Editar Perfil** - Formulário principal
2. **Foto de Perfil** - Upload de avatar
3. **Informações** - Detalhes da conta
4. **Permissões** - Lista de permissões
5. **Segurança** - Alteração de senha
6. **Atividades** - Log de ações

### Implementação de Handlers

```typescript
// Upload de Avatar
const handleAvatarUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)
  
  const response = await fetch('/api/user/avatar', {
    method: 'POST',
    body: formData
  })
  
  // Atualizar state com nova URL
}

// Mudança de Senha
const handleChangePassword = async (currentPassword: string, newPassword: string) => {
  const response = await fetch('/api/user/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword })
  })
  
  if (!response.ok) throw new Error('Senha incorreta')
}
```

## 🔐 Validações

### Senha

Requisitos obrigatórios:
- ✅ Mínimo 8 caracteres
- ✅ Pelo menos 1 letra maiúscula
- ✅ Pelo menos 1 letra minúscula
- ✅ Pelo menos 1 número
- ✅ Pelo menos 1 caractere especial (@$!%*?&#)

### Avatar

- ✅ Formatos aceitos: JPG, PNG, GIF
- ✅ Tamanho máximo: 2MB
- ✅ Preview antes do upload

### Formulário

- ✅ Nome completo: 10-100 caracteres
- ✅ Email: formato válido
- ✅ Telefones: formatação brasileira

## 🎨 Temas

A página suporta modo claro e escuro automaticamente:

- Detecta tema do sistema via `useTheme()` hook
- Fallback para detecção de classe `dark` no HTML
- Todos os componentes adaptam cores dinamicamente

## 📱 Responsividade

- ✅ Mobile First
- ✅ Breakpoints: sm, md, lg, xl
- ✅ Tabs com scroll horizontal em mobile
- ✅ Grid adaptativo nos formulários

## 🚀 Próximos Passos

### Integrações Pendentes

1. **API de Upload**
   - [ ] Implementar endpoint de upload de avatar
   - [ ] Storage (AWS S3, Cloudinary, etc)
   - [ ] Redimensionamento de imagens

2. **API de Atividades**
   - [ ] Endpoint para buscar atividades reais
   - [ ] Filtros por data/tipo
   - [ ] Paginação

3. **Notificações**
   - [ ] Toast notifications
   - [ ] Email de confirmação após mudanças
   - [ ] Histórico de alterações

4. **Segurança Adicional**
   - [ ] 2FA (Two-Factor Authentication)
   - [ ] Sessões ativas
   - [ ] Dispositivos conectados
   - [ ] Log de IPs

## 🐛 Troubleshooting

### Avatar não aparece

Verifique se o campo `avatar` está sendo retornado pela API:

```typescript
// auth-types.ts
export interface IUser {
  // ...
  avatar?: string  // Deve estar presente
  // ...
}
```

### Tema não alterna

Verifique se o ThemeContext está configurado:

```tsx
// app/layout.tsx ou providers.tsx
<ThemeProvider>
  {children}
</ThemeProvider>
```

### Formulário não salva

Verifique o hook `useUserProfile`:

```typescript
// hooks/useUserProfile.ts
export const useUserProfile = (userId: string) => {
  // Implementação da API
}
```

## 📝 Notas Importantes

1. **Mock Data**: As atividades estão usando dados mockados. Integre com API real.
2. **Handlers**: Os handlers de upload e senha precisam ser conectados à API.
3. **Permissões**: O sistema de permissões deve refletir o backend.
4. **Validações**: Ajuste validações conforme regras de negócio.

## 🤝 Contribuindo

Ao adicionar novos recursos:

1. Mantenha a tipagem TypeScript
2. Siga o padrão de nomenclatura
3. Adicione validações apropriadas
4. Documente no README
5. Teste em modo claro/escuro
6. Verifique responsividade

## 📚 Referências

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Formik](https://formik.org/docs/overview)
- [Yup Validation](https://github.com/jquense/yup)
- [Lucide Icons](https://lucide.dev/)

---

**Versão:** 1.0.0  
**Última Atualização:** 17/10/2025  
**Desenvolvedor:** GitHub Copilot
