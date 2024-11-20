import React, { useEffect, useRef} from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

interface CustomBoxProps extends BoxProps {
    customStyle?: React.CSSProperties; // Optional custom styles
    scroll?: boolean,
    setScroll?: any
}

const Box100: React.FC<CustomBoxProps> = ({ customStyle, ...props }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (containerRef.current) {
        const element = containerRef.current;
        const { bottom } = element.getBoundingClientRect();
        const isBottomInView = bottom <= window.innerHeight;

        if (!isBottomInView) {
            element.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }};
    useEffect(() => {
        if (props.scroll && props.setScroll) {
            scrollToBottom()
            props.setScroll(false);
        }
    }, [props.scroll]); // Dependency array contains 'update'

  return (
    <Box
      bg="white"
      p={6}
      rounded="md"
      border="2px"
      w="60%"
      h="full"
      ref={containerRef}
      {...props}
      style={{ ...customStyle, ...props.style }} // Combine custom styles with Chakra UI styles
    />
  );
};

export default Box100;