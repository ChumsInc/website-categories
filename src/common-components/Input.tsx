import React, {
    ChangeEvent,
    FocusEvent,
    InputHTMLAttributes,
    RefObject,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import classNames from "classnames";
import debounce from 'lodash.debounce'
import {getRegex} from "../utils/regex";

const noop = () => {
};

export interface InputProps extends InputHTMLAttributes<any> {
    bsSize?: 'sm' | 'lg',
    myRef?: RefObject<HTMLInputElement>,
    wait?: number,
    fuzzyList?: boolean
}

const Input: React.FC<InputProps> = ({
                                         bsSize = 'sm',
                                         wait,
                                         fuzzyList,
                                         myRef,
                                         type = 'text',
                                         className,
                                         value,
                                         onChange = noop,
                                         onBlur,
                                         ...rest
                                     }) => {

    let _debounced: ReturnType<typeof debounce> | undefined;
    const delayedChange = useCallback(debounce((ev: ChangeEvent<HTMLInputElement>) => {
        console.log('useCallback (debounced)', ev.target, ev.target.value)
        onChange(ev)
    }, wait), []);
    const inputRef = useRef<HTMLInputElement>(null);

    const [localValue, setLocalValue] = useState(String(value || '') || '');

    useEffect(() => {
        return () => {
            _debounced?.cancel();
        }
    }, []);

    const inputClassName = {
        'form-control': true,
        [`form-control-${bsSize}`]: !!bsSize,
    }

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setLocalValue(ev.target.value)
        if (!!rest.list && fuzzyList) {
            if (!!myRef && myRef.current) {
                myRef.current.pattern = getRegex(ev.target.value).source;
                return;
            }
            if (inputRef.current) {
                inputRef.current.pattern = getRegex(ev.target.value).source;
            }
        }
        delayedChange(ev);
    }

    const blurHandler = (ev: FocusEvent<HTMLInputElement>) => {
        _debounced?.flush();
        if (onBlur) {
            onBlur(ev);
        }
    }

    return (
        <input type={type}
               className={classNames(inputClassName, className)}
               value={localValue || ''}
               // onInput={changeHandler}
               onBlur={blurHandler}
               onChange={changeHandler}
               ref={myRef || inputRef} {...rest} />
    )
}
export default Input;
