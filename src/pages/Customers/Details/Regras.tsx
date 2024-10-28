import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Transicao50 } from "./Regras/Transicao50";
import { Transicao100 } from "./Regras/Transicao100";
import { AposentadoriaProporcional } from "./Regras/AposentadoriaProporcional";
import { IdadeProgressiva } from "./Regras/IdadeProgressiva";
import { RegraPontos } from "./Regras/RegraPontos.js";
import { AposentadoriaEspecial } from "./Regras/AposentadoriaEspecial.js";
import { Transicao100Professor } from "./Regras/Transicao100Professor.js";

export const Regras = () => {
    return (
        <Flex>
            <Tabs isLazy variant="solid-rounded" size="sm">
                <TabList>
                    <Tab>Aposentadoria Proporcional (Pedágio)</Tab>
                    <Tab>Transição de 50%</Tab>
                    <Tab>Transição de 100%</Tab>
                    <Tab>Transição de 100% (Professor)</Tab>
                    <Tab>Idade Progressiva</Tab>
                    <Tab>Regra dos Pontos</Tab>
                    <Tab>Aposentadoria Especial (Transição Pontos)</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <AposentadoriaProporcional />
                    </TabPanel>
                    <TabPanel>
                        <Transicao50 />
                    </TabPanel>
                    <TabPanel>
                        <Transicao100 />
                    </TabPanel>
                    <TabPanel>
                        <Transicao100Professor />
                    </TabPanel>
                    <TabPanel>
                        <IdadeProgressiva />
                    </TabPanel>
                    <TabPanel>
                        <RegraPontos />
                    </TabPanel>
                    <TabPanel>
                        <AposentadoriaEspecial />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    );
};

