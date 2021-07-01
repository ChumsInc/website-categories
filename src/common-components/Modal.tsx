import React, {createRef, KeyboardEvent, MouseEvent, useEffect, useState} from "react";
import classNames from "classnames";
import {BootstrapSize} from "../types";


const noop = () => {
};

export interface ModalProps {
    title?: string,
    size?: BootstrapSize,
    header?: React.ReactNode,
    footer?: React.ReactNode,
    canClose?: boolean,
    scrollable?: boolean,
    centered?: boolean,
    staticBackdrop?: boolean,
    dialogClassName?: string | object,
    visible?: boolean,
    onClose?: () => void,
}

const Modal: React.FC<ModalProps> = ({
                                         title,
                                         size = 'md',
                                         header,
                                         footer,
                                         canClose = true,
                                         scrollable,
                                         centered,
                                         staticBackdrop,
                                         dialogClassName,
                                         visible = true,
                                         onClose = noop,
                                         children,
                                     }) => {
    const modalRef = createRef<HTMLDivElement>()
    let fadeTimer: number = 0;
    const [showModal, setShowModal] = useState(false);
    const [display, setDisplay] = useState(visible ? 'block' : 'none');

    useEffect(() => {
        if (visible) {
            delayShowingModal();
        } else {
            delayClose();
        }
    }, [visible]);


    const showBackdrop = (state: boolean) => {
        document.querySelector('.modal-backdrop')?.classList.toggle('show', state)
    }

    const closeHandler = (ev?: MouseEvent) => {
        if (!canClose) {
            return;
        }
        if (ev) {
            ev.preventDefault();
        }
        delayClose();
    }

    const onClickBackdrop = (ev: MouseEvent<HTMLElement>) => {
        const target = ev.target as HTMLElement;
        if (!staticBackdrop && target && target.classList.contains('modal')) {
            closeHandler();
        }
    }


    const onEscape = (ev: KeyboardEvent<HTMLElement>) => {
        if (ev.key === 'Escape') {
            closeHandler();
        }
    }

    const delayShowingModal = () => {
        setDisplay('block');
        document.querySelectorAll('body').forEach(body => {
            body.classList.toggle('modal-open', true);
            const div = document.createElement('div');
            div.className = 'modal-backdrop fade';
            body.appendChild(div);
        });
        clearTimeout(fadeTimer);
        fadeTimer = window.setTimeout(() => {
            showBackdrop(true);
            setShowModal(true);
        }, 300)
    }

    const delayClose = () => {
        clearTimeout(fadeTimer);
        setShowModal(false);
        showBackdrop(false);
        fadeTimer = window.setTimeout(() => {
            document.querySelector('.modal-backdrop')?.remove();
            document.querySelector('body')?.classList.toggle('modal-open', false);
            setDisplay('none');
            onClose();
        }, 300)
    }

    useEffect(() => {
        return () => {
            clearTimeout(fadeTimer);
            document.querySelector('body')?.classList.toggle('modal-open', false);
            document.querySelector('.modal-backdrop')?.remove();
        }
    }, [])

    useEffect(() => {
        if (showModal) {
            modalRef.current?.focus();
        }
    }, [showModal]);

    const className = {
        'modal-dialog-scrollable': scrollable,
        'modal-dialog-centered': centered,
    }
    return (
        <div className={classNames("modal fade", {show: showModal})} tabIndex={-1} ref={modalRef}
             style={{display: display}} onClick={onClickBackdrop} onKeyDown={onEscape}>
            <div className={classNames("modal-dialog", `modal-${size}`, className, dialogClassName)}>
                <div className="modal-content">
                    {!!header && header}
                    {!header && (!!title || canClose) && (
                        <div className="modal-header">
                            <h5 className="modal-title">{title || 'Modal Title'}</h5>
                            {canClose && (
                                <button type="button" className="btn-close" onClick={closeHandler} aria-label="Close"/>
                            )}
                        </div>
                    )}
                    <div className="modal-body">
                        {children || 'modal body goes here'}
                    </div>
                    {!!footer && footer}
                </div>
            </div>
        </div>
    )
}

export default Modal;
