import useDarkMode from "../../stores/useDarkMode";
import { Stack, InputGroup, InputLeftElement, Input, InputRightElement, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FiX } from "react-icons/fi";

type SearchProps = {
    setSkip: React.Dispatch<React.SetStateAction<number>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const Search = ({ setSkip, search, setSearch }: SearchProps) => {
    const colors = useDarkMode((state) => state.colors);

    return (
        <Stack flexDir="row" alignItems="center">
            <InputGroup size="sm">
                <InputLeftElement>
                    <SearchIcon />
                </InputLeftElement>
                <Input
                    bg={colors.bg}
                    border="none"
                    placeholder="Título"
                    value={search}
                    onChange={(event) => {
                        setSkip(0);
                        setSearch(event.target.value);
                    }}
                />
                <InputRightElement>
                    <IconButton
                        size="sm"
                        aria-label="Limpar"
                        icon={<FiX />}
                        bg={colors.bg}
                        color={colors.text}
                        _hover={{ bg: colors.darkerbg }}
                        onClick={() => {
                            setSkip(0);
                            setSearch("");
                        }}
                    />
                </InputRightElement>
            </InputGroup>
        </Stack>
    );
};

