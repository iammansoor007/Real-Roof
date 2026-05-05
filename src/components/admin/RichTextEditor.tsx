"use client";

import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, 
  Heading3, Heading4, Heading5, Heading6, RemoveFormatting, 
  Type, AlignLeft, AlignCenter, AlignRight, Code, Info
} from "lucide-react";
import MediaSelector from "./MediaSelector";
import DOMPurify from "dompurify";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
  showStatusBar?: boolean;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  title 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean; 
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded transition-all ${
      isActive 
        ? "bg-[#2271b1] text-white" 
        : "text-[#50575e] hover:bg-[#f0f0f1] hover:text-[#1d2327]"
    } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

export default function RichTextEditor({ content, onChange, placeholder, label, showStatusBar }: RichTextEditorProps) {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#2271b1] hover:underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Safe sanitize helper for Next.js interop
      const purify = (DOMPurify as any).default || DOMPurify;
      const sanitizedHtml = (purify && typeof purify.sanitize === "function") 
        ? purify.sanitize(html) 
        : html;
      onChange(sanitizedHtml);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-[14px] text-[#1d2327] bg-white',
      },
    },
  });

  // Update content if it changes externally (e.g. on initial load)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!mounted || !editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    let finalUrl = url;
    if (url && !url.startsWith('http') && !url.startsWith('/') && !url.startsWith('#') && !url.startsWith('mailto:')) {
      // If it contains a dot and doesn't start with a slash/hash, it's likely an external domain
      if (url.includes('.')) {
        finalUrl = `https://${url}`;
      }
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
  };

  const addImage = (media: any) => {
    if (media && media.url) {
      editor.chain().focus().setImage({ src: media.url, alt: media.alt || media.name }).run();
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="text-[13px] font-bold text-[#1d2327]">{label}</label>}
      <div className="border border-[#c3c4c7] rounded-sm bg-white overflow-hidden focus-within:border-[#2271b1] focus-within:ring-1 focus-within:ring-[#2271b1] transition-all">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-1 border-b border-[#c3c4c7] bg-[#f6f7f7]">
          <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-[#dcdcde]">
            <MenuButton 
              title="Heading 1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
            >
              <Heading1 className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
            >
              <Heading2 className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
              title="Heading 3"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
            >
              <Heading3 className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
              title="Heading 4"
              onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
              isActive={editor.isActive('heading', { level: 4 })}
            >
              <Heading4 className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-[#dcdcde]">
            <MenuButton 
              title="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
            >
              <Bold className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
              title="Italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
            >
              <Italic className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
              title="Underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
            >
              <UnderlineIcon className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-[#dcdcde]">
            <MenuButton 
              title="Bullet List"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
            >
              <List className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
              title="Ordered List"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
            >
              <ListOrdered className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-[#dcdcde]">
            <MenuButton 
              title="Link"
              onClick={setLink}
              isActive={editor.isActive('link')}
            >
              <LinkIcon className="w-4 h-4" />
            </MenuButton>
            <MenuButton 
              title="Insert Image"
              onClick={() => setIsMediaOpen(true)}
            >
              <ImageIcon className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex items-center gap-0.5">
            <MenuButton 
              title="Clear Formatting"
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
            >
              <RemoveFormatting className="w-4 h-4" />
            </MenuButton>
          </div>

          <div className="flex items-center gap-0.5 ml-auto pl-2 border-l border-[#dcdcde]">
            <MenuButton 
              title="Content Structure Overview"
              onClick={() => setShowOverview(!showOverview)}
              isActive={showOverview}
            >
              <Info className="w-4 h-4" />
            </MenuButton>
          </div>
        </div>

        {/* Editor Area & Sidebar */}
        <div className="relative flex items-stretch border-b border-[#c3c4c7] last:border-0">
          <div className={`relative flex-1 ${showOverview ? 'border-r border-[#c3c4c7]' : ''}`}>
            <EditorContent editor={editor} />
            {editor.isEmpty && (
              <div className="absolute top-3 left-4 pointer-events-none text-[#8c8f94] text-[14px]">
                {placeholder || "Start writing..."}
              </div>
            )}
          </div>

          {showOverview && (
            <div className="w-64 bg-[#f6f7f7] flex-shrink-0 flex flex-col">
              <div className="p-3 border-b border-[#dcdcde] bg-white sticky top-0 z-10 flex justify-between items-center">
                 <span className="font-bold text-[11px] text-[#646970] uppercase tracking-wider">Document Structure</span>
                 <div className="text-[10px] text-[#8c8f94] font-medium">
                   {editor.state.doc.textContent.length} chars
                 </div>
              </div>
              <div className="p-3 overflow-y-auto max-h-[400px] space-y-4">
                {(() => {
                  let counts = { h1:0, h2:0, h3:0, h4:0, h5:0, h6:0, p:0, ul:0, ol:0 };
                  const structure: { id: string, name: string, level?: number, pos: number, text: string }[] = [];
                  
                  editor.state.doc.descendants((node, pos) => {
                    if (node.type.name === 'heading') {
                      counts[`h${node.attrs.level}` as keyof typeof counts]++;
                      structure.push({ id: `h-${pos}`, name: 'heading', level: node.attrs.level, pos, text: node.textContent });
                    }
                    if (node.type.name === 'paragraph') counts.p++;
                    if (node.type.name === 'bulletList') counts.ul++;
                    if (node.type.name === 'orderedList') counts.ol++;
                  });

                  return (
                    <>
                      <div className="grid grid-cols-2 gap-2 text-[12px] text-[#50575e] bg-white p-2 border border-[#dcdcde] rounded-[3px]">
                        <div><strong className="text-[#1d2327]">H1-H6:</strong> {counts.h1+counts.h2+counts.h3+counts.h4+counts.h5+counts.h6}</div>
                        <div><strong className="text-[#1d2327]">Paragraphs:</strong> {counts.p}</div>
                        <div><strong className="text-[#1d2327]">Lists:</strong> {counts.ul + counts.ol}</div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-[11px] font-bold text-[#646970] uppercase mb-2">Outline</h4>
                        {structure.length === 0 ? (
                          <div className="text-[12px] text-[#8c8f94] italic">No headings found.</div>
                        ) : (
                          structure.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                editor.chain().focus().setTextSelection(item.pos).run();
                                const element = editor.view.nodeDOM(item.pos) as HTMLElement;
                                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }}
                              className="w-full text-left flex flex-col gap-0.5 p-1.5 rounded hover:bg-[#e6f0fa] transition-colors group"
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold bg-[#d2e3f7] text-[#2271b1] px-1 py-0.5 rounded">H{item.level}</span>
                                <span className="text-[12px] text-[#1d2327] font-medium truncate group-hover:text-[#2271b1]">{item.text || 'Empty Heading'}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Status Bar / Tag Timeline */}
        {showStatusBar && editor && (
          <div className="sticky bottom-0 z-[40] flex items-center gap-1.5 px-3 py-1.5 bg-[#f6f7f7] border-t border-[#c3c4c7] overflow-x-auto no-scrollbar shadow-[0_-2px_5px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] font-bold text-[#646970] uppercase shrink-0 border-r border-[#c3c4c7] pr-2 mr-0.5">Path</span>
            <div className="flex items-center gap-1">
              {(() => {
                const tags: { name: string, pos: number, id: string, level?: number }[] = [];
                editor.state.doc.forEach((node, pos) => {
                  tags.push({ 
                    name: node.type.name, 
                    pos, 
                    id: `${node.type.name}-${pos}`,
                    level: node.type.name === 'heading' ? node.attrs.level : undefined
                  });
                });

                // Find active node index
                const { from } = editor.state.selection;
                let activeIndex = -1;
                for (let i = 0; i < tags.length; i++) {
                  const nextPos = (i < tags.length - 1) ? tags[i+1].pos : editor.state.doc.content.size;
                  if (from >= tags[i].pos && from < nextPos) {
                    activeIndex = i;
                    break;
                  }
                }

                return tags.map((tag, idx) => (
                  <React.Fragment key={tag.id}>
                    {idx > 0 && <span className="text-[#c3c4c7] text-[10px]">»</span>}
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setTextSelection(tag.pos).run();
                        const element = editor.view.nodeDOM(tag.pos) as HTMLElement;
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`text-[11px] whitespace-nowrap px-1 rounded transition-colors ${
                        idx === activeIndex 
                          ? "bg-[#2271b1] text-white font-bold" 
                          : "text-[#2271b1] hover:underline hover:bg-[#2271b1]/5"
                      }`}
                    >
                      {tag.name === 'heading' ? `H${tag.level}` : tag.name.toUpperCase()}
                    </button>
                  </React.Fragment>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      {isMediaOpen && (
        <MediaSelector 
          onClose={() => setIsMediaOpen(false)}
          onSelect={(media) => {
            addImage(media);
            setIsMediaOpen(false);
          }}
          title="Select Image for Content"
        />
      )}

      {/* Global Tiptap Styles */}
      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          outline: none !important;
          padding-bottom: 50px !important; /* Space for sticky bar */
        }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, 
        .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 { 
          position: relative;
        }

        /* Heading Indicators */
        .ProseMirror h1:hover::before, .ProseMirror h1.ProseMirror-selectednode::before, .ProseMirror h1:focus-within::before { content: 'H1'; }
        .ProseMirror h2:hover::before, .ProseMirror h2.ProseMirror-selectednode::before, .ProseMirror h2:focus-within::before { content: 'H2'; }
        .ProseMirror h3:hover::before, .ProseMirror h3.ProseMirror-selectednode::before, .ProseMirror h3:focus-within::before { content: 'H3'; }
        .ProseMirror h4:hover::before, .ProseMirror h4.ProseMirror-selectednode::before, .ProseMirror h4:focus-within::before { content: 'H4'; }
        .ProseMirror h5:hover::before, .ProseMirror h5.ProseMirror-selectednode::before, .ProseMirror h5:focus-within::before { content: 'H5'; }
        .ProseMirror h6:hover::before, .ProseMirror h6.ProseMirror-selectednode::before, .ProseMirror h6:focus-within::before { content: 'H6'; }

        .ProseMirror h1::before, .ProseMirror h2::before, .ProseMirror h3::before,
        .ProseMirror h4::before, .ProseMirror h5::before, .ProseMirror h6::before {
          position: absolute;
          left: -45px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          font-family: monospace;
          font-weight: bold;
          color: #2271b1;
          background: #f0f6fb;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid #d2e3f7;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .ProseMirror h1:hover::before, .ProseMirror h2:hover::before, .ProseMirror h3:hover::before,
        .ProseMirror h4:hover::before, .ProseMirror h5:hover::before, .ProseMirror h6:hover::before,
        .ProseMirror h1:focus-within::before, .ProseMirror h2:focus-within::before, .ProseMirror h3:focus-within::before,
        .ProseMirror h4:focus-within::before, .ProseMirror h5:focus-within::before, .ProseMirror h6:focus-within::before {
          opacity: 1;
        }

        .ProseMirror h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror h3 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror h4 { font-size: 1.1em; font-weight: bold; margin-bottom: 0.5em; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .ProseMirror a { color: #2271b1; text-decoration: underline; }
        .ProseMirror blockquote { border-left: 3px solid #dcdcde; padding-left: 1em; font-style: italic; margin-bottom: 1em; }
      `}</style>
    </div>
  );
}
