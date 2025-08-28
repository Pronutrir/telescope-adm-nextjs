// Script que será executado antes do React hidratar para prevenir flash do tema
export const themeScript = `
(function() {
  try {
    const theme = localStorage.getItem('telescope-theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Aplicar o tema imediatamente no HTML
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    
    // Adicionar uma propriedade CSS customizada para evitar transições durante o carregamento inicial
    document.documentElement.style.setProperty('--theme-loading', '1');
    
    // Remover a propriedade após um pequeno delay para permitir transições normais
    setTimeout(() => {
      document.documentElement.style.removeProperty('--theme-loading');
    }, 150);
    
    // Log para debug
    console.log('🎨 Tema aplicado no script inicial:', theme);
  } catch (e) {
    console.warn('Erro ao aplicar tema inicial:', e);
    // Fallback para tema escuro
    document.documentElement.classList.add('dark');
  }
})();
`;
