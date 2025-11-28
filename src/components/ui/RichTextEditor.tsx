'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useTheme } from '@/contexts/ThemeContext'
import { 
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Quote, Undo, Redo
} from 'lucide-react'

interface RichTextEditorProps {
    value: string
    onChange: (html: string) => void
    placeholder?: string
    disabled?: boolean
}

const MenuButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children,
    title
}: { 
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
}) => {
    const { isDark } = useTheme()
    
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded transition-colors ${
                isActive 
                    ? isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'
                    : isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    )
}

export const RichTextEditor = ({ value, onChange, placeholder = 'Digite aqui...', disabled = false }: RichTextEditorProps) => {
    const { isDark } = useTheme()

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value,
        editable: !disabled,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: `prose max-w-none focus:outline-none min-h-[200px] p-4 ${
                    isDark ? 'prose-invert' : ''
                }`,
            },
        },
    })

    // Update content if value changes externally (e.g. loading template)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if content is different to avoid cursor jumping
            // But for templates replacing everything, it's fine
            if (Math.abs(editor.getText().length - value.replace(/<[^>]*>/g, '').length) > 5 || value === '') {
                 editor.commands.setContent(value)
            }
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    return (
        <div className={`border rounded-lg overflow-hidden ${
            isDark ? 'border-gray-700 bg-gray-900/50' : 'border-gray-200 bg-white'
        } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
            {/* Toolbar */}
            <div className={`flex flex-wrap gap-1 p-2 border-b ${
                isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'
            }`}>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Negrito"
                >
                    <Bold className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Itálico"
                >
                    <Italic className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Sublinhado"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Tachado"
                >
                    <Strikethrough className="w-4 h-4" />
                </MenuButton>

                <div className={`w-px h-6 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Alinhar à Esquerda"
                >
                    <AlignLeft className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Centralizar"
                >
                    <AlignCenter className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Alinhar à Direita"
                >
                    <AlignRight className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    title="Justificar"
                >
                    <AlignJustify className="w-4 h-4" />
                </MenuButton>

                <div className={`w-px h-6 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Lista com Marcadores"
                >
                    <List className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Lista Numerada"
                >
                    <ListOrdered className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Citação"
                >
                    <Quote className="w-4 h-4" />
                </MenuButton>

                <div className={`w-px h-6 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Desfazer"
                >
                    <Undo className="w-4 h-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Refazer"
                >
                    <Redo className="w-4 h-4" />
                </MenuButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    )
}
