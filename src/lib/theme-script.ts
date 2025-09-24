// Script otimizado que será executado antes do React hidratar para prevenir flash do tema
export const themeScript = `
(function() {
  try {
    const theme = localStorage.getItem('telescope-theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    const root = document.documentElement;
    
    // Desabilita transições durante a aplicação inicial
    root.style.setProperty('--theme-transition', 'none');
    
    // Aplicar o tema imediatamente no HTML
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Re-habilita transições após um frame para permitir transições normais
    requestAnimationFrame(() => {
      root.style.setProperty('--theme-transition', 'all 0.2s ease-in-out');
    });
    
    console.log('🎨 Tema inicial aplicado:', theme);
  } catch (e) {
    console.warn('Erro ao aplicar tema inicial:', e);
    // Fallback para tema escuro
    document.documentElement.classList.add('dark');
  }
})();
`;
