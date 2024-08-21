import React from 'react';
import {
    InputGroup,
    InputLeftAddon,
    Input,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface FormInputProps {name: string, data: any, setData: React.SetStateAction<any>, displayName?: string}

const FormInput: React.FC<FormInputProps> = (props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        props.setData({
            ...props.data,
            [name]: value,
        });
    };

    const handleClear = () => {
        props.setData({
            ...props.data,
            [props.name]: "",
        });
    };

    const getName = (): string => {
        if (props.displayName) {
            return props.displayName
        }
        const words = props.name.split(/(?=[A-Z])/);
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalizedWords.join(' ');
    }

    return (
        <InputGroup >
            <InputLeftAddon minWidth={220}>{getName()}</InputLeftAddon>
            <Input
                id={props.name}
                name={props.name}
                value={props.data[props.name]}
                onChange={handleChange}
            />
            <InputRightElement>
                <IconButton
                    variant="unstyled"
                    colorScheme="red"
                    aria-label="Clear input"
                    icon={<CloseIcon />}
                    size="sm"
                    onClick={handleClear}
                />
            </InputRightElement>
        </InputGroup>
    );
};

export default FormInput;
