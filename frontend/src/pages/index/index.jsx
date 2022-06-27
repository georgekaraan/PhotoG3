//Index page with ui and logic

import { useState, useEffect, useCallback, memo } from "react";
import { ethers } from "ethers";
import {
  Button,
  Flex,
  Text,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  AccordionPanel,
} from "@chakra-ui/react";

import "./index.css";
import FiltersModal from "./FiltersModal";
import ImagesService from "../../services/ImagesService";
import GeorgePhotoMinter from "../../assets/GeorgePhotoMinter.json";
import Head from "../../components/Head";
const prefixURI = "https://gateway.pinata.cloud/ipfs/";
const GeorgePhotoAddress = "0x43BcFfb1490C0Ca681258be1b9Df24604fa0F795";

const ToastTemplate = () => (
  <span>
    Congratulations! You have minted one of my photos. I really hope you like it
    😃.
  </span>
);

const Index = () => {
  const { ethereum } = window;

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const toast = useToast();
  const [provider, setProvider] = useState();

  const ConnectToMask = async function () {
    if (ethereum) {
      const chainId = await ethereum.request({ method: "eth_chainId" });

      if (!chainId.startsWith("0x4"))
        toast({
          description: "Please connect to 0x4 chain",
          duration: 5000,
          status: "error",
        });

      ethereum
        .request({ method: "eth_requestAccounts" })
        .catch((err) => console.log(err));
      setProvider(new ethers.providers.Web3Provider(ethereum));
    } else {
      toast({
        description: "Install MetaMask please",
        status: "warning",
      });
    }
  };

  useEffect(() => {
    //initial login try
    ethereum &&
      ethereum.on("accountsChanged", (accounts) => {
        setProvider(new ethers.providers.Web3Provider(ethereum));

        RenewUserInfo(accounts);
      });
  }, []);

  const RenewUserInfo = async (accounts) => {
    try {
      if (!provider) return;
      if (!accounts || accounts.lenght == 0) {
        setAddress("");
        setBalance(0);
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const userBalance = await provider.getBalance(address);
      const contractInstance = new ethers.Contract(
        GeorgePhotoAddress,
        GeorgePhotoMinter.abi,
        signer
      );
      const currentBalance = await contractInstance.balanceOf(address);
      setCurrentBalance(currentBalance.toString());

      setAddress(address);
      let res = ethers.utils.formatEther(userBalance);
      res = Math.round(res * 1e4) / 1e4;
      setBalance(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ConnectToMask();
  }, []);

  //lexical error fix
  const addressOtherName = address;
  const ReceiveAImage = useCallback(
    (filters = []) => {
      const work = async () => {
        if (!provider || !addressOtherName) {
          toast({
            description: "Please login to your MetaMask account",
            duration: 3000,
          });
          return;
        }
        const image = await ImagesService.GetImage(filters);
        if (!image || !image.path) {
          toast({
            description: "No more photos. Come back later!",
            duration: 3000,
            isClosable: true,
            status: "error",
          });
          return;
        }

        setTimeout(() => {
          ImagesService.UnFrozeImage(image.path).then(
            (resp, err) => console.log(resp) || console.log(err)
          );

          //5 mins to commit transfer
        }, 1000 * 60 * 5);

        setIsModelOpen(false);

        toast({
          isClosable: true,
          status: "info",
          description: "Setting up your transaction. Please wait.",
        });

        const tokenUri = prefixURI + image.path;
        const signer = await provider.getSigner();

        const contractInstance = new ethers.Contract(
          GeorgePhotoAddress,
          GeorgePhotoMinter.abi,
          signer
        );

        const address = await signer.getAddress();
        const nonce = await signer.getTransactionCount();
        try {
          await contractInstance.awardItemAL(address, tokenUri, {
            nonce: nonce,
          });
          toast({
            isClosable: true,
            status: "success",
            description: <ToastTemplate />,
          });
          RenewUserInfo();
          ImagesService.DeleteImage(image.path).then(
            (resp, err) => console.log(resp) || console.log(err)
          );
        } catch (error) {
          ImagesService.UnFrozeImage(image.path).then(
            (resp, err) => console.log(resp) || console.log(err)
          );

          toast({
            isClosable: true,
            status: "error",
            description: "You are not on the allowlist!",
          });
        }
      };
      work();
    },
    [provider, address]
  );

  useEffect(() => {
    if (provider)
      provider.listAccounts().then((result) => RenewUserInfo(result));
  }, [provider]);

  return (
    <>
      <Head>
        <title>PhotoG3 NFT</title>
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Head>
      <Flex
        align={"center"}
        justify={"flex-start"}
        direction={"column"}
        w={"100%"}
        h={"100vh"}
        py={100}
        backgroundColor="#23395d"
      >
        <Flex
          align={"center"}
          justify={"center"}
          direction={"column"}
          w={"50%"}
        >
          <Text
            id="top"
            as="h1"
            fontSize={"3xl"}
            fontWeight={900}
            letterSpacing={"1px"}
            color="#FFFADA"
          >
            Hi 👋, I'm George and
          </Text>
          <Text
            as="h3"
            my={5}
            fontSize={"5xl"}
            fontWeight={600}
            letterSpacing={".5px"}
            color="#FFFADA"
          >
            Welcome to PhotoG3 !
          </Text>

          <Accordion
            w={"100%"}
            defaultIndex={[0]}
            allowMultiple
            className="accordion-main"
          >
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="center">
                    <Text as={"h2"} fontSize={30} fontWeight={"bold"}>
                      About this project
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text fontSize={20}>
                  My name is George and I am a hobbyist photographer. I built this
                  dApp as a final project for an Ethereum Development Bootcamp.
                </Text>
                <Text fontSize={20}>
                  As of now, this app works on an invite only basis. So make
                  sure you get on the Allow List first.
                </Text>
                <Text fontSize={20}>
                  To mint one of my photographs, simply connect your wallet
                  using the Rinkeby chain and then choose one of the 2 options
                  below.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Flex
            direction={"column"}
            align={"center"}
            justify={"center"}
            w={"100%"}
            py={25}
          >
            <div className="user-info">
              {/* <Text
                fontSize={"2xl"}
                fontStyle={"italic"}
                bgGradient={"linear(to-r, green.300, green.500)"}
                bgClip="text"
              >
                <b>Your address:</b> {address}
              </Text> */}
              <Text
                fontSize={"2xl"}
                fontStyle={"italic"}
                bgGradient={"linear(to-r, green.300, green.500)"}
                bgClip="text"
              >
                <b>Your balance:</b> {balance}
              </Text>
              <Text
                fontSize={"2xl"}
                fontStyle={"italic"}
                bgGradient={"linear(to-r, green.300, green.500)"}
                bgClip="text"
              >
                <b>The current number of photos you own: </b> {currentBalance}
              </Text>
            </div>
          </Flex>

          <Button
            mt={5}
            p={4}
            w={"30%"}
            fontWeight={"bold"}
            letterSpacing={1}
            borderRadius={"md"}
            bgGradient={"linear(to-r, green.300, green.500)"}
            color={"white"}
            boxShadow={"2xl"}
            _hover={{
              opacity: ".2",
            }}
            onClick={() => ReceiveAImage()}
          >
            Mint Random Photo
          </Button>

          <Button
            mt={5}
            p={4}
            w={"30%"}
            fontWeight={"bold"}
            letterSpacing={1}
            borderRadius={"md"}
            bgGradient={"linear(to-r, yellow.300, yellow.500)"}
            color={"white"}
            boxShadow={"2xl"}
            _hover={{
              opacity: ".2",
            }}
            onClick={() => setIsModelOpen(true)}
          >
            Select Preferences
          </Button>

          {/* Conectar billetera */}
          {!address && (
            <Button
              mt={10}
              w={"30%"}
              letterSpacing={1}
              borderRadius={"md"}
              bg={"gray.600"}
              color={"white"}
              boxShadow={"2xl"}
              _hover={{
                opacity: ".9",
                cursor: "pointer",
              }}
              onClick={ConnectToMask}
              disabled={false}
            >
              Connect your Wallet
            </Button>
          )}
        </Flex>
      </Flex>

      {/* modal */}
      <FiltersModal
        isOpen={isModelOpen}
        close={() => setIsModelOpen(false)}
        SendRequest={ReceiveAImage}
      />
    </>
  );
};

export default memo(Index);
