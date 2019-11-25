import * as React from "react"
import check from "Renderer/assets/icons/check-icon.svg"
import Text, { TextDisplayStyle } from "Renderer/components/text/text.component"
import { InputProps } from "Renderer/interfaces/input.interface"
import {
  backgroundColor,
  borderColor,
} from "Renderer/styles/theming/theme-getters"
import FunctionComponent from "Renderer/types/function-component.interface"
import styled from "styled-components"

console.log(check)

const InputCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
`

const Input = styled.input`
  appearance: none;
  display: inline-block;
  width: 2em;
  height: 2em;
  background-clip: content-box;
  border: 1px solid ${borderColor("default")};
  border-radius: 2px;
  background-color: ${backgroundColor("light")};

  &:after {
    content: "";
    display: block;
    background-image: url(${check});
    background-repeat: no-repeat;
    background-position: center;
    height: 2em;
    width: auto;
  }

  &:hover {
    border-color: ${borderColor("hover")};
    cursor: pointer;
    transition: border-color 0.5s linear;
  }

  &:checked {
    background-color: ${backgroundColor("dark")};
  }
`

const InputCheckbox: FunctionComponent<Readonly<InputProps>> = ({
  label,
  labelDisplayStyle = TextDisplayStyle.Default,
  className,
  ...props
}) => {
  return (
    <Text displayStyle={labelDisplayStyle} className={className}>
      <InputCheckboxWrapper>
        <Input type="checkbox" {...props} />
        {label}
      </InputCheckboxWrapper>
    </Text>
  )
}

export default InputCheckbox
