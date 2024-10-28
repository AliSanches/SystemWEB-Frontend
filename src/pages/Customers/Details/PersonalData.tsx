import {
    Button,
    Flex,
    FormLabel,
    HStack,
    Input,
    Select,
    Spinner,
    Box,
    Checkbox,
    Radio,
    RadioGroup,
    Stack,
    Modal,
    ModalOverlay,
    ModalContent,
    useDisclosure,
} from "@chakra-ui/react";
import useDarkMode from "../../../stores/useDarkMode.js";
import React, { useState, useEffect } from "react";
import { getToday } from "../../../components/getToday.js";
import { getCustomer } from "../Listing/api.js";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCustomer, updateCustomer } from "./api.js";
import { notify } from "../../../components/notify.js";
import ConfirmDeletion from "../../../components/ConfirmDeletionModal.js";
import useUserStore from "../../../stores/user.js";

import Webcam from "react-webcam";

export const PersonalData = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [imageProfile, setImageProfile] = useState("");
    const webcamRef = React.useRef<any>(null);

    const videoConstraints = {
        height: 400,
        width: 320,
        facingMode: "enviroment",
    };

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        setImageProfile(imageSrc);
    }, [webcamRef]);

    const UF = [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MS",
        "MT",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
    ];

    const [serie, setSerie] = useState("");
    const [ctps, setCTPS] = useState("");
    const [numberFolder, setNumberFolder] = useState("");
    const [responsibleFolder, setResponsibleFolder] = useState("");
    const [pis, setPis] = useState("");
    const [smartPhone, setSmartPhone] = useState("");
    const [statusCustomer, setStatusCustomer] = useState("CONCLUIDO");
    const [origin, setOrigin] = useState("INDICACAO");
    const [stateLife, setStateLife] = useState("V");
    const [education, setEducation] = useState("");
    const [payment, setPayment] = useState(false);
    const [passwordINSS, setPasswordINSS] = useState("");
    const [name, setName] = useState("");
    const [motherName, setMotherName] = useState("");
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [rgIssuer, setIssuer] = useState("");
    const [cep, setCep] = useState("");
    const [uf, setUf] = useState("SP");
    const [city, setCity] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [street, setStreet] = useState("");
    const [mail, setMail] = useState("");
    const [phone, setPhone] = useState("");
    const [birthplace, setBirthplace] = useState("");
    const [profession, setProfession] = useState("");
    const [civil, setCivil] = useState("");
    const [customerSince, setCustomerSince] = useState(() => getToday());
    const [gender, setGender] = useState("M");
    const [birthdate, setBithdate] = useState(() => getToday());
    const [loading, setLoading] = useState(true);
    const { customerId } = useParams();
    const permissions = useUserStore((state) => state.permissions);
    const [disabled] = useState(permissions.clientes !== 2);

    const colors = useDarkMode((state) => state.colors);
    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        const query = await getCustomer(customerId!, navigate);

        if (query) {
            setImageProfile(query.data.imageProfile);
            setPasswordINSS(query.data.passwordINSS);
            setPayment(query.data.payment);
            setEducation(query.data.education);
            setStateLife(query.data.stateLife);
            setOrigin(query.data.origin);
            setStatusCustomer(query.data.statusCustomer);
            setSmartPhone(query.data.smartPhone);
            setPis(query.data.pis);
            setResponsibleFolder(query.data.responsibleFolder);
            setNumberFolder(query.data.numberFolder);
            setCTPS(query.data.ctps);
            setSerie(query.data.serie);
            setName(query.data.name);
            setMotherName(query.data.motherName);
            setCpf(query.data.cpf);
            setRg(query.data.rg);
            setIssuer(query.data.rgIssuer);
            setCep(query.data.cep);
            setUf(query.data.uf);
            setCity(query.data.city);
            setNeighborhood(query.data.neighborhood);
            setStreet(query.data.street);
            setMail(query.data.mail);
            setPhone(query.data.phone);
            setBirthplace(query.data.birthplace);
            setProfession(query.data.profession);
            setCivil(query.data.civil);
            setCustomerSince(query.data.customerSince);
            setGender(query.data.gender);
            setBithdate(query.data.birthdate);
            setLoading(false);
        }
    };

    const save = async () => {
        const query = await updateCustomer(
            {
                id: customerId,
                name,
                motherName,
                cpf,
                rg,
                rgIssuer,
                cep,
                uf,
                city,
                neighborhood,
                street,
                mail,
                phone,
                birthplace,
                profession,
                civil,
                customerSince,
                gender,
                birthdate,
                serie,
                ctps,
                numberFolder,
                pis,
                responsibleFolder,
                smartPhone,
                statusCustomer,
                origin,
                stateLife,
                education,
                payment,
                passwordINSS,
                imageProfile,
            },
            navigate
        );

        if (query.status === 200) {
            notify("Cliente atualizado com sucesso!", "success");
            loadData();
        }
    };

    const remove = async () => {
        const query = await deleteCustomer(customerId!, navigate);

        if (query.status === 200) {
            notify("Cliente removido com sucesso!", "success");
            navigate("/app/clientes");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <HStack justifyContent="center">
                <Spinner color={colors.default} size="lg" />
            </HStack>
        );
    } else
        return (
            <Flex flexWrap="wrap" columnGap="10px" marginTop="10px">
                <Flex
                    flexWrap={{ base: "wrap-reverse", md: "wrap-reverse", lg: "nowrap" }}
                    width="100%"
                    marginTop="10px"
                    gap={5}
                >
                    <Flex w="100%" flexWrap="wrap" gap={5}>
                        <Box minW={220} flex={3}>
                            <FormLabel>Nº Pasta</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                type="number"
                                value={numberFolder}
                                onChange={(event) => setNumberFolder(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Responsável Pela Pasta</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={responsibleFolder}
                                onChange={(event) => setResponsibleFolder(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Cliente Desde</FormLabel>
                            <Input
                                size="sm"
                                type="date"
                                bg={colors.bg}
                                value={customerSince}
                                onChange={(event) => setCustomerSince(event.target.value)}
                                alignSelf="center"
                            />
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Data de nascimento</FormLabel>
                            <Input
                                size="sm"
                                type="date"
                                bg={colors.bg}
                                value={birthdate}
                                onChange={(event) => setBithdate(event.target.value)}
                                alignSelf="center"
                            />
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>PIS/PASEP/NIT</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                type="number"
                                value={pis}
                                onChange={(event) => setPis(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Nome da Mãe</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={motherName}
                                onChange={(event) => setMotherName(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Cpf</FormLabel>
                            <Input
                                type="number"
                                bg={colors.bg}
                                size="sm"
                                value={cpf}
                                onChange={(event) => setCpf(event.target.value)}
                                placeholder="999.999.999-99"
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Rg</FormLabel>
                            <Input
                                type="number"
                                bg={colors.bg}
                                size="sm"
                                value={rg}
                                onChange={(event) => setRg(event.target.value)}
                                placeholder="99.999.999-9"
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Estado Civil</FormLabel>
                            <Select
                                size="sm"
                                value={civil}
                                onChange={(event) => setCivil(event.target.value)}
                                bg={colors.bg}
                            >
                                <option style={{ backgroundColor: colors.bg }} value="S">
                                    Solteiro(a)
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="C">
                                    Casado(a)
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="V">
                                    Viúvo(a)
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="D">
                                    Divorciado(a)
                                </option>
                            </Select>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Naturalidade</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={birthplace}
                                onChange={(event) => setBirthplace(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>CTPS Nº</FormLabel>
                            <Input
                                bg={colors.bg}
                                size="sm"
                                type="number"
                                value={ctps}
                                onChange={(event) => setCTPS(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Série</FormLabel>
                            <Input
                                bg={colors.bg}
                                size="sm"
                                type="number"
                                value={serie}
                                onChange={(event) => setSerie(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Cep</FormLabel>
                            <Input
                                bg={colors.bg}
                                size="sm"
                                type="number"
                                placeholder="99999-999"
                                value={cep}
                                onChange={(event) => setCep(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>UF</FormLabel>
                            <Select size="sm" bg={colors.bg} value={uf} onChange={(event) => setUf(event.target.value)}>
                                {UF.map((item) => (
                                    <option style={{ backgroundColor: colors.bg }} key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Cidade</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Bairro</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={neighborhood}
                                onChange={(event) => setNeighborhood(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Rua</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={street}
                                onChange={(event) => setStreet(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Orgão Emissor</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={rgIssuer}
                                onChange={(event) => setIssuer(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>E-mail</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={mail}
                                onChange={(event) => setMail(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Número de Telefone</FormLabel>
                            <Input
                                bg={colors.bg}
                                placeholder="(99) 9999-9999"
                                size="sm"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Número de Celular</FormLabel>
                            <Input
                                bg={colors.bg}
                                placeholder="(99) 9999-9999"
                                size="sm"
                                value={smartPhone}
                                onChange={(event) => setSmartPhone(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel color={"red"}>Situação do cliente</FormLabel>
                            <Select
                                size="sm"
                                bg={colors.bg}
                                value={statusCustomer}
                                onChange={(event) => setStatusCustomer(event.target.value)}
                            >
                                <option style={{ backgroundColor: colors.bg }} value="CONCLUIDO">
                                    CONCLUIDO
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="CANCELADO">
                                    CANCELADO
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="ANDAMENTO">
                                    ANDAMENTO
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="PARADO">
                                    PARADO
                                </option>
                            </Select>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel color={"red"}>Origem do cliente</FormLabel>
                            <Select
                                size="sm"
                                bg={colors.bg}
                                value={origin}
                                onChange={(event) => setOrigin(event.target.value)}
                            >
                                <option style={{ backgroundColor: colors.bg }} value="INDICACAO">
                                    Indicação
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="INSTAGRAM">
                                    Instagram
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="PARCERIA">
                                    Parceria
                                </option>
                                <option style={{ backgroundColor: colors.bg }} value="ANUNCIOS">
                                    Anúncios em redes sociais
                                </option>
                            </Select>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Profissão Atual</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={profession}
                                onChange={(event) => setProfession(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Escolaridade</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={education}
                                onChange={(event) => setEducation(event.target.value)}
                            ></Input>
                        </Box>

                        <Box minW={220} flex={3}>
                            <FormLabel>Senha Meu INSS</FormLabel>
                            <Input
                                size="sm"
                                bg={colors.bg}
                                value={passwordINSS}
                                onChange={(event) => setPasswordINSS(event.target.value)}
                            ></Input>
                        </Box>

                        <Flex minW={220} flex={3} alignItems="end">
                            <Checkbox isChecked={payment} onChange={(event) => setPayment(event.target.checked)}>
                                Pagou Consulta
                            </Checkbox>
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection={{ base: "column", md: "initial", lg: "column" }}
                        h={{ base: "480px", md: "233px", lg: "485px" }}
                        flex={3}
                        gap={5}
                    >
                        <Box
                            w={220}
                            h={230}
                            backgroundImage={imageProfile ? imageProfile : "url('/public/profile_picture.png')"}
                            backgroundSize="cover"
                            backgroundPosition="center"
                            cursor="pointer"
                            onClick={onOpen}
                        >
                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    {/* BLOCO DA CAMERA */}
                                    <Flex justifyContent="center" bg="black" rounded="md" height={500} alignItems="end">
                                        <div
                                            className="webcam-container"
                                            style={{
                                                color: "white",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <div className="webcam-img">
                                                {imageProfile == "" ? (
                                                    <Box marginBottom={8}>
                                                        <Webcam
                                                            audio={false}
                                                            height={600}
                                                            ref={webcamRef}
                                                            screenshotFormat="image/jpeg"
                                                            width={320}
                                                            videoConstraints={videoConstraints}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <img src={imageProfile} style={{ marginBottom: "30px" }} />
                                                )}
                                            </div>
                                            <div>
                                                {imageProfile != "" ? (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setImageProfile("");
                                                        }}
                                                        className="webcam-btn"
                                                    >
                                                        CAPTURAR NOVAMENTE
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            capture();
                                                        }}
                                                        className="webcam-btn"
                                                    >
                                                        CAPTURAR
                                                    </Button>
                                                )}
                                                <Button ml={5} onClick={onClose}>
                                                    FECHAR
                                                </Button>
                                            </div>
                                        </div>
                                    </Flex>
                                    {/* FIM BLOCO DA CAMERA */}
                                </ModalContent>
                            </Modal>
                        </Box>
                        <Flex flexDirection="column" minW={220} flex={3} gap={5}>
                            <RadioGroup minW={220} flex={3} value={stateLife} onChange={setStateLife}>
                                <FormLabel>Encontra-se</FormLabel>
                                <Stack direction="row">
                                    <Radio value="V">Vivo</Radio>
                                    <Radio value="F">Falecido</Radio>
                                </Stack>
                            </RadioGroup>
                            <Box minW={220} flex={3}>
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    size="sm"
                                    bg={colors.bg}
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                ></Input>
                            </Box>
                            <Box minW={220} flex={3}>
                                <FormLabel>Gênero</FormLabel>
                                <Select
                                    size="sm"
                                    bg={colors.bg}
                                    value={gender}
                                    onChange={(event) => setGender(event.target.value)}
                                >
                                    <option style={{ backgroundColor: colors.bg }} value="M">
                                        Masculino
                                    </option>
                                    <option style={{ backgroundColor: colors.bg }} value="F">
                                        Feminino
                                    </option>
                                </Select>
                            </Box>
                        </Flex>
                    </Flex>
                </Flex>

                {permissions.clientes === 2 ? (
                    <>
                        <ConfirmDeletion entity="cliente" text="" handleDeletion={remove} mt={5} />
                        <Button mt={5} size="sm" colorScheme={"linkedin"} onClick={() => save()}>
                            Salvar
                        </Button>
                    </>
                ) : null}
            </Flex>
        );
};

