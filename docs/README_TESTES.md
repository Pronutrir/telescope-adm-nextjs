# 📝 Como Usar os Testes Criados

## 🎯 Arquivos Criados

1. **`src/app/auth/server-login/__tests__/page.test.tsx`** - Arquivo de testes com exemplos e exercícios
2. **`docs/GUIA_TESTES_UNITARIOS.md`** - Guia completo de referência
3. **`docs/PRIMEIROS_TESTES_RESUMO.md`** - Resumo do que você aprendeu

## 🚀 Como Executar

### Passo 1: Mover o arquivo de teste para a pasta correta

```bash
# No terminal PowerShell, dentro do projeto telescope-adm-nextjs
cp src/app/auth/server-login/__tests__/page.test.tsx tests/unit/login-page.test.tsx
```

### Passo 2: Executar os testes

```bash
npm run test:unit -- --testPathPattern="login-page" --watch
```

### Passo 3: Completar os exercícios

Abra o arquivo `tests/unit/login-page.test.tsx` e encontre os testes marcados com `it.skip`.
Remova o `.skip` e complete o código seguindo as dicas nos comentários.

## 📖 Leitura Recomendada

1. **Primeiro**: Leia o `PRIMEIROS_TESTES_RESUMO.md` para entender o que você aprendeu
2. **Referência**: Consulte o `GUIA_TESTES_UNITARIOS.md` sempre que tiver dúvidas
3. **Prática**: Complete os exercícios no arquivo de teste

## 💬 Perguntas Frequentes

**P: Por que os testes não executaram?**
R: O arquivo está em `src/app/auth/server-login/__tests__/` mas nossa configuração procura em `tests/unit/`. Mova o arquivo conforme Passo 1.

**P: Como saber se meu teste está correto?**
R: Execute em modo watch (`--watch`) e veja se passa (✓) ou falha (✗).

**P: Posso modificar os testes de exemplo?**
R: Sim! Experimente mudar valores e ver o que acontece. Aprendemos errando!

**P: Quantos testes devo escrever?**
R: Comece com os exercícios fornecidos. Depois, tente adicionar 1-2 testes novos por dia.

## 🎓 Próxima Aula

Quando completar os exercícios, me avise! Vamos fazer juntos:
- ✅ Testar submit do formulário
- ✅ Mock de chamadas de API
- ✅ Testar redirecionamento
- ✅ Testar notificações

Bons estudos! 🚀
