"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

interface BlogEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Typography,
      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none min-h-[400px] p-4 focus:outline-none prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-img:rounded-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg",
      },
    },
  });

  const setLink = useCallback(() => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageInput(false);
    }
  }, [editor, imageUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 border-b border-border">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("bold") ? "bg-muted text-primary" : ""
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("italic") ? "bg-muted text-primary" : ""
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("heading", { level: 1 }) ? "bg-muted text-primary" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("heading", { level: 2 }) ? "bg-muted text-primary" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("heading", { level: 3 }) ? "bg-muted text-primary" : ""
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("bulletList") ? "bg-muted text-primary" : ""
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("orderedList") ? "bg-muted text-primary" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("blockquote") ? "bg-muted text-primary" : ""
          }`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-muted transition ${
            editor.isActive("code") ? "bg-muted text-primary" : ""
          }`}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-2 rounded hover:bg-muted transition ${
              editor.isActive("link") ? "bg-muted text-primary" : ""
            }`}
            title="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          {showLinkInput && (
            <div className="absolute top-full left-0 z-10 mt-1 p-2 bg-card border border-border rounded-lg shadow-lg flex gap-2">
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="px-2 py-1 text-sm rounded border border-input bg-background"
              />
              <button
                type="button"
                onClick={setLink}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className="p-2 rounded hover:bg-muted transition"
            title="Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          {showImageInput && (
            <div className="absolute top-full left-0 z-10 mt-1 p-2 bg-card border border-border rounded-lg shadow-lg flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
                className="px-2 py-1 text-sm rounded border border-input bg-background"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          )}
        </div>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-muted transition disabled:opacity-30"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-muted transition disabled:opacity-30"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
