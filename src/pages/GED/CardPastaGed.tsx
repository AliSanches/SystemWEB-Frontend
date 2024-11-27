import {
    HStack,
    Text,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Flex,
} from "@chakra-ui/react";
import useDarkMode from "../../stores/useDarkMode.js";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getFilterPasta } from "./api.js";
import { TableArquivos } from "./TableArquivos.js";
import { ModalDeletePasta } from "./ModalDeletePasta.js";
import { ModalCreateDocument } from "./ModalCreateDocument.js";
import { FcOpenedFolder } from "react-icons/fc/index.js";

export const CardPastaGed = ({ pasta }) => {
    const colors = useDarkMode((state) => state.colors);

    const { data: arquivos } = useSuspenseQuery({
        queryKey: ["get-ged", pasta.id],
        queryFn: () => getFilterPasta(pasta.id),
    });

    return (
        <Accordion defaultIndex={[1]} allowMultiple>
            <AccordionItem bg={colors.bg}>
                <HStack
                    borderRadius="5px"
                    bg={colors.bg}
                    padding="15px"
                    alignItems="left"
                    justifyContent="space-between"
                    textAlign="left"
                    rowGap="0"
                    gap={3}
                    display={"flex"}
                    flexDirection={"column"}
                >
                    <Flex gap={3} fontSize={28}>
                        <FcOpenedFolder />
                        <Text fontSize="md" w={200}>
                            {pasta.titulo}
                        </Text>
                        <Flex ml={"auto"} gap={{ base: 2 }}>
                            <ModalCreateDocument pasta={pasta} />
                            <ModalDeletePasta pasta={pasta} />
                        </Flex>
                    </Flex>
                </HStack>
                <AccordionButton borderTop="1px solid rgb(245,245,245)" justifyContent="center">
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={3}>
                    {arquivos.map((data) => {
                        return <TableArquivos key={Math.random()} data={data} />;
                    })}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

