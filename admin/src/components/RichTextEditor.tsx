'use client';

import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Strikethrough,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import './tiptap-styles.css';
import { UrlInputModal } from './UrlInputModal';
import { bricolage } from '@/app/fonts';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter text...',
  className = '',
  height = 400,
  disabled = false,
}: RichTextEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [urlModal, setUrlModal] = useState<{ isOpen: boolean; type: string }>({ isOpen: false, type: 'link' });
  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastContentRef = useRef<string>(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const currentContent = editor.getHTML();
      const sanitizedContent = DOMPurify.sanitize(currentContent);

      if (sanitizedContent === lastContentRef.current) {
        return;
      }

      lastContentRef.current = sanitizedContent;

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        onChange(sanitizedContent);
      }, 500);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        placeholder: placeholder,
      },
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (editor && value !== lastContentRef.current) {
      editor.commands.setContent(value);
      lastContentRef.current = value;
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    setUrlModal({ isOpen: true, type: 'link' });
  }, []);

  const handleUrlSubmit = useCallback(
    (url: string) => {
      if (url) {
        editor?.chain().focus().setLink({ href: url }).run();
      }
      setUrlModal({ isOpen: false, type: 'link' });
    },
    [editor],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  if (!isClient) {
    return (
      <div
        className="border rounded-lg animate-pulse bg-gray-50"
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleBold().run();
          }}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive('bold')
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleItalic().run();
          }}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive('italic')
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleStrike().run();
          }}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive('strike')
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        {/* Headings */}
        <select
          onChange={(e) => {
            const level = e.target.value;
            if (level) {
              const levelNum = parseInt(level);
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: levelNum as 1 | 2 | 3 | 4 | 5 | 6 })
                .run();
            } else {
              editor?.chain().focus().setParagraph().run();
            }
          }}
          disabled={!editor || disabled}
          className="px-2 py-1 rounded text-sm border border-gray-300 bg-white text-gray-700"
        >
          <option value="">Normal</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>

        {/* Lists */}
        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleBulletList().run();
          }}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive('bulletList')
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleOrderedList().run();
          }}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive('orderedList')
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Links */}
        <button
          type="button"
          onClick={setLink}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive('link')
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Link className="w-4 h-4" />
        </button>
      </div>

      <EditorContent
        editor={editor}
        className={`prose max-w-none p-4 min-h-[300px] focus:outline-none`}
        style={{ height: height - 50, overflow: 'auto' }}
      />

      <UrlInputModal
        isOpen={urlModal.isOpen}
        onClose={() => setUrlModal({ isOpen: false, type: 'link' })}
        onSubmit={handleUrlSubmit}
      />
    </div>
  );
}
