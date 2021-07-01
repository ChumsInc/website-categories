import React from "react";
import ProgressBar from "./ProgressBar";
import Modal, {ModalProps} from "./Modal";
import Progress from "./Progress";
import {BootstrapColor} from "../types";

export interface LoadingModalProps extends ModalProps {
    title?: string,
    percent?: number,
    color?: BootstrapColor,
}

const LoadingModal: React.FC<LoadingModalProps> = ({
                                                       title = 'Loading',
                                                       percent = 100,
                                                       color = 'secondary',
                                                       canClose = false,
                                                       ...rest
                                                   }) => {
    return (
        <Modal title={title} canClose={canClose} {...rest}>
            <Progress>
                <ProgressBar value={percent} animated color={color}/>
            </Progress>
        </Modal>
    )
}
export default LoadingModal;
