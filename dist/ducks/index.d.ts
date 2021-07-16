declare const rootReducer: import("redux").Reducer<import("redux").CombinedState<{
    alerts: import("chums-ducks/dist/ducks").AlertListState;
    pages: import("chums-ducks/dist/ducks").PageState;
    tabs: import("chums-ducks/dist/ducks").TabsState;
    sites: import("redux").CombinedState<{
        selected: import("chums-ducks/dist/ducks").Site;
    }>;
    keywords: import("redux").CombinedState<{
        list: import("./types").Keyword[];
        loading: boolean;
    }>;
    categories: import("redux").CombinedState<{
        showInactive: boolean;
        filter: string;
        loading: boolean;
        list: import("./types").Category[];
        selected: import("./types").Category;
    }>;
    items: import("redux").CombinedState<{
        list: import("./types").Item[];
        selected: never;
        loading: boolean;
        savingItem: boolean;
        savingSort: boolean;
    }>;
    sortableTables: import("chums-ducks/dist/ducks").SortableTablesState;
    modalEditor: import("redux").CombinedState<{
        title: string;
        content: string;
        visible: boolean;
    }>;
}>, import("chums-ducks/dist/ducks").SiteAction | import("./keywords").KeywordAction | import("./categories").CategoryAction | import("./items").ItemsAction | import("./modal-editor").ModalEditorAction | import("chums-ducks/dist/ducks").AlertAction | import("chums-ducks/dist/ducks").PageAction | import("chums-ducks/dist/ducks").TabAction | import("chums-ducks/dist/ducks").SortableTablesAction>;
export declare type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
