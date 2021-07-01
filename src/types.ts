export type BootstrapColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'body';
export type BootstrapBGColor = BootstrapColor | 'transparent';
export type BootstrapTextColor = BootstrapColor | 'muted' | 'white' | 'black-50' | 'white-50';

export interface BasicAlert {
    title?: string,
    message?: string,
    context?: string,
    color?: BootstrapColor,
    className?: string | object,
    canDismiss?: boolean,
}

export type BootstrapSize = 'xs'|'sm'|'md'|'lg'|'xl';

export interface Tab {
    id: string,
    title: string,
    canClose?: boolean,
    disabled?: boolean,
    active?: boolean,
}
