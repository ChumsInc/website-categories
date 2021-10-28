import React, {useEffect, useState} from 'react';
import {Modal} from "chums-ducks";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";

interface ModalEditorProps {
    title: string,
    content: string,
    onClose: (content: string) => void,
    onCancel: () => void,
}

const ModalEditor: React.FC<ModalEditorProps> = ({title, content, onClose, onCancel}) => {
    const [html, setHTML] = useState(content || '');
    useEffect(() => {
        setHTML(content);
    }, [content]);

    return (
        <Modal onClose={onClose} size="lg" title={title}>
            <AceEditor mode="html" value={html} tabSize={4} wrapEnabled width="100%"
                       onChange={(value => setHTML(value))}/>
            <div>
                <button onClick={() => onClose(html)} className="btn btn-sm btn-primary me-1">Close / Apply Changes</button>
                <button onClick={() => onCancel()} className="btn btn-sm btn-secondary">Cancel</button>
            </div>
        </Modal>
    )
};

export default ModalEditor;
