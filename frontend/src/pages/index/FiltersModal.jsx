import {
  Button,
  Flex,
  Text,
  Spinner,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Link,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  AccordionPanel,
} from "@chakra-ui/react";
import { memo, useCallback } from "react";
import { useEffect, useState } from "react";
import TraitsService from "../../services/TraitsService";
import FilterAccordion from "./FilterAccordion";

const FiltersModal = ({ isOpen, close, SendRequest }) => {
  const [filters, setFilters] = useState(null);
  const [choosenTraits, setChoosedTraits] = useState([]);
  useEffect(() => {
    //so it will request data when it will be opened
    if (isOpen)
      TraitsService.GetTraitsNames()
        .then((el) => Array.isArray(el) && el.length !== 0 && setFilters(el))
        .then((el) => console.log("Setted"));
  }, [isOpen]);

  const selfDelete = useCallback((id) => {
    setFilters((prevFilters) => prevFilters.filter((el) => el.id !== id));
  }, []);

  const toogleTraits = useCallback((trait_type, value) => {
    setChoosedTraits((prevState) => {
      if (prevState.find((el) => el.trait_type === trait_type)) {
        return [...prevState.filter((el) => el.trait_type !== trait_type)];
      }
      return [...prevState, { trait_type, value }];
    });
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hey you! 📸</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Text>Please choose your preferences</Text>
          <Stack>
            <Accordion>
              {filters &&
                filters.map((el) => (
                  <FilterAccordion
                    id={el.id}
                    name={el.name}
                    key={el.id}
                    selfDelete={selfDelete}
                    onOptionClick={toogleTraits}
                  />
                ))}
            </Accordion>
            {!filters && <Spinner size={"xl"}></Spinner>}
            <Button
              bgGradient={"linear(to-r, green.300, green.500)"}
              onClick={() => {
                SendRequest(choosenTraits);
              }}
            >
              Mint Photo
            </Button>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={close}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(FiltersModal);
