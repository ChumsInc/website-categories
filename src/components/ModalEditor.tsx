import React, {useEffect, useState} from 'react';
import {Modal} from "chums-components";
import Editor from '@monaco-editor/react';

interface ModalEditorProps {
    title: string,
    content: string,
    onClose: (content: string) => void,
    onCancel: () => void,
}

const ModalEditor = ({title, content, onClose, onCancel}: ModalEditorProps) => {
    const [html, setHTML] = useState(content || '');
    useEffect(() => {
        setHTML(content);
    }, [content]);

    return (
        <Modal onClose={onClose} size="lg" title={title}>
            <Editor language="html" height="75vh"
            options={{wordWrap: 'on'}}
                    value={html} onChange={(value => setHTML(value ?? ''))}/>
            <div>
                <button onClick={() => onClose(html)} className="btn btn-sm btn-primary me-1">Close / Apply Changes
                </button>
                <button onClick={() => onCancel()} className="btn btn-sm btn-secondary">Cancel</button>
            </div>
        </Modal>
    )
};

export default ModalEditor;
