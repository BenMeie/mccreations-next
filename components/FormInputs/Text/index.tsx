'use client'

import { useRef } from "react";
import styles from '../Input.module.css'
import { FormElement } from "@/components/Form/Form";

export interface TextProps {
    name: string,
    type?: string,
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void,
    description?: string

}

export interface TextElement extends FormElement {
    props: TextProps
}

export default function Text(props: TextProps): TextElement {
    const value = useRef(props.value)

    return (
        <div className='field'>
            <h3 className='label'>{props.name}</h3>
            <p className={styles.description}>{props.description}</p>
            <input className='input wide' type={props.type || 'text'} onChange={(e) => {(props.onChange) ? props.onChange(e.target.value): ""; value.current = e.target.value}} name='data' placeholder={props.placeholder} defaultValue={props.value}></input>
        </div> 
    )
}