import useDarkMode from "../../stores/useDarkMode.js";
import { Stack, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export const Search = ({ search, setSearch }) => {
    const colors = useDarkMode((state) => state.colors);

    return (
        <Stack flexDir="row" alignItems="center" w={200}>
            <InputGroup size="sm">
                <InputLeftElement>
                    <SearchIcon />
                </InputLeftElement>
                <Input
                    bg={colors.bg}
                    border="none"
                    placeholder="Pasta"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </InputGroup>
        </Stack>
    );
};

