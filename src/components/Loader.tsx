import { Flex, Spinner } from "@chakra-ui/react";
import useDarkMode from "../stores/useDarkMode";

export const Loader = () => {
    const colors = useDarkMode((state) => state.colors);

    return (
        <Flex w="100%" alignItems="center" justifyContent="center">
            <Spinner color={colors.default} size="lg" />
        </Flex>
    );
};

