import {combineReducers} from "redux";
import {ActionInterface} from "../types";
import {RootState} from "../index";

export interface ModalEditorState {
    title: string,
    content: string,
    visible: boolean,
}

export interface ModalEditorAction extends ActionInterface {
    payload?: {
        title?: string,
        content?: string,
        visible?: boolean,
    }
}
export const defaultModalEditorState:ModalEditorState = {
    title: '',
    content: '',
    visible: false,
}

export const setModalEditor = 'modalEditor/setEditor';
export const setModalEditorTitle = 'modalEditor/setTitle';
export const setModalEditorContent = 'modalEditor/setContent';
export const setModalEditorVisibility = 'modalEditor/setVisibility';

export const setModalEditorAction = (title:string, content:string):ModalEditorAction => ({type: setModalEditor, payload: {title, content}});
export const setModalEditorTitleAction = (title:string):ModalEditorAction => ({type: setModalEditor, payload: {title}});
export const setModalEditorContentAction = (content:string):ModalEditorAction => ({type: setModalEditor, payload: {content}});
export const setModalEditorVisibilityAction = (visible: boolean):ModalEditorAction => ({type: setModalEditorVisibility, payload: {visible}});

export const meTitleSelector = (state:RootState) => state.modalEditor.title;
export const meContentSelector = (state:RootState) => state.modalEditor.content;
export const meVisibleSelector = (state:RootState) => state.modalEditor.visible;

const titleReducer = (state: string = '', action:ModalEditorAction):string => {
    const {type, payload} = action;
    switch (type) {
    case setModalEditor:
    case setModalEditorTitle:
        return payload?.title || '';
    default: return state;
    }
}

const contentReducer = (state: string  = '', action:ModalEditorAction):string => {
    const {type, payload} = action;
    switch (type) {
    case setModalEditor:
    case setModalEditorContent:
        return payload?.content || '';
    default: return state;
    }
}

const visibleReducer = (state:boolean = false, action: ModalEditorAction):boolean => {
    const {type, payload} = action;
    switch (type) {
    case setModalEditor:
        return true;
    case setModalEditorVisibility:
        return payload?.visible || false;
    default: return state;
    }
}

export default combineReducers({
    title: titleReducer,
    content: contentReducer,
    visible: visibleReducer,
})

