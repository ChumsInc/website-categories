/**
 * Created by steve on 1/11/2017.
 */

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Modal extends Component {
    static propTypes = {
        title: PropTypes.string,
        body: PropTypes.any,
        footer: PropTypes.any,
        size: PropTypes.oneOf(['sm', 'md', 'lg']),
        onClose: PropTypes.func.isRequired,
        renderFooter: PropTypes.func,
    };

    static defaultProps = {
        title: '',
        size: 'md',
    };

    state = {
        show: false,
    };

    constructor(props) {
        super(props);
        // this.handleClickOutside = this.handleClickOutside.bind(this);
        this.backdropRef = createRef();
        this.close = this.close.bind(this);
        this.onClickInside = this.onClickInside.bind(this);
        this.listenEscape = this.listenEscape.bind(this);
        this.onClickOutside = this.onClickOutside.bind(this);
    }

    componentDidMount() {
        const backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop', 'fade', 'show');
        document.addEventListener('keydown', this.listenEscape);
        document.body.appendChild(backdrop);
        setTimeout(() => {
            this.setState({show: true});
        }, 0);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.listenEscape);
        const [el] = document.getElementsByClassName('modal-backdrop');
        if (el) {
            el.remove();
        }
    }

    listenEscape(ev) {
        if (ev.code === 'Escape') {
            ev.preventDefault();
            this.close();
        }
    }

    close(ev) {
        console.trace('Modal.close() called', ev.target, ev.movementX, ev.movementY);
        this.setState({show: false}, () => {
            setTimeout(this.props.onClose, 150);
            const [el] = document.getElementsByClassName('modal-backdrop');
            if (el) {
                el.classList.remove('show');
            }
        })
    }

    onClickOutside(ev) {
        if (ev.target.className === 'modal fade show') {
            this.close(ev);
        }
    }

    onClickInside(ev) {
        ev.stopPropagation();
        // really, this does nothing but stop it from propagating to the parent objects
    }

    render() {
        const {title, body, footer, children, size} = this.props;
        const {show} = this.state;
        const dialogClassName = {
            'modal-dialog': true,
            'modal-sm': size === 'sm',
            'modal-lg': size === 'lg',
        };

        return (
            <div className={classNames("modal fade", {show})} role="dialog" tabIndex={-1} style={{display: 'block'}}
                 onMouseDown={this.onClickOutside} ref={this.backdropRef}>
                <div className={classNames(dialogClassName)} role="document" onClick={this.onClickInside}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="close" aria-label="Close" onClick={this.close}>
                                <span aria-hidden={true}>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {children || body || 'Content is missing'}
                        </div>
                        {!!footer && <div className="modal-footer">{footer}</div>}
                    </div>
                </div>
            </div>
        )
    }
}


