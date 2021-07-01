import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import {dismissAlertAction, selectAlertList} from "./index";
import Alert from "../../common-components/Alert";


export interface Props {
    context?: string,
}

const AlertList: React.FC<Props> = ({context}) => {
    const dispatch = useDispatch();
    const list = useSelector(selectAlertList).filter(alert => !context || alert.context === context).sort((a,b) => b.timestamp - a.timestamp);
    const dismissHandler = (id: number) => dispatch(dismissAlertAction(id));
    return (
        <div>
            {list.map(alert => (
                    <Alert key={alert.id}
                           color={alert.color} message={alert.message} className={alert.className}
                           context={!!context ? undefined : alert.context} count={alert.count} title={alert.title}
                           onDismiss={() => dismissHandler(alert.id)}/>
                )
            )}
        </div>
    )
}

export default AlertList;
