import {
    HStack,
    Text,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Tag,
} from "@chakra-ui/react";
import useDarkMode from "../../stores/useDarkMode";
import { CategoriaEdit } from "./CategoriaEdit";
import { CategoriaDelete } from "./CategoriaDelete";
import useUserStore from "../../stores/user";
import { SubCategoria } from "./SubCategoria.js";
import { useEffect, useState } from "react";
import { listaSubcategoriasId } from "./api.js";
import { useNavigate } from "react-router-dom";

export const CategoriaCard = ({ categoria, reloadData }) => {
    const colors = useDarkMode((state) => state.colors);
    const permissions = useUserStore((state) => state.permissions);
    const navigate = useNavigate();

    const [subcategoria, setSubcategoria] = useState([]);

    const getSubcategoria = async () => {
        const response = await listaSubcategoriasId(categoria.id, navigate);

        setSubcategoria(response.data.subcategoria);
    };

    useEffect(() => {
        getSubcategoria();
    }, []);

    return (
        <Accordion defaultIndex={[1]} allowMultiple>
            <AccordionItem bg={colors.bg}>
                <HStack w="100%" borderRadius="5px" bg={colors.bg} padding="15px">
                    <VStack alignItems="left" textAlign="left" rowGap="0" w="50%">
                        <Text fontSize="md">{categoria.titulo}</Text>
                        <Text fontSize="sm">{categoria.descricao}</Text>
                    </VStack>

                    {permissions.anotacoes === 2 && (
                        <>
                            <CategoriaDelete
                                count={categoria._count.anotacoes}
                                id={categoria.id}
                                reloadData={reloadData}
                            />
                            <CategoriaEdit categoria={categoria} reloadData={reloadData} />
                        </>
                    )}
                </HStack>
                <AccordionButton borderTop="1px solid rgb(245,245,245)" justifyContent="center">
                    <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={3}>
                    {subcategoria.map((subcategoria) => (
                        <SubCategoria key={Math.random()} subcategoria={subcategoria} reload={reloadData} />
                    ))}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
};

