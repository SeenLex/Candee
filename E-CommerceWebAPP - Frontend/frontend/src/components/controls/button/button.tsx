import React from 'react'
import './button.css'

function Button({text,type,disabled}:{text:string,type:React.ButtonHTMLAttributes<HTMLButtonElement>['type'],disabled:boolean}) {

  return (
    <div>
        <button className="btn" type={type} disabled={disabled}> {text}</button>
    </div>
  )
}

export default Button