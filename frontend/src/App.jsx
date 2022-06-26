import "./App.css";
import Admin from "./pages/admin/admin";
import Index from "./pages/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  ChakraProvider,
  ColorModeScript,
  CSSReset,
  useToast,
} from "@chakra-ui/react";
import {
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { FaEthereum, FaGithub, FaLinkedin, FaWallet, FaInstagram, FaTwitter, FaCameraRetro } from "react-icons/fa";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { memo, useState } from "react";
import { useEffect } from "react";
function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const [chain, setChain] = useState();
  useEffect(() => {
    const work = async () => {
      const { ethereum } = window;
      if (!ethereum) return;

      const chainId = await ethereum.request({ method: "eth_chainId" });
      console.log(chainId);
      const rinkebyChainId = "0x4";
      setChain(chainId);
    };
    work();
  }, []);

  return (
    <ChakraProvider>
      <Flex align={"center"} justify={"space-between"} w={"100%"} p={5} px={20}>
        <Flex w={"50%"}>
          <Flex align={"center"} justify={"space-between"} marginRight={10}>
            <Text
              paddingLeft={5}
              fontSize={20}
              fontWeight={"bold"}
              letterSpacing={1}
            >
              Photo NFTs
            </Text>
          </Flex>

          <Tooltip hasArrow label={"Contract"} bg={"gray.900"} color={"white"}>
            <IconButton
              mx={2}
              _hover={{
                cursor: "pointer",
                color: "green.100",
              }}
              as={Link}
              href={`https://rinkeby.etherscan.io/address/`}
              isExternal
              icon={<Icon as={FaEthereum} w={7} h={7} />}
            />
          </Tooltip>
          <Tooltip hasArrow label={"linkedin"} bg={"gray.900"} color={"white"}>
            <IconButton
              mx={2}
              _hover={{
                cursor: "pointer",
                color: "green.100",
              }}
              as={Link}
              href={"https://www.linkedin.com/in/georgekaraan/"}
              isExternal
              icon={<Icon as={FaLinkedin} w={7} h={7} />}
            />
          </Tooltip>
          <Tooltip hasArrow label={"github"} bg={"gray.900"} color={"white"}>
            <IconButton
              mx={2}
              _hover={{
                cursor: "pointer",
                color: "green.100",
              }}
              as={Link}
              href={"https://github.com/BraianVaylet/buildspace-epic-nfts-ui"}
              isExternal
              icon={<Icon as={FaGithub} w={7} h={7} />}
            />
          </Tooltip>
          <Tooltip hasArrow label={"Twitter"} bg={"gray.900"} color={"white"}>
            <IconButton
              mx={2}
              _hover={{
                cursor: "pointer",
                color: "green.100",
              }}
              as={Link}
              href={"https://twitter.com/george_karaan"}
              isExternal
              icon={<Icon as={FaTwitter} w={7} h={7} />}
            />
          </Tooltip>
          <Tooltip hasArrow label={"Instagram"} bg={"gray.900"} color={"white"}>
            <IconButton
              mx={2}
              _hover={{
                cursor: "pointer",
                color: "green.100",
              }}
              as={Link}
              href={"https://www.instagram.com/georgekaraan.eth/"}
              isExternal
              icon={<Icon as={FaInstagram} w={7} h={7} />}
            />
          </Tooltip>
        </Flex>

        <Flex
          width={"50%"}
          flexDirection={"row"}
          justifyContent={"flex-end"}
          align={"center"}
        >
          {chain ? (
            <Text color={"green.600"}>
              Connected to {chain}{" "}
              <Link href={"https://www.rinkeby.io/#stats"} isExternal>
                Rinkeby
              </Link>
            </Text>
          ) : (
            <Text color={"red.600"}>Wrong network</Text>
          )}
        </Flex>

        <Text px={"5"}>|</Text>

        <Flex align={"center"} justify={"space-between"}>
          <Icon as={FaWallet} w={5} h={5} />
          <Text px={3}></Text>
        </Flex>

        {/* <Tooltip
          hasArrow
          label={"Change theme"}
          bg={"gray.900"}
          color={"white"}
        >
          <IconButton
            mx={5}
            _hover={{
              cursor: "pointer",
              color: "green.100",
            }}
            onClick={toggleColorMode}
            icon={
              colorMode === "light" ? (
                <MoonIcon w={5} h={5} />
              ) : (
                <SunIcon w={5} h={5} />
              )
            }
          />
        </Tooltip> */}
      </Flex>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/*" element={<Index />}></Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default memo(App);
