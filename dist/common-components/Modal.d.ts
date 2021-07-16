import React from "react";
import { BootstrapSize } from "../types";
export interface ModalProps {
    title?: string;
    size?: BootstrapSize;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    canClose?: boolean;
    scrollable?: boolean;
    centered?: boolean;
    staticBackdrop?: boolean;
    dialogClassName?: string | object;
    visible?: boolean;
    onClose?: () => void;
}
declare const Modal: React.FC<ModalProps>;
export default Modal;
