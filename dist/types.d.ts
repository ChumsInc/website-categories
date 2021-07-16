export declare type BootstrapColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'body';
export declare type BootstrapBGColor = BootstrapColor | 'transparent';
export declare type BootstrapTextColor = BootstrapColor | 'muted' | 'white' | 'black-50' | 'white-50';
export interface BasicAlert {
    title?: string;
    message?: string;
    context?: string;
    color?: BootstrapColor;
    className?: string | object;
    canDismiss?: boolean;
}
export declare type BootstrapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
