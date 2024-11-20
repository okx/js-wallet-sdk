import {CreateToastFnReturn} from "@chakra-ui/react";

const capitalizeFirstLetter = (str: string): string => {
  if (str.length === 0) return str; // Handle empty string case
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export function successToast(toast: CreateToastFnReturn, title: string) {
    toast.closeAll()
    return toast({
        title: capitalizeFirstLetter(title),
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "top-right"
    })

}
export function errorToast(toast: CreateToastFnReturn, title: string) {
    toast.closeAll()
    return toast({
        title: capitalizeFirstLetter(title),
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "top-right"
    })
}