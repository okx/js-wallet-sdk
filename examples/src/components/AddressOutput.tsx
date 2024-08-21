import {CheckIcon, CopyIcon, StarIcon} from "@chakra-ui/icons";
import {Alert, AlertIcon, Heading, IconButton, useClipboard} from "@chakra-ui/react";

interface AddressProps {
    address: string
}
const AddressOutput: React.FC<AddressProps> = (props) =>{
    const { hasCopied: hasCopiedAddress, onCopy: onCopyAddress } = useClipboard(props.address);
    return (
        props.address ?
            <Alert status='info'>
                <AlertIcon as={StarIcon} />
                <Heading size={"sm"}>{"Address: " + props.address }</Heading>
                <IconButton
                    onClick={onCopyAddress}
                    variant="unstyled"
                    icon={hasCopiedAddress ? <CheckIcon /> : <CopyIcon />}
                    aria-label={hasCopiedAddress ? 'Copied' : 'Copy'}
                />
            </Alert>
            : <div/>
        )
}
export default AddressOutput