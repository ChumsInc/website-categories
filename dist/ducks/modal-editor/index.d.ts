import { ActionInterface } from "../types";
import { RootState } from "../index";
export interface ModalEditorState {
    title: string;
    content: string;
    visible: boolean;
}
export interface ModalEditorAction extends ActionInterface {
    payload?: {
        title?: string;
        content?: string;
        visible?: boolean;
    };
}
export declare const defaultModalEditorState: ModalEditorState;
export declare const setModalEditor = "modalEditor/setEditor";
export declare const setModalEditorTitle = "modalEditor/setTitle";
export declare const setModalEditorContent = "modalEditor/setContent";
export declare const setModalEditorVisibility = "modalEditor/setVisibility";
export declare const setModalEditorAction: (title: string, content: string) => ModalEditorAction;
export declare const setModalEditorTitleAction: (title: string) => ModalEditorAction;
export declare const setModalEditorContentAction: (content: string) => ModalEditorAction;
export declare const setModalEditorVisibilityAction: (visible: boolean) => ModalEditorAction;
export declare const meTitleSelector: (state: RootState) => string;
export declare const meContentSelector: (state: RootState) => string;
export declare const meVisibleSelector: (state: RootState) => boolean;
declare const _default: import("redux").Reducer<import("redux").CombinedState<{
    title: string;
    content: string;
    visible: boolean;
}>, ModalEditorAction>;
export default _default;
