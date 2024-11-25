import { ChakraProvider } from "@chakra-ui/react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/index.js";
import Navigation from "./pages/App";
import Users from "./pages/Users";
import Customers from "./pages/Customers/Listing";
import Register from "./pages/Customers/Register";
import { Acompanhamento } from "./pages/Processos";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import useDarkMode from "./stores/useDarkMode";
import Details from "./pages/Customers/Details";
import { Services } from "./pages/Services";
import { Editor } from "./pages/Anotacoes/Editor";
import { WikiVisualizacao } from "./pages/Anotacoes/Visualizacao";
import { Cadastro } from "./pages/Anotacoes/Cadastro";
import { Categorias } from "./pages/Anotacoes/Categorias";
import { Anotacoes } from "./pages/Anotacoes";
import { Configuracoes } from "./pages/Configuracoes";
import { CategoriaCreate } from "./pages/Anotacoes/CategoriaCreate";
import { ModalCriacaoServico } from "./pages/Services/CreationModal";
import { Contratos } from "./pages/Contratos";
import { CadastroContrato } from "./pages/Contratos/CadastroContrato";
import { EditarContrato } from "./pages/Contratos/EditarContrato";
import { Relatorios } from "./pages/Relatorios";
import { Agenda } from "./pages/Agenda";
import { SubCategoriaCreate } from "./pages/Anotacoes/SubCategoriaCreate.js";
import { GoogleSuccess } from "./pages/Agenda/GoogleSuccess.js";
import { Dashboard } from "./pages/Dashboard/index.js";
import { GED } from "./pages/GED/index.js";

import "./App.css";

function App() {
    const darkModeOn = useDarkMode((state) => state.colors.darkModeOn);

    return (
        <ChakraProvider>
            <ToastContainer theme={darkModeOn ? "dark" : "light"} />
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/app" element={<Navigation />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="clientes">
                            <Route index element={<Customers />} />
                            <Route path="cadastro" element={<Register />} />
                            <Route path=":customerId/detalhes" element={<Details />} />
                        </Route>
                        <Route path="serviços" element={<Services />}>
                            <Route path="cadastro" element={<ModalCriacaoServico />} />
                        </Route>

                        <Route path="usuarios" element={<Users />} />

                        <Route path="processos">
                            <Route path=":processId" element={<Acompanhamento />} />
                        </Route>
                        <Route path="anotacoes">
                            <Route index element={<Anotacoes />} />
                            <Route path="editor" element={<Cadastro />} />
                            <Route path={"editor/:idAnotacao"} element={<Editor />} />
                            <Route path="visualizar/:idAnotacao" element={<WikiVisualizacao />} />
                            <Route path={"categorias"} element={<Categorias />}>
                                <Route path="cadastro" element={<CategoriaCreate />} />
                                <Route path="subcategoria/cadastro" element={<SubCategoriaCreate />} />
                            </Route>
                        </Route>
                        <Route path="configuracoes">
                            <Route index element={<Configuracoes />} />
                        </Route>
                        <Route path="contratos">
                            <Route index element={<Contratos />} />
                            <Route path={"cadastro"} element={<CadastroContrato />} />
                            <Route path={"editar/:idContrato"} element={<EditarContrato />} />
                        </Route>
                        <Route path="relatorios">
                            <Route index element={<Relatorios />} />
                        </Route>
                        <Route path="gestaoEletronica">
                            <Route index element={<GED />} />
                        </Route>
                        <Route path="agenda">
                            <Route index element={<Agenda />} />
                            <Route path="google-sucesso" element={<GoogleSuccess />} />
                        </Route>
                    </Route>
                </Routes>
            </HashRouter>
        </ChakraProvider>
    );
}

export default App;

