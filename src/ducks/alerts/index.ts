import {RootStateOrAny} from "react-redux";
import {ActionInterface} from "../types";
import {BasicAlert} from "../../types";

export const alertAdded: string = 'app/alerts/alertAdded';
export const alertDismissed: string = 'app/alerts/alertDismissed';
export const alertDismissedByContext: string = 'app/alerts/alertDismissedByContext';

export interface Alert extends BasicAlert {
    id: number,
    count: number,
    timestamp: number,
}

export const defaultAlert:BasicAlert = {
    canDismiss: true,
    color: "danger"
}

export interface AlertListState {
    counter: number,
    list: Alert[],
}

export interface AlertAction extends ActionInterface {
    payload: {
        id?: number,
        alert?: BasicAlert,
        context?: string,
        error?: Error,
    }
}

export const addAlertAction = (alert: BasicAlert): AlertAction =>
    ({
        type: alertAdded,
        payload: {
            alert: {
                ...defaultAlert,
                ...alert,
            }
        }
    });

const buildAlert = (err: Error, context?: string):BasicAlert => ({message: err.message, title: err.name, context, color: 'danger'});

export const dismissAlertAction = (id: number): AlertAction => ({type: alertDismissed, payload: {id}})
export const dismissContextAlert = (context:string): AlertAction => ({type: alertDismissedByContext, payload: {context}})

export const onErrorAction = (err: Error, context?: string): AlertAction =>
    addAlertAction(buildAlert(err, context));


export const selectAlertList = (state: RootStateOrAny): Alert[] => state.alerts.list;
export const alertContextFilter = (list:Alert[], context:string):Alert[] => {
    return list.filter(al => al.context === context);
}


const initialState: AlertListState = {counter: 0, list: []}

const alertIDSort = (a:Alert, b:Alert) => a.id - b.id;


const alertReducer = (state: AlertListState = initialState, action: AlertAction): AlertListState => {
    const {type, payload} = action;
    const {counter, list} = state;
    let {alert, error, context} = payload || {};
    if (error && !alert) {
        alert = buildAlert(error, context);
    }
    switch (type) {
    case alertAdded: {
        if (!alert) {
            return state;
        }
        const context = alert.context;
        const [contextAlert] = context ? alertContextFilter(list, context) : [];
        if (!contextAlert) {
            return {
                counter: counter + 1,
                list: [
                    ...list,
                    {...alert, id: counter, count: 1, timestamp: new Date().valueOf()}
                ].sort(alertIDSort)
            };
        }
        return {
            counter,
            list: [
                ...list.filter(alert => alert.id !== contextAlert.id),
                ...list.filter(alert => alert.id === contextAlert.id)
                    .map(alert => {
                        return {
                            ...alert,
                            ...payload.alert,
                            count: alert.count + 1,
                            timestamp: new Date().valueOf()
                        }
                    }),
            ].sort(alertIDSort),
        }
    }
    case alertDismissed:
        if (payload.id === undefined) {
            return state;
        }
        return {
            counter,
            list: [...list.filter(alert => alert.id !== payload.id)].sort(alertIDSort)
        }
    case alertDismissedByContext:
        if (!payload.context) {
            return state;
        }
        return {
            counter,
            list: [...list.filter(alert => alert.context !== payload.context)].sort(alertIDSort)
        }
    default:
        return state;
    }
}
export default alertReducer;

