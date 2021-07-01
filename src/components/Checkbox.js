import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FormGroup from "./FormGroup";
import TextInput from "./TextInput";



export default class Checkbox extends PureComponent {
    static propTypes = {
        type: PropTypes.oneOf(['checkbox', 'radio']),
        label: PropTypes.string,
        checked: PropTypes.bool,
        inline: PropTypes.bool,

        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        type: 'checkbox',
        label: '',
        checked: false,
        inline: false,
    };

    render() {
        const {type, label, checked, inline, onChange} = this.props;
        const containerClassname = {
            'form-check': true,
            'form-check-inline': inline,
            'position-static': !label,

        };
        return (
            <div className={classNames(containerClassname)}>
                <input type={type} className="form-check-input" onChange={onChange} checked={checked}/>
                <label className="form-check-label" onClick={onChange}>{label}</label>
            </div>
        );
    }
}
