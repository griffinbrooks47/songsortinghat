import { useState, useRef, useEffect } from "react"
import { CSSTransition } from "react-transition-group"
import { motion } from 'framer-motion';
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

export const FramerSubNavItem = (props) => {

    const [nameState, setNameState] = useState(props.state);

    const toggleState = () => {
        props.function(!nameState)
        setNameState(!nameState)
    }

    const variants = {
        off: { opacity: 0.2, scale: 1},
        on: { opacity: 1, scale: 1 },
      };

    return (
        <motion.div
                initial="off" // Initial animation state
                animate={nameState ? "on" : "off"} // Animation state based on isOn
                variants={variants}
            >
            <li className="subnav-item">
                <a className="subnav-item-tag" onClick={toggleState}>
                    {nameState ? props.primary : props.secondary}
                </a>
            </li>
        </motion.div>
    )

}