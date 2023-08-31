import React from 'react';
import {FallbackProps} from "react-error-boundary";
import {Alert} from "chums-components";

const ErrorFallbackComponent = (arg:FallbackProps) => {
    return (
        <Alert color="danger">
            <strong>Oops, something went wrong.</strong>
            <p>{arg.error}</p>
        </Alert>
    )
}

export default ErrorFallbackComponent;
