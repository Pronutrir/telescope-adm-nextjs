// Script para evitar flash de tema incorreto (FOUC - Flash of Unstyled Content)
(function () {
    try {
        const savedTheme = localStorage.getItem('telescope-theme')
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const theme = savedTheme || systemTheme

        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
    } catch (error) {
        // Fallback para tema claro em caso de erro
        console.log(error)
        document.documentElement.classList.add('light')
    }
})()
