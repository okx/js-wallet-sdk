import React, { Dispatch, SetStateAction } from 'react';
import {Button, VStack, IconButton, HStack} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import FormInput from './FormInput';

interface DynamicFormProps<T> {
    label: string;
    inputs: T[];
    setInputs: Dispatch<SetStateAction<T[]>>;
}

const DynamicForm = <T extends { [key: string]: any }>({
                                                           label,
                                                           inputs,
                                                           setInputs,
                                                          }: DynamicFormProps<T>) => {
      const setInput = (index: number, input: T) => {
    setInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      if (index >= 0 && index < newInputs.length) {
        newInputs[index] = input;
      }
      return newInputs;
    });
  };
    const handleAddInput = () => {
        const newInput: T = Object.keys(inputs[0] || {}).reduce(
            (acc, key) => ({ ...acc, [key]: '' }),
            {} as T
        );
        setInputs((prevInputs) => [...prevInputs, newInput]);
    };

    // Delete an input field
    const handleDeleteInput = (index: number) => {
        if (inputs.length > 1) {
            setInputs((prevInputs) => prevInputs.filter((_, i) => i !== index));
        }
    };

    return (
        <VStack spacing={4}>
        {inputs.map((input, index) => (
            <HStack key={index}
                    w={"100%"}
                    borderWidth="2px" // Set border width
                    borderColor="gray.300" // Set border color to grey
                    borderRadius="md"
                    padding={2}
            >
                <VStack spacing={2} align="stretch" w={"95%"} flex={3}>
                    {Object.keys(input).map((fieldName) => (
                        <FormInput
                            key={fieldName}
                            name={fieldName}
                            data={input}
                            setData={(input:T) => setInput(index, input)}/>
                    ))}
                </VStack>
                <IconButton
                    icon={<CloseIcon />}
                    aria-label="Delete input"
                    colorScheme="red"
                    alignSelf={"start"}
                    // justifyContent={"end"}
                    // flex={1}
                    // marginLeft={"auto"}
                    size="xs"
                    onClick={() => handleDeleteInput(index)}
                    isDisabled={inputs.length === 1}
                />
            </HStack>
        ))}
        <Button onClick={handleAddInput} w={"100%"} colorScheme="gray">
            Add {label}
        </Button>
    </VStack>
    );
};

export default DynamicForm;
