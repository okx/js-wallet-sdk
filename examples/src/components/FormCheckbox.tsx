import React from 'react';
import {
    InputGroup,
    InputLeftAddon,
    Checkbox,
} from '@chakra-ui/react';

interface FormInputProps {name: string, data: any, setData: React.SetStateAction<any>}

const FormInput: React.FC<FormInputProps> = (props) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        props.setData({
            ...props.data,
            [name]: checked,
        });
    };

    const formatName = (input: string): string => {
        const words = input.split(/(?=[A-Z])/);
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalizedWords.join(' ');
    }

    return (
        <InputGroup>
            <InputLeftAddon minWidth={220}>{formatName(props.name)}</InputLeftAddon>
            <Checkbox
                id={props.name}
                name={props.name}
                isChecked={props.data[props.name]}
                onChange={handleChange}
                ml={5}
            >
                {props.data[props.name] ? 'True' : 'False'}
            </Checkbox>
        </InputGroup>
    );
};

export default FormInput;
