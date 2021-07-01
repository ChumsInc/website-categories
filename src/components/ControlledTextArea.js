import React from 'react';
import TextArea from "react-textarea-autosize";

const ControlledTextArea = ({field, value, onChange, maxRows, ...props}) => {
    const handleChange = (ev) => {
        onChange({field, value: ev.target.value});
    };

    return (
        <TextArea onChange={handleChange}  value={value} maxRows={maxRows}
                  className="form-control form-control-sm" {...props}/>
    )
};

export default ControlledTextArea;
