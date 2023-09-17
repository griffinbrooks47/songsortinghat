import { useState, useRef } from "react"
import { CSSTransition } from "react-transition-group"
import "./subnav.css"

export const Subnav = (props) => {
    return (
        <ul className="subnav">
            {props.children}
        </ul>
    )
}

export const SubnavItem = (props) => {

    const [nameState, setNameState] = useState(true);

    const nodeRef = useRef(null)

    const toggleName = () => {
        setNameState(!nameState)
        props.function()
    }

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={nameState}
            timeout={100}
            classNames="subnav-item"
        >
            <li className="subnav-item" ref={nodeRef}>
                <a className="subnav-item-tag" onClick={toggleName}>
                    {nameState ? props.primary : props.secondary}
                </a>
            </li>
        </CSSTransition>
        
    )
}