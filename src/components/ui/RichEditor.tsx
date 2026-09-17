"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Link as LinkIcon,
  Undo,
  Redo,
  Quote,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Code,
  Code2,
  Minus,
  RemoveFormatting,
  Pilcrow,
  Palette,
} from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  toolbarTopOffset?: number;
}

const RichEditor = ({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = 240,
  toolbarTopOffset = 0,
}: RichEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rich-editor-content focus:outline-none",
        style: `min-height: ${minHeight}px; padding: 16px;`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className="border border-gray-200 rounded-lg bg-gray-50"
        style={{ minHeight: minHeight + 50 }}
      />
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg bg-white">
        {/* Sticky Toolbar */}
        <div
          className="flex flex-wrap gap-0.5 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg sticky z-20 shadow-sm"
          style={{ top: `${toolbarTopOffset}px` }}
        >
          {/* ─── Paragraph / Headings ─── */}
          <ToolButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editor.isActive("paragraph")}
            icon={Pilcrow}
            title="Paragraph"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            title="Heading 1"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            title="Heading 2"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            title="Heading 3"
          />
          <ToolButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 4 }).run()
            }
            active={editor.isActive("heading", { level: 4 })}
            icon={Heading4}
            title="Heading 4"
          />

          <Divider />

          {/* ─── Inline Formatting ─── */}
          <ToolButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            icon={Bold}
            title="Bold (Ctrl+B)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            icon={Italic}
            title="Italic (Ctrl+I)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            icon={UnderlineIcon}
            title="Underline (Ctrl+U)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            icon={Strikethrough}
            title="Strikethrough"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            icon={Highlighter}
            title="Highlight"
          />
          <label
            title="Text color"
            className="inline-flex items-center gap-1 px-1.5 py-1 rounded cursor-pointer text-gray-600 hover:bg-gray-200"
          >
            <Palette size={16} />
            <input
              type="color"
              aria-label="Text color"
              value={editor.getAttributes("textStyle").color || "#111827"}
              onChange={(event) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
              className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer"
            />
          </label>
          <button
            type="button"
            title="Reset text color"
            className="px-1.5 py-1 text-[11px] rounded text-gray-600 hover:bg-gray-200 cursor-pointer"
            onClick={() => editor.chain().focus().unsetColor().run()}
          >
            Reset
          </button>
          <ToolButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            icon={Code}
            title="Inline Code"
          />

          <Divider />

          {/* ─── Alignment ─── */}
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            title="Align Left"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            title="Align Center"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            icon={AlignRight}
            title="Align Right"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            icon={AlignJustify}
            title="Justify"
          />

          <Divider />

          {/* ─── Lists & Blocks ─── */}
          <ToolButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            icon={List}
            title="Bullet List"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            icon={ListOrdered}
            title="Numbered List"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            icon={Quote}
            title="Blockquote"
          />
          <ToolButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            icon={Code2}
            title="Code Block"
          />

          <Divider />

          {/* ─── Insert ─── */}
          <ToolButton
            onClick={setLink}
            active={editor.isActive("link")}
            icon={LinkIcon}
            title="Insert Link"
          />
          <ToolButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={Minus}
            title="Horizontal Line"
          />

          <Divider />

          {/* ─── Utils ─── */}
          <ToolButton
            onClick={clearFormatting}
            icon={RemoveFormatting}
            title="Clear Formatting"
          />
          <ToolButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={Undo}
            title="Undo (Ctrl+Z)"
          />
          <ToolButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={Redo}
            title="Redo (Ctrl+Y)"
          />
        </div>

        {/* Editor Content */}
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </>
  );
};

const ToolButton = ({
  onClick,
  active,
  disabled,
  icon: Icon,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  icon: typeof Bold;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-1.5 rounded transition-colors cursor-pointer ${
      active
        ? "text-white"
        : disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-600 hover:bg-gray-200"
    }`}
    style={active ? { backgroundColor: "#C70A24" } : undefined}
  >
    <Icon size={16} />
  </button>
);

const Divider = () => <div className="w-px bg-gray-300 mx-1 my-0.5" />;

export default RichEditor;
