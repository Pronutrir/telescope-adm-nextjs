/* eslint-disable @next/next/no-img-element */
'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useIsClient } from '@/hooks/useIsClient'
import { twMerge } from 'tailwind-merge'
import { PDFDocument } from 'pdf-lib'

interface InlinePDFViewerProps {
    pdfBase64: string
    className?: string
    height?: string
    fileName?: string
    fullScreen?: boolean
    onClose?: () => void
    onEdit?: () => void  // Nova prop para callback de edição
    onSave?: (signedPdfBase64: string) => void // Callback para salvar PDF assinado
}

// Removido safeBase64Encode não utilizado

// Função para converter base64 para Uint8Array (para trabalhar com pdf-lib)
const base64ToUint8Array = (base64String: string): Uint8Array => {
    // Remove o prefixo de data URL se existir
    const cleanBase64 = base64String.includes('base64,')
        ? base64String.split('base64,')[ 1 ]
        : base64String;

    const binaryString = atob(cleanBase64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[ i ] = binaryString.charCodeAt(i);
    }

    return bytes;
};

// Função para converter Uint8Array para base64 (para visualização e retorno)
const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[ i ]);
    }
    return btoa(binary);
};

export default function InlinePDFViewer({
    pdfBase64,
    className = '',
    height = '600px',
    fileName = 'documento.pdf',
    fullScreen = false,
    onClose,
    onEdit,
    onSave
}: InlinePDFViewerProps) {
    const { isDark } = useTheme()
    const isClient = useIsClient()
    const [ showFallback, setShowFallback ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isFullScreen, setIsFullScreen ] = useState(fullScreen)
    const [ pdfPageCount, setPdfPageCount ] = useState(1)
    const [ pdfContentRect, setPdfContentRect ] = useState<DOMRect | null>(null)
    // pdfDimensions not currently used in UI; keep local when needed

    // Estados para modo de assinatura
    const [ isSignatureMode, setIsSignatureMode ] = useState(false)
    const [ signatureImage, setSignatureImage ] = useState<string | null>(null)
    const [ signaturePosition, setSignaturePosition ] = useState({ x: 0, y: 0, page: 1 })
    const [ signatureSize, setSignatureSize ] = useState({ width: 150, height: 70 })
    const [ isDraggingSignature, setIsDraggingSignature ] = useState(false)
    const [ isResizingSignature, setIsResizingSignature ] = useState(false)
    const [ dragOffset, setDragOffset ] = useState({ x: 0, y: 0 })
    const [ resizeDirection, setResizeDirection ] = useState<string>("")
    const [ overlayResizeDirection, setOverlayResizeDirection ] = useState<string>("")
    const [ currentPdfPage ] = useState<number>(1)
    const [ signedPdfBase64, setSignedPdfBase64 ] = useState<string | null>(null)
    const [ signatureError, setSignatureError ] = useState<string | null>(null)

    // Estados para redimensionamento do overlay de assinatura
    const [ overlayBounds, setOverlayBounds ] = useState({
        left: 0, top: 0, width: 0, height: 0
    })
    const [ isResizingOverlay, setIsResizingOverlay ] = useState(false)

    // Referência para o iframe do PDF
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // Função para calcular dinamicamente a área válida do PDF
    const calculateValidPDFArea = (containerElement: HTMLElement) => {
        const containerRect = containerElement.getBoundingClientRect()
        const pdfRect = pdfContentRect || iframeRef.current?.getBoundingClientRect()

        if (!pdfRect) {
            // Fallback: usar as dimensões do container se não conseguir obter o PDF
            return {
                left: 20,
                top: 20,
                width: containerRect.width - 40,
                height: containerRect.height - 40,
                right: containerRect.width - 20,
                bottom: containerRect.height - 20
            }
        }

        // Calcular a área válida do PDF em relação ao container
        const pdfLeft = Math.max(0, pdfRect.left - containerRect.left)
        const pdfTop = Math.max(0, pdfRect.top - containerRect.top)
        const pdfRight = Math.min(containerRect.width, pdfLeft + pdfRect.width)
        const pdfBottom = Math.min(containerRect.height, pdfTop + pdfRect.height)

        return {
            left: pdfLeft,
            top: pdfTop,
            width: pdfRight - pdfLeft,
            height: pdfBottom - pdfTop,
            right: pdfRight,
            bottom: pdfBottom
        }
    }

    useEffect(() => {
        // Timeout para mostrar fallback se o PDF não carregar
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [])

    // Função para analisar o PDF e obter informações sobre ele
    const analyzePDF = async (pdfBase64Data: string) => {
        try {
            const pdfBytes = base64ToUint8Array(pdfBase64Data.replace(/^data:application\/pdf;base64,/, ''))
            const pdfDoc = await PDFDocument.load(pdfBytes)
            const pageCount = pdfDoc.getPageCount()

            console.log(`PDF carregado com sucesso. Total de páginas: ${pageCount}`)
            setPdfPageCount(pageCount)

            return { success: true, pageCount }
        } catch (error) {
            console.error('Erro ao analisar PDF:', error)
            return { success: false, error }
        }
    }

    // Analisar o PDF quando o componente carrega
    useEffect(() => {
        if (pdfBase64 && isClient) {
            analyzePDF(pdfBase64)
        }
    }, [ pdfBase64, isClient ])

    // Adicionar listener para redimensionamento da janela
    useEffect(() => {
        const handleResize = () => {
            if (iframeRef.current && isSignatureMode) {
                // Atualizar as dimensões do PDF quando a janela for redimensionada
                setTimeout(() => {
                    try {
                        // Accessing iframeRef for layout updates if needed
                        // dimensions captured but not stored currently

                        // Tentar detectar o conteúdo real do PDF novamente
                        const iframeDocument = iframeRef.current!.contentDocument || iframeRef.current!.contentWindow?.document

                        if (iframeDocument) {
                            const pdfElement =
                                iframeDocument.querySelector('canvas') ||
                                iframeDocument.querySelector('.pdf') ||
                                iframeDocument.querySelector('embed') ||
                                iframeDocument.body;

                            if (pdfElement) {
                                const rect = pdfElement.getBoundingClientRect();
                                setPdfContentRect(rect);
                            } else {
                                const iframeRect = iframeRef.current!.getBoundingClientRect();
                                setPdfContentRect(iframeRect);
                            }
                        }
                    } catch (error) {
                        console.warn('Erro ao atualizar dimensões do PDF:', error);
                    }
                }, 300);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [ isSignatureMode ]);

    const handleIframeError = () => {
        console.warn('⚠️ Iframe falhou, mostrando fallback')
        setShowFallback(true)
        setIsLoading(false)
    }

    const handleIframeLoad = () => {
        console.log('✅ PDF carregado no iframe')
        setIsLoading(false)

        // Timeout para permitir que o PDF seja renderizado completamente
        setTimeout(() => {
            if (iframeRef.current) {
                const { clientWidth: _w2, clientHeight: _h2 } = iframeRef.current
                // dimensions captured but not stored currently

                try {
                    // Tentar obter o elemento real do PDF dentro do iframe
                    // Na maioria dos navegadores, o PDF é renderizado em um elemento canvas ou div dentro do iframe
                    const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document

                    if (iframeDocument) {
                        // Procurar pelo elemento que contém o PDF real
                        // Diferentes navegadores podem usar diferentes elementos
                        const pdfElement =
                            iframeDocument.querySelector('canvas') ||
                            iframeDocument.querySelector('.pdf') ||
                            iframeDocument.querySelector('embed') ||
                            iframeDocument.body;

                        if (pdfElement) {
                            const rect = pdfElement.getBoundingClientRect();
                            setPdfContentRect(rect);
                            console.log('Dimensões reais do conteúdo PDF:', rect);
                        } else {
                            // Fallback: usar as dimensões do iframe
                            const iframeRect = iframeRef.current.getBoundingClientRect();
                            setPdfContentRect(iframeRect);
                        }
                    }
                } catch (error) {
                    // Se ocorrer um erro de segurança cross-origin, usar as dimensões do iframe
                    console.warn('Não foi possível acessar o conteúdo do iframe:', error);
                    const iframeRect = iframeRef.current.getBoundingClientRect();
                    setPdfContentRect(iframeRect);
                }

                console.log(`Dimensões do iframe PDF capturadas: ${_w2}x${_h2}`);
            }
        }, 500); // Aguardar meio segundo para o PDF renderizar
    }

    const downloadPDF = () => {
        if (!pdfBase64) return

        try {
            // Determinar qual PDF baixar (original ou assinado)
            const pdfToDownload = signedPdfBase64 || pdfBase64

            // Adicionar prefixo de data URL se não existir
            const dataUrl = pdfToDownload.startsWith('data:')
                ? pdfToDownload
                : `data:application/pdf;base64,${pdfToDownload}`

            const link = document.createElement('a')
            link.href = dataUrl
            link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error('Erro ao baixar PDF:', error)
        }
    }

    const openInNewWindow = () => {
        if (!pdfBase64) return

        // Determinar qual PDF abrir (original ou assinado)
        const pdfToOpen = signedPdfBase64 || pdfBase64

        // Adicionar prefixo de data URL se não existir
        const dataUrl = pdfToOpen.startsWith('data:')
            ? pdfToOpen
            : `data:application/pdf;base64,${pdfToOpen}`

        window.open(dataUrl, '_blank')
    }

    // Funções para o modo de assinatura
    const toggleSignatureMode = () => {
        // Limpar estado antes de mudar de modo
        setSignatureError(null)
        setIsLoading(false)

        if (isSignatureMode) {
            // Limpar assinatura ao sair do modo
            setSignatureImage(null)
            setSignedPdfBase64(null)
        } else {
            // Entrando no modo de assinatura
            // Usar as dimensões reais do PDF se disponíveis
            const containerElement = iframeRef.current?.parentElement
            if (containerElement) {
                // Calcular a área válida do PDF dinamicamente
                const validArea = calculateValidPDFArea(containerElement)

                // Inicializar o overlay com dimensões menores e centralizadas dentro da área válida
                const overlayWidth = Math.min(400, validArea.width * 0.6) // 60% da largura da área válida ou 400px
                const overlayHeight = Math.min(300, validArea.height * 0.4) // 40% da altura da área válida ou 300px

                // Centralizar o overlay dentro da área válida do PDF
                const overlayLeft = validArea.left + (validArea.width - overlayWidth) / 2
                const overlayTop = validArea.top + (validArea.height - overlayHeight) / 2

                setOverlayBounds({
                    left: overlayLeft,
                    top: overlayTop,
                    width: overlayWidth,
                    height: overlayHeight
                })

                // Posicionar a assinatura no centro do novo overlay menor
                const centerX = overlayLeft + (overlayWidth / 2) - (signatureSize.width / 2)
                const centerY = overlayTop + (overlayHeight / 2) - (signatureSize.height / 2)

                setSignaturePosition({
                    x: centerX,
                    y: centerY,
                    page: currentPdfPage
                })
            } else {
                // Fallback: usar dimensões padrão se não conseguir calcular a área do PDF
                const fallbackWidth = Math.min(400, 600 * 0.6) // 60% de uma largura padrão
                const fallbackHeight = Math.min(300, 800 * 0.4) // 40% de uma altura padrão

                setOverlayBounds({
                    left: 50,
                    top: 50,
                    width: fallbackWidth,
                    height: fallbackHeight
                })

                setSignaturePosition({
                    x: 50 + (fallbackWidth / 2) - (signatureSize.width / 2),
                    y: 50 + (fallbackHeight / 2) - (signatureSize.height / 2),
                    page: currentPdfPage
                })
            }

            setIsDraggingSignature(false)
        }

        setIsSignatureMode(!isSignatureMode)
    }

    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[ 0 ]
        if (!file) return

        // Verificar tamanho do arquivo (limitar a 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setSignatureError("Arquivo muito grande. Por favor, use uma imagem menor que 5MB.")
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const result = e.target?.result as string
            console.log('Tamanho da imagem carregada:', result.length)

            // Se a imagem for muito grande, pode causar problemas
            if (result.length > 10 * 1024 * 1024) { // 10MB como string base64
                setSignatureError("Imagem muito grande após codificação. Por favor, use uma imagem mais simples.")
                return
            }

            setSignatureImage(result)
        }
        reader.onerror = () => {
            setSignatureError("Erro ao carregar imagem da assinatura. Tente novamente.")
        }
        reader.readAsDataURL(file)
    }

    const handleSignaturePosition = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isSignatureMode || !signatureImage) return

        // Calcular a área válida do PDF dinamicamente
        const validArea = calculateValidPDFArea(e.currentTarget)

        // Calcular as coordenadas relativas ao container
        let x = e.clientX - e.currentTarget.getBoundingClientRect().left
        let y = e.clientY - e.currentTarget.getBoundingClientRect().top

        // Usar os limites do overlay redimensionável, mas restringir à área válida do PDF
        const overlayLeft = Math.max(validArea.left, overlayBounds.left)
        const overlayTop = Math.max(validArea.top, overlayBounds.top)
        const overlayRight = Math.min(validArea.right, overlayBounds.left + overlayBounds.width)
        const overlayBottom = Math.min(validArea.bottom, overlayBounds.top + overlayBounds.height)

        // Verificar se o clique ocorreu dentro da área válida do overlay
        const isInsideValidArea =
            x >= overlayLeft &&
            x <= overlayRight &&
            y >= overlayTop &&
            y <= overlayBottom

        if (!isInsideValidArea) return // Ignorar cliques fora da área válida

        // Calcular os limites considerando o tamanho da assinatura e a área válida
        const maxX = overlayRight - signatureSize.width
        const maxY = overlayBottom - signatureSize.height

        // Garantir que a assinatura não ultrapasse os limites da área válida
        x = Math.max(overlayLeft, Math.min(x, maxX))
        y = Math.max(overlayTop, Math.min(y, maxY))

        setSignaturePosition(prev => ({
            ...prev,
            x,
            y,
            page: currentPdfPage
        }))
    }

    const startDragging = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation() // Impedir que o evento seja propagado para o container

        // Calcular o offset entre a posição do mouse e a posição da assinatura
        const target = e.currentTarget as HTMLElement
        const rect = target.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        // Salvar o offset no estado
        setDragOffset({ x: offsetX, y: offsetY })
        setIsDraggingSignature(true)
    }

    const stopDragging = () => {
        setIsDraggingSignature(false)
        setIsResizingSignature(false)
        setResizeDirection('')
        setIsResizingOverlay(false)
        setOverlayResizeDirection('')
    }

    const startResizing = (e: React.MouseEvent, direction: string) => {
        e.preventDefault()
        e.stopPropagation()
        setIsResizingSignature(true)
        setResizeDirection(direction)

        // Também podemos armazenar a posição inicial do mouse para cálculos de redimensionamento
        const containerRect = (e.currentTarget.closest('.signature-container') as HTMLElement)?.getBoundingClientRect()
        if (containerRect) {
            setDragOffset({
                x: e.clientX - containerRect.left,
                y: e.clientY - containerRect.top
            })
        }
    }

    // stopResizing kept for future use; currently unused
    // const _stopResizing = () => {
    //     setIsResizingSignature(false)
    //     setResizeDirection("")
    // }

    // Funções para redimensionamento do overlay
    const startOverlayResize = (e: React.MouseEvent, direction: string) => {
        e.preventDefault()
        e.stopPropagation()
        setIsResizingOverlay(true)
        setOverlayResizeDirection(direction)
    }

    // const _stopOverlayResize = () => {
    //     setIsResizingOverlay(false)
    //     setOverlayResizeDirection("")
    // }

    const handleOverlayResize = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isResizingOverlay || !overlayResizeDirection) return

        e.preventDefault()

        // Calcular a área válida do PDF dinamicamente
        const validArea = calculateValidPDFArea(e.currentTarget)

        const mouseX = e.clientX - e.currentTarget.getBoundingClientRect().left
        const mouseY = e.clientY - e.currentTarget.getBoundingClientRect().top

        const minSize = 100

        const newBounds = { ...overlayBounds }

        switch (overlayResizeDirection) {
            case "e": // Leste (direita)
                const newWidthE = mouseX - newBounds.left
                const maxAllowedWidth = Math.min(validArea.right - newBounds.left, validArea.width)
                newBounds.width = Math.max(minSize, Math.min(maxAllowedWidth, newWidthE))
                break
            case "w": // Oeste (esquerda)
                const deltaW = newBounds.left - mouseX
                const newWidthW = newBounds.width + deltaW
                const newLeftW = Math.max(validArea.left, mouseX)
                if (newWidthW >= minSize && newLeftW >= validArea.left) {
                    newBounds.width = newBounds.width + (newBounds.left - newLeftW)
                    newBounds.left = newLeftW
                }
                break
            case "n": // Norte (cima)
                const deltaN = newBounds.top - mouseY
                const newHeightN = newBounds.height + deltaN
                const newTopN = Math.max(validArea.top, mouseY)
                if (newHeightN >= minSize && newTopN >= validArea.top) {
                    newBounds.height = newBounds.height + (newBounds.top - newTopN)
                    newBounds.top = newTopN
                }
                break
            case "s": // Sul (baixo)
                const newHeightS = mouseY - newBounds.top
                const maxAllowedHeightS = Math.min(validArea.bottom - newBounds.top, validArea.height)
                newBounds.height = Math.max(minSize, Math.min(maxAllowedHeightS, newHeightS))
                break
            case "ne": // Nordeste
                const newWidthNE = mouseX - newBounds.left
                const deltaNeN = newBounds.top - mouseY
                const newHeightNE = newBounds.height + deltaNeN

                const maxAllowedWidthNE = Math.min(validArea.right - newBounds.left, validArea.width)
                newBounds.width = Math.max(minSize, Math.min(maxAllowedWidthNE, newWidthNE))

                const newTopNE = Math.max(validArea.top, mouseY)
                if (newHeightNE >= minSize && newTopNE >= validArea.top) {
                    newBounds.height = newBounds.height + (newBounds.top - newTopNE)
                    newBounds.top = newTopNE
                }
                break
            case "nw": // Noroeste
                const deltaNwW = newBounds.left - mouseX
                const deltaNwN = newBounds.top - mouseY
                const newWidthNW = newBounds.width + deltaNwW
                const newHeightNW = newBounds.height + deltaNwN

                const newLeftNW = Math.max(validArea.left, mouseX)
                const newTopNW = Math.max(validArea.top, mouseY)

                if (newWidthNW >= minSize && newLeftNW >= validArea.left) {
                    newBounds.width = newBounds.width + (newBounds.left - newLeftNW)
                    newBounds.left = newLeftNW
                }
                if (newHeightNW >= minSize && newTopNW >= validArea.top) {
                    newBounds.height = newBounds.height + (newBounds.top - newTopNW)
                    newBounds.top = newTopNW
                }
                break
            case "se": // Sudeste
                const newWidthSE = mouseX - newBounds.left
                const newHeightSE = mouseY - newBounds.top
                const maxAllowedWidthSE = Math.min(validArea.right - newBounds.left, validArea.width)
                const maxAllowedHeightSE = Math.min(validArea.bottom - newBounds.top, validArea.height)
                newBounds.width = Math.max(minSize, Math.min(maxAllowedWidthSE, newWidthSE))
                newBounds.height = Math.max(minSize, Math.min(maxAllowedHeightSE, newHeightSE))
                break
            case "sw": // Sudoeste
                const deltaSwW = newBounds.left - mouseX
                const newWidthSW = newBounds.width + deltaSwW
                const newHeightSW = mouseY - newBounds.top

                const newLeftSW = Math.max(validArea.left, mouseX)
                if (newWidthSW >= minSize && newLeftSW >= validArea.left) {
                    newBounds.width = newBounds.width + (newBounds.left - newLeftSW)
                    newBounds.left = newLeftSW
                }
                const maxAllowedHeightSW = Math.min(validArea.bottom - newBounds.top, validArea.height)
                newBounds.height = Math.max(minSize, Math.min(maxAllowedHeightSW, newHeightSW))
                break
        }

        setOverlayBounds(newBounds)
    }

    const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isResizingSignature || !signatureImage || !resizeDirection) return

        e.preventDefault()

        // Calcular a área válida do PDF dinamicamente
        const validArea = calculateValidPDFArea(e.currentTarget)

        // Posição atual do mouse relativa ao container
        const mouseX = e.clientX - e.currentTarget.getBoundingClientRect().left
        const mouseY = e.clientY - e.currentTarget.getBoundingClientRect().top

        // Limites mínimos e máximos para o tamanho da assinatura
        const minWidth = 50
        const minHeight = 25
        const maxWidth = 300
        const maxHeight = 150

        // Cálculos específicos para cada direção de redimensionamento
        let newWidth = signatureSize.width
        let newHeight = signatureSize.height
        let newX = signaturePosition.x
        let newY = signaturePosition.y

        switch (resizeDirection) {
            case "e": // Leste (direita)
                newWidth = Math.max(minWidth, Math.min(maxWidth, mouseX - signaturePosition.x))
                // Garantir que não ultrapasse os limites da área válida
                newWidth = Math.min(newWidth, validArea.right - signaturePosition.x)
                break

            case "s": // Sul (abaixo)
                newHeight = Math.max(minHeight, Math.min(maxHeight, mouseY - signaturePosition.y))
                // Garantir que não ultrapasse os limites da área válida
                newHeight = Math.min(newHeight, validArea.bottom - signaturePosition.y)
                break

            case "se": // Sudeste (canto inferior direito)
                newWidth = Math.max(minWidth, Math.min(maxWidth, mouseX - signaturePosition.x))
                newHeight = Math.max(minHeight, Math.min(maxHeight, mouseY - signaturePosition.y))
                // Garantir que não ultrapasse os limites da área válida
                newWidth = Math.min(newWidth, validArea.right - signaturePosition.x)
                newHeight = Math.min(newHeight, validArea.bottom - signaturePosition.y)
                break

            case "w": // Oeste (esquerda)
                const widthChange = signaturePosition.x - mouseX
                newWidth = Math.max(minWidth, Math.min(maxWidth, signatureSize.width + widthChange))
                newX = signaturePosition.x - (newWidth - signatureSize.width)
                // Garantir que não ultrapasse os limites da área válida
                if (newX < validArea.left) {
                    newX = validArea.left
                    newWidth = signaturePosition.x + signatureSize.width - validArea.left
                }
                break

            case "n": // Norte (acima)
                const heightChange = signaturePosition.y - mouseY
                newHeight = Math.max(minHeight, Math.min(maxHeight, signatureSize.height + heightChange))
                newY = signaturePosition.y - (newHeight - signatureSize.height)
                // Garantir que não ultrapasse os limites da área válida
                if (newY < validArea.top) {
                    newY = validArea.top
                    newHeight = signaturePosition.y + signatureSize.height - validArea.top
                }
                break

            case "nw": // Noroeste (canto superior esquerdo)
                const widthChangeNW = signaturePosition.x - mouseX
                const heightChangeNW = signaturePosition.y - mouseY
                newWidth = Math.max(minWidth, Math.min(maxWidth, signatureSize.width + widthChangeNW))
                newHeight = Math.max(minHeight, Math.min(maxHeight, signatureSize.height + heightChangeNW))
                newX = signaturePosition.x - (newWidth - signatureSize.width)
                newY = signaturePosition.y - (newHeight - signatureSize.height)
                // Garantir que não ultrapasse os limites da área válida
                if (newX < validArea.left) {
                    newX = validArea.left
                    newWidth = signaturePosition.x + signatureSize.width - validArea.left
                }
                if (newY < validArea.top) {
                    newY = validArea.top
                    newHeight = signaturePosition.y + signatureSize.height - validArea.top
                }
                break

            case "ne": // Nordeste (canto superior direito)
                newWidth = Math.max(minWidth, Math.min(maxWidth, mouseX - signaturePosition.x))
                const heightChangeNE = signaturePosition.y - mouseY
                newHeight = Math.max(minHeight, Math.min(maxHeight, signatureSize.height + heightChangeNE))
                newY = signaturePosition.y - (newHeight - signatureSize.height)
                // Garantir que não ultrapasse os limites da área válida
                newWidth = Math.min(newWidth, validArea.right - signaturePosition.x)
                if (newY < validArea.top) {
                    newY = validArea.top
                    newHeight = signaturePosition.y + signatureSize.height - validArea.top
                }
                break

            case "sw": // Sudoeste (canto inferior esquerdo)
                const widthChangeSW = signaturePosition.x - mouseX
                newWidth = Math.max(minWidth, Math.min(maxWidth, signatureSize.width + widthChangeSW))
                newHeight = Math.max(minHeight, Math.min(maxHeight, mouseY - signaturePosition.y))
                newX = signaturePosition.x - (newWidth - signatureSize.width)
                // Garantir que não ultrapasse os limites da área válida
                if (newX < validArea.left) {
                    newX = validArea.left
                    newWidth = signaturePosition.x + signatureSize.width - validArea.left
                }
                newHeight = Math.min(newHeight, validArea.bottom - signaturePosition.y)
                break
        }

        // Atualizar posição e tamanho da assinatura
        setSignaturePosition(prev => ({
            ...prev,
            x: newX,
            y: newY
        }))

        setSignatureSize({
            width: newWidth,
            height: newHeight
        })
    }

    const moveSignature = (e: React.MouseEvent<HTMLDivElement>) => {
        // Lidar com o redimensionamento do overlay se estiver acontecendo
        if (isResizingOverlay) {
            handleOverlayResize(e)
            return
        }

        // Lidar com o redimensionamento se estiver acontecendo
        if (isResizingSignature && signatureImage) {
            handleResize(e)
            return
        }

        // Lidar com o arrastar se estiver acontecendo
        if (isDraggingSignature && signatureImage) {
            e.preventDefault()

            // Calcular a área válida do PDF dinamicamente
            const validArea = calculateValidPDFArea(e.currentTarget)

            // Calcular a nova posição com base na posição do mouse e nos offsets salvos no estado
            let newX = e.clientX - e.currentTarget.getBoundingClientRect().left - dragOffset.x
            let newY = e.clientY - e.currentTarget.getBoundingClientRect().top - dragOffset.y

            // Garantir que a assinatura permaneça dentro da área válida do PDF
            newX = Math.max(validArea.left, Math.min(newX, validArea.right - signatureSize.width))
            newY = Math.max(validArea.top, Math.min(newY, validArea.bottom - signatureSize.height))

            // Atualizar a posição da assinatura
            setSignaturePosition(prev => ({
                ...prev,
                x: newX,
                y: newY,
                page: currentPdfPage
            }))
        }
    }

    // Função para aplicar a assinatura ao PDF usando pdf-lib
    const applySignatureToPDF = async (
        pdfBase64Data: string,
        signatureImageData: string,
        position: { x: number, y: number, page: number }
    ) => {
        try {
            // Remover prefixo de data URL do PDF se existir
            const pdfBase64Clean = pdfBase64Data.replace(/^data:application\/pdf;base64,/, '')
            const pdfBytes = base64ToUint8Array(pdfBase64Clean)

            // Carregar o documento PDF
            const pdfDoc = await PDFDocument.load(pdfBytes)

            // Verificar se a página existe
            const pageIndex = position.page - 1
            if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) {
                throw new Error(`Página inválida: ${position.page}. O documento tem ${pdfDoc.getPageCount()} páginas.`)
            }

            // Obter a página onde a assinatura será inserida
            const page = pdfDoc.getPage(pageIndex)

            // Dimensões da página
            const { width, height } = page.getSize()

            // Remover prefixo de data URL da imagem
            const signatureImageClean = signatureImageData.replace(/^data:image\/(png|jpeg|jpg|gif);base64,/, '')

            // Incorporar a imagem da assinatura no PDF
            const signatureImage = await pdfDoc.embedPng(base64ToUint8Array(signatureImageClean))

            // Calcular a posição exata com base na visualização
            // Isso requer ajustes, pois a coordenada do clique na visualização
            // não corresponde exatamente à coordenada no PDF

            // Dimensões da imagem da assinatura (usar o tamanho atual definido pelo usuário)
            const signatureWidth = Math.min(signatureSize.width, width / 4) // Limitar à largura máxima do PDF
            // Calcular a altura para manter a proporção da imagem original
            const aspectRatio = signatureImage.height / signatureImage.width
            const signatureHeight = signatureWidth * aspectRatio

            // Converter coordenadas da visualização para o PDF
            // Esta é uma conversão mais precisa usando as dimensões reais do conteúdo PDF
            const containerRect = iframeRef.current?.parentElement?.getBoundingClientRect() || { left: 0, top: 0 }
            const pdfRect = pdfContentRect || { left: containerRect.left, top: containerRect.top, width, height }

            // Calcular a posição relativa dentro do PDF
            const pdfLeft = pdfRect.left - containerRect.left
            const pdfTop = pdfRect.top - containerRect.top

            // Calcular a posição normalizada (0-1)
            const normalizedX = (position.x - pdfLeft) / pdfRect.width
            const normalizedY = (position.y - pdfTop) / pdfRect.height

            // Aplicar a posição normalizada às dimensões reais do PDF
            const pdfX = normalizedX * width
            // No PDF, o eixo Y começa na parte inferior, enquanto na tela começa no topo
            const pdfY = height - (normalizedY * height) - signatureHeight            // Desenhar a imagem da assinatura na página
            page.drawImage(signatureImage, {
                x: pdfX,
                y: pdfY,
                width: signatureWidth,
                height: signatureHeight,
            })

            // Adicionar metadados sobre a assinatura
            pdfDoc.setTitle(`${pdfDoc.getTitle() || 'Documento'} (Assinado)`)

            // Salvar o PDF modificado
            const modifiedPdfBytes = await pdfDoc.save()

            // Converter de volta para base64
            const modifiedPdfBase64 = uint8ArrayToBase64(modifiedPdfBytes)

            // Retornar o PDF modificado com prefixo data URL
            return `data:application/pdf;base64,${modifiedPdfBase64}`
        } catch (error) {
            console.error('Erro ao aplicar assinatura ao PDF:', error)
            throw error
        }
    }

    const saveSignedPDF = async () => {
        if (!signatureImage || !onSave) return

        // Mostrar indicador de carregamento enquanto processamos
        setIsLoading(true)
        setSignatureError(null)

        console.log('Preparando PDF com assinatura na posição:', signaturePosition)

        try {
            // Aplicar a assinatura ao PDF usando pdf-lib
            const signedPdfDataUrl = await applySignatureToPDF(
                pdfBase64,
                signatureImage,
                signaturePosition
            )

            // Salvar o PDF assinado no estado
            setSignedPdfBase64(signedPdfDataUrl)

            // Enviar o PDF assinado para o callback
            onSave(signedPdfDataUrl)

            // Sair do modo de assinatura
            setIsLoading(false)
            setIsSignatureMode(false)

            console.log('PDF assinado com sucesso!')
        } catch (error) {
            console.error('Erro ao processar assinatura:', error)
            setSignatureError(`Erro ao aplicar assinatura: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
            setIsLoading(false)
        }
    }

    if (!isClient) {
        return (
            <div className={`${className} flex items-center justify-center`} style={{ height }}>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!pdfBase64) {
        return (
            <div className={`${className} text-center p-8 border border-red-300 rounded-lg bg-red-50`}>
                <div className="text-red-500">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="font-semibold">PDF não disponível</p>
                </div>
            </div>
        )
    }

    const containerClasses = isFullScreen || height === '100%'
        ? twMerge(
            `${className} w-full h-full`,
            isDark ? 'bg-gray-900' : 'bg-white'
        )
        : twMerge(
            `${className} border rounded-lg overflow-hidden shadow-lg`,
            isDark
                ? 'border-gray-700 bg-gray-800'
                : 'border-gray-300 bg-white'
        )

    const viewportHeight = isFullScreen || height === '100%'
        ? '95vh' // 95% da viewport height para modal full - deixa espaço para visualizar melhor
        : `calc(${height} + 20px)` // Adiciona 20px extra para garantir visualização completa

    // const _toggleFullScreen = () => {
    //     setIsFullScreen(!isFullScreen)
    // }

    // Determinar qual PDF exibir (original ou assinado)
    const pdfToDisplay = signedPdfBase64 || pdfBase64

    // Certificar-se que o PDF tem o prefixo data URL correto
    const pdfDataUrl = pdfToDisplay.startsWith('data:')
        ? pdfToDisplay
        : `data:application/pdf;base64,${pdfToDisplay}`

    return (
        <div className={containerClasses}>
            <div className={twMerge(
                'px-4 py-3 border-b flex justify-between items-center',
                isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-100 border-gray-200'
            )}>
                <div className="flex items-center gap-2">
                    <svg className={twMerge(
                        'w-5 h-5',
                        isDark ? 'text-red-400' : 'text-red-600'
                    )} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                    <span className={twMerge(
                        'font-medium',
                        isDark ? 'text-gray-200' : 'text-gray-700'
                    )}>{fileName}</span>
                    <span className={twMerge(
                        'text-xs',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                        ({Math.round(pdfBase64.length / 1024)} KB)
                        {pdfPageCount > 1 && ` • ${pdfPageCount} páginas`}
                        {signedPdfBase64 && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Assinado
                            </span>
                        )}
                    </span>
                </div>

                <div className="flex gap-2">
                    {/* Botão de Assinatura */}
                    {/*                     {onSave && (
                        <button
                            onClick={toggleSignatureMode}
                            className={twMerge(
                                'px-3 py-1 text-sm rounded transition-colors flex items-center gap-1',
                                isSignatureMode
                                    ? isDark
                                        ? 'bg-green-700 text-white'
                                        : 'bg-green-600 text-white'
                                    : isDark
                                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                                        : 'bg-purple-500 text-white hover:bg-purple-600'
                            )}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            {isSignatureMode ? 'Modo Assinatura Ativo' : 'Assinar'}
                        </button>
                    )} */}

                    {/* Botão de Editar - apenas se onEdit foi fornecido */}
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className={twMerge(
                                'px-3 py-1 text-sm rounded transition-colors flex items-center gap-1',
                                isDark
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            )}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (onClose) {
                                onClose()
                            } else {
                                setIsFullScreen(false)
                            }
                        }}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Fechar
                    </button>
                </div>
            </div>

            {/* Área do PDF */}
            <div className={twMerge(
                'relative',
                isDark ? 'bg-gray-900' : 'bg-gray-100'
            )} style={{ height: viewportHeight }}>
                {isLoading && (
                    <div className={twMerge(
                        'absolute inset-0 flex items-center justify-center z-10',
                        isDark ? 'bg-gray-900' : 'bg-gray-50'
                    )}>
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className={twMerge(
                                'text-sm',
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            )}>Carregando PDF...</p>
                        </div>
                    </div>
                )}

                {!showFallback ? (
                    <div
                        className="w-full h-full overflow-auto relative"
                        onClick={isSignatureMode ? handleSignaturePosition : undefined}
                        onMouseMove={isSignatureMode ? moveSignature : undefined}
                        onMouseUp={isSignatureMode ? stopDragging : undefined}
                        onMouseLeave={isSignatureMode ? stopDragging : undefined}
                        style={{ cursor: isSignatureMode ? (signatureImage ? 'default' : 'crosshair') : 'default' }}
                    >
                        <iframe
                            ref={iframeRef}
                            src={pdfDataUrl}
                            title={fileName}
                            className="w-full border-none"
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            style={{
                                display: isLoading ? 'none' : 'block',
                                background: isDark ? '#1f2937' : '#f9fafb',
                                height: isFullScreen || height === '100%' ? '95vh' : 'max(100%, 800px)', // 95vh para modal
                                minHeight: '100%'
                            }}
                            allow="fullscreen"
                            loading="lazy"
                        />

                        {/* Overlay para assinatura */}
                        {isSignatureMode && (
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                {/* Indicador visual da área de assinatura - agora redimensionável */}
                                <div
                                    className="absolute border-2 border-dashed border-blue-400 dark:border-blue-600 bg-blue-100/20 dark:bg-blue-900/20 pointer-events-auto"
                                    style={{
                                        left: `${overlayBounds.left}px`,
                                        top: `${overlayBounds.top}px`,
                                        width: `${overlayBounds.width}px`,
                                        height: `${overlayBounds.height}px`,
                                        zIndex: 5
                                    }}
                                >
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 pointer-events-none">
                                        Área de assinatura - Página {signaturePosition.page}
                                    </div>

                                    {/* Controles de redimensionamento do overlay */}
                                    {/* Cantos */}
                                    <div
                                        className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize pointer-events-auto"
                                        style={{ transform: 'translate(-50%, -50%)' }}
                                        onMouseDown={(e) => startOverlayResize(e, "nw")}
                                    />
                                    <div
                                        className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize pointer-events-auto"
                                        style={{ transform: 'translate(50%, -50%)' }}
                                        onMouseDown={(e) => startOverlayResize(e, "ne")}
                                    />
                                    <div
                                        className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize pointer-events-auto"
                                        style={{ transform: 'translate(-50%, 50%)' }}
                                        onMouseDown={(e) => startOverlayResize(e, "sw")}
                                    />
                                    <div
                                        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize pointer-events-auto"
                                        style={{ transform: 'translate(50%, 50%)' }}
                                        onMouseDown={(e) => startOverlayResize(e, "se")}
                                    />

                                    {/* Bordas */}
                                    <div
                                        className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-n-resize pointer-events-auto"
                                        style={{ transform: 'translate(-50%, -50%)' }}
                                        onMouseDown={(e) => startOverlayResize(e, "n")}
                                    />
                                    <div
                                        className="absolute right-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-e-resize pointer-events-auto"
                                        style={{ transform: 'translate(50%, -50%)' }}
                                        onMouseDown={(e) => startOverlayResize(e, "e")}
                                    />
                                    <div
                                        className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-s-resize pointer-events-auto"
                                        style={{ transform: 'translate(-50%, 50%)' }}
                                        onMouseDown={(e) => startOverlayResize(e, "s")}
                                    />
                                    <div
                                        className="absolute left-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-w-resize pointer-events-auto"
                                        style={{ transform: 'translate(-50%, -50%)' }}
                                        onMouseDown={(e) => startOverlayResize(e, "w")}
                                    />
                                </div>                                {/* Painel de controle da assinatura */}
                                <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg pointer-events-auto z-10">
                                    <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
                                        Modo Assinatura
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Carregar imagem de assinatura
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleSignatureUpload}
                                                className="block w-full text-sm text-gray-500 dark:text-gray-400
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                file:dark:bg-blue-900/20 file:dark:text-blue-300
                                                hover:file:bg-blue-100"
                                            />
                                        </div>

                                        {pdfPageCount > 1 && (
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                    Página para assinatura: {signaturePosition.page} de {pdfPageCount}
                                                </label>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSignaturePosition(prev => ({
                                                            ...prev,
                                                            page: Math.max(1, prev.page - 1)
                                                        }))}
                                                        disabled={signaturePosition.page <= 1}
                                                        className={`px-2 py-1 rounded ${signaturePosition.page <= 1
                                                            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                            }`}
                                                    >
                                                        Anterior
                                                    </button>
                                                    <button
                                                        onClick={() => setSignaturePosition(prev => ({
                                                            ...prev,
                                                            page: Math.min(pdfPageCount, prev.page + 1)
                                                        }))}
                                                        disabled={signaturePosition.page >= pdfPageCount}
                                                        className={`px-2 py-1 rounded ${signaturePosition.page >= pdfPageCount
                                                            ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                            }`}
                                                    >
                                                        Próxima
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                            {signatureError ? (
                                                <p className="text-sm text-red-500 mb-2">
                                                    Erro: {signatureError}. Por favor tente novamente.
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                        {isLoading && signatureImage ?
                                                            "Processando assinatura..." :
                                                            isDraggingSignature ?
                                                                "Solte para posicionar a assinatura..." :
                                                                "Posicione a assinatura clicando ou arrastando dentro da área delimitada do documento."}
                                                    </p>
                                                    <p className="text-xs text-amber-500 dark:text-amber-400">
                                                        Nota: A assinatura só pode ser posicionada na área visível do PDF.
                                                    </p>
                                                </>
                                            )}
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={saveSignedPDF}
                                                    disabled={!signatureImage || isLoading}
                                                    className={twMerge(
                                                        "px-4 py-2 rounded text-white font-medium flex items-center gap-2",
                                                        signatureImage && !isLoading
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-gray-400 cursor-not-allowed"
                                                    )}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Processando...
                                                        </>
                                                    ) : (
                                                        "Salvar Assinatura"
                                                    )}
                                                </button>
                                                <button
                                                    onClick={toggleSignatureMode}
                                                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Imagem da assinatura */}
                                {signatureImage && (
                                    <div
                                        className="absolute cursor-move signature-draggable signature-container"
                                        style={{
                                            left: `${signaturePosition.x}px`,
                                            top: `${signaturePosition.y}px`,
                                            width: `${signatureSize.width}px`,
                                            height: `${signatureSize.height}px`,
                                            pointerEvents: 'auto',
                                            zIndex: 50,
                                            position: 'absolute'
                                        }}
                                        onMouseDown={startDragging}
                                    >
                                        {/* Imagem da assinatura */}
                                        <img
                                            src={signatureImage}
                                            alt="Assinatura"
                                            className="w-full h-full object-contain"
                                            draggable="false"
                                        />

                                        {/* Controles de redimensionamento */}
                                        <div className="absolute top-0 left-0 w-full h-full border-2 border-blue-500 pointer-events-none" />

                                        {/* Alças de redimensionamento nos cantos */}
                                        <div
                                            className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize"
                                            style={{ transform: 'translate(-50%, -50%)' }}
                                            onMouseDown={(e) => startResizing(e, "nw")}
                                        />
                                        <div
                                            className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize"
                                            style={{ transform: 'translate(50%, -50%)' }}
                                            onMouseDown={(e) => startResizing(e, "ne")}
                                        />
                                        <div
                                            className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize"
                                            style={{ transform: 'translate(-50%, 50%)' }}
                                            onMouseDown={(e) => startResizing(e, "sw")}
                                        />
                                        <div
                                            className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"
                                            style={{ transform: 'translate(50%, 50%)' }}
                                            onMouseDown={(e) => startResizing(e, "se")}
                                        />

                                        {/* Alças de redimensionamento nas bordas */}
                                        <div
                                            className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-n-resize"
                                            style={{ transform: 'translate(-50%, -50%)' }}
                                            onMouseDown={(e) => startResizing(e, "n")}
                                        />
                                        <div
                                            className="absolute right-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-e-resize"
                                            style={{ transform: 'translate(50%, -50%)' }}
                                            onMouseDown={(e) => startResizing(e, "e")}
                                        />
                                        <div
                                            className="absolute bottom-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-s-resize"
                                            style={{ transform: 'translate(-50%, 50%)' }}
                                            onMouseDown={(e) => startResizing(e, "s")}
                                        />
                                        <div
                                            className="absolute left-0 top-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-w-resize"
                                            style={{ transform: 'translate(-50%, -50%)' }}
                                            onMouseDown={(e) => startResizing(e, "w")}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={twMerge(
                        'flex items-center justify-center h-full',
                        isDark ? 'bg-gray-900' : 'bg-gray-50'
                    )}>
                        <div className="text-center p-8">
                            <svg className={twMerge(
                                'w-16 h-16 mx-auto mb-4',
                                isDark ? 'text-gray-500' : 'text-gray-400'
                            )} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <h3 className={twMerge(
                                'text-lg font-semibold mb-2',
                                isDark ? 'text-gray-200' : 'text-gray-700'
                            )}>
                                Visualização não suportada
                            </h3>
                            <p className={twMerge(
                                'text-sm mb-4',
                                isDark ? 'text-gray-400' : 'text-gray-600'
                            )}>
                                Seu navegador não conseguiu exibir o PDF inline
                            </p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={openInNewWindow}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Abrir em Nova Janela
                                </button>
                                <button
                                    onClick={downloadPDF}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Rodapé com informações - apenas quando não estiver em tela cheia */}
            {!isFullScreen && (
                <div className={twMerge(
                    'px-4 py-2 border-t',
                    isDark
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                )}>
                    <p className={twMerge(
                        'text-xs text-center',
                        isDark ? 'text-gray-400' : 'text-gray-500'
                    )}>
                        💡 Se o PDF não carregar corretamente, use os botões &quot;Nova Janela&quot; ou &quot;Download&quot;
                    </p>
                </div>
            )}
        </div>
    )
}
