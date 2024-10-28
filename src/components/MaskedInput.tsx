import InputMask from "react-input-mask";
import { Input } from "@chakra-ui/react";

export function MaskedInput(props) {
    return <InputMask {...props}>{(inputProps) => <Input {...inputProps} backgroundColor="white" />}</InputMask>;
}

