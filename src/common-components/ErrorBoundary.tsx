import React, {Component} from 'react';
import Alert from "./Alert";


export default class ErrorBoundary extends Component {

    state = {
        hasError: false,
        componentStack: '',
        message: '',
    }

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(error:Error, errorInfo:any) {
        this.setState({componentStack: errorInfo.componentStack, message: error.message});
    }

    render() {
        const {hasError, componentStack, message} = this.state;
        if (hasError) {
            return (
                <>
                    <h1>Sorry! something went wrong!</h1>
                    <Alert color="danger">{message}</Alert>
                    <code className="pre">
                        <pre style={{whiteSpace: 'pre-wrap'}}>
                            {componentStack}
                        </pre>
                    </code>
                </>
            )
        }
        return this.props.children;
    }
}
