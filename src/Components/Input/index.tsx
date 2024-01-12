import { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement>
const Input = (props : InputProps) => {

  return ( 
    <input className="size-fit" type="text" {...props}/>
  )
}

export default Input