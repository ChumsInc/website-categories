import React from 'react';
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-github";
interface ModalEditorProps {
    title: string;
    content: string;
    onClose: (content: string) => void;
    onCancel: () => void;
}
declare const ModalEditor: React.FC<ModalEditorProps>;
export default ModalEditor;
