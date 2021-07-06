import React from 'react';
import Modal from "./Modal";
// import {Controlled as CodeMirror} from "react-codemirror2";


require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');
require('codemirror/theme/neat.css');
require('codemirror/mode/xml/xml.js');

const ModalEditor = ({field, value, onChange, onClose}) => {
    const title = `Edit field: ${field}`;
    const handleChange = (editor, data, value) => {
        onChange({field, value});
    };

    return (<Modal onClose={(ev) => onClose(ev)} size="lg" title={title}>
        {/*<CodeMirror value={value} onBeforeChange={handleChange}*/}
        {/*            options={{lineNumbers: true, lineWrapping: true}}/>*/}
    </Modal>)
};

export default ModalEditor;
