"use client"
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';


// 여러 게시판(공지사항/문의 등)에서 공용으로 사용하는 QuillEditor 컴포넌트의 props
export interface QuillEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    readOnly?: boolean;
}

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="w-full h-100 pc:h-200 bg-surface rounded-lg animate-pulse" />
})

export default function QuillEditor({ value, onChange, placeholder = "내용을 입력해주세요.", readOnly = false }: QuillEditorProps) {

    const modules = useMemo(() => ({
        toolbar: readOnly
            ? false
            : [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ],
    }), [readOnly]);

    return (
        <ReactQuill
            theme="snow"
            className={readOnly ? "notice-editor notice-editor-readonly" : "notice-editor"}
            value={value}
            onChange={onChange}
            modules={modules}
            placeholder={placeholder}
            readOnly={readOnly}
        />

    );
}