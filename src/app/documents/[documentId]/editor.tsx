"use client"
import {EditorContent, useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image';
import Underline from '@tiptap/extension-underline'
import FontFamily from '@tiptap/extension-font-family'
import Text from '@tiptap/extension-text'
import TextStyle from '@tiptap/extension-text-style'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import {FontSizeExtension}from "@/extensions/font-size"
import {LineHeightExtension}from "@/extensions/line-height"
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";




import React from 'react'
import { useEditorStore } from "@/store/use-editor-store"
import {Ruler} from "./ruler"
import { Threads } from "./threads"
import { useStorage } from "@liveblocks/react"
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins"





type Props = {
  initialContent?:string | undefined
}

const Editor = ({initialContent}: Props) => {
  const leftMargin=useStorage((root)=>root.leftMargin)??LEFT_MARGIN_DEFAULT;
  const rightMargin=useStorage((root)=>root.rightMargin)?? RIGHT_MARGIN_DEFAULT;

  const liveblocks = useLiveblocksExtension({
    initialContent,
    offlineSupport_experimental:true
  });
    const {setEditor}=useEditorStore()
    const editor=useEditor({
      immediatelyRender:false,
        onCreate({editor}) {
            setEditor(editor)
            
        },
        onDestroy() {
            
            setEditor(null)
        },
        onUpdate({editor}) {
            setEditor(editor)
            
        },
        onSelectionUpdate({editor}) {
            setEditor(editor)

            
        },
        onTransaction({editor}) {
            setEditor(editor)
            
        },
        onFocus({editor}) {
            setEditor(editor)
            
        },
        
        onBlur({editor}) {
            setEditor(editor)
            
        },
        onContentError({editor}) {
            setEditor(editor)
            
        },
        editorProps:{
            attributes:{
                style:`padding-left:${leftMargin}px; padding-right:${rightMargin}px;`,
                class:"focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pb-10 cursor-text pr-14"
            }


        },
        extensions: [
          
          liveblocks,
            StarterKit.configure({
              history:false
              
            }),
            FontSizeExtension,
         
            LineHeightExtension.configure({
              types:["heading","paragraph"],
              defaultLineHeight:"normal"
            }),
            Table,
            TableCell,
            TableHeader,
            TableRow,
            Image,
            ImageResize,
            Underline,
            FontFamily,
            Text,
            TextStyle,
            Heading,
            ListItem,
            BulletList,
            TextAlign.configure({
              types: ['heading', 'paragraph'],

            }),
            Link.configure({
              openOnClick:false,
              autolink:true,
              defaultProtocol:"https",
            }),
            Highlight.configure({
              multicolor:true
            }),
            Color,
            TaskItem.configure({
                nested:true
            }),
            TaskList
        ],
     
    })
  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler/>
        <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor}/>
        <Threads editor={editor}/>
        </div>
        
    </div>
  )
}

export default Editor