import React from 'react';
import {
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    IconButton,
    Textarea,
    Box,
    Button,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface FormInputProps {
    name: string,
    data: any,
    setData: React.SetStateAction<any>
    rows: number,
    format?: boolean
}

const FormTextarea: React.FC<FormInputProps> = (props) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

    const handleFormat = () => {
        props.setData({
            ...props.data,
            [props.name]: formatJson(props.data[props.name]),
        });
    }

    const formatName = (input: string): string => {
        const words = input.split(/(?=[A-Z])/);
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return capitalizedWords.join(' ');
    }
    function formatJson(jsonString: string): string {
      try {
        const jsonObject = JSON.parse(jsonString);
        return JSON.stringify(jsonObject, null, 2); // 2 spaces for indentation
      } catch (error) {
        console.error("Invalid JSON string", error);
        return jsonString; // Return the original string if it's not valid JSON
      }
    }


    return (
        <InputGroup mb={5}>
            <InputLeftAddon minWidth={220} minHeight={props.rows*30}>
                {formatName(props.name)}
            </InputLeftAddon>
            <Textarea
                id={props.name}
                name={props.name}
                value={props.data[props.name]}
                onChange={handleChange}
                rows={props.rows}
            />
            <InputRightElement width='20rem' justifyContent={"right"}>
                <Box flexDirection={"column"}>
                    {props.format ?
                        <Button onClick={handleFormat} type="submit" colorScheme="blue" minWidth={20}>Format</Button>
                : ""

                }
                <IconButton
                    variant="unstyled"
                    colorScheme="red"
                    aria-label="Clear input"
                    icon={<CloseIcon />}
                    size="sm"
                    onClick={handleClear}
                    marginRight={"1rem"}
                />
</Box>
            </InputRightElement>
        </InputGroup>
    );
};

export default FormTextarea;
