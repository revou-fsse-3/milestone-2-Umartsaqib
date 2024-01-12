import { ButtonHTMLAttributes } from "react";


interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
  label: string;
}

const Button = ({ label, ...props } : Props) => {

  return ( 
    <button {...props} >{label}</button>
  )
}

export default Button