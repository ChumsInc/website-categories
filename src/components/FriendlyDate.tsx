import React from 'react';

export interface FriendlyDateProps {
    date: Date|string|number|null;
}

const halfDay = 12 * 60 * 60 * 1000;
/**
 *
 * @param {Date|number|string} value
 * @return {string|null}
 */
function friendlyDate(value:Date|number|string|null) {
    if (!value) {
        return null;
    }
    const now = new Date();
    const date = new Date(value);
    if (now.valueOf() - date.valueOf() > halfDay) {
        if (now.getFullYear() === date.getFullYear()) {
            return date.toLocaleDateString(undefined, {month: '2-digit', day: '2-digit'});
        }
        return date.toLocaleDateString();
    }
    return date.toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'});
}

const FriendlyDate:React.FC<FriendlyDateProps> = ({date}) => {
    if (!date) {
        return null;
    }
    const d = friendlyDate(date);
    if (!d) {
        return null;
    }
    return (
        <>{d}</>
    )
}

export default FriendlyDate;
