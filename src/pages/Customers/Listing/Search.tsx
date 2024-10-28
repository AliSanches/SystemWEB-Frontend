import useDarkMode from "../../../stores/useDarkMode";
import { Stack, InputGroup, InputLeftElement, Input, InputRightElement, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FiX, FiRefreshCw } from "react-icons/fi";

type SearchProps = {
    setNumber: React.Dispatch<React.SetStateAction<number>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    loadData: () => Promise<void>;
};

export const Search = ({ setNumber, search, setSearch, loadData }: SearchProps) => {
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
                    placeholder="Cliente"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
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
                            setNumber(5);
                            setSearch("");
                        }}
                    />
                </InputRightElement>
            </InputGroup>
            <IconButton
                size="sm"
                aria-label="Recarregar"
                icon={<FiRefreshCw />}
                onClick={loadData}
                color={colors.text}
                bg={colors.bg}
                _hover={{ bg: colors.darkerbg }}
            />
        </Stack>
    );
};

