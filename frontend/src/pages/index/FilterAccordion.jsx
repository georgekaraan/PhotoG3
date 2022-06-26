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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  AccordionPanel,
  Select,
} from "@chakra-ui/react";
import { memo, useLayoutEffect } from "react";
import { useEffect, useMemo, useState } from "react";
import TraitsService from "../../services/TraitsService";

const FilterAccordion = ({ id, name, onOptionClick, selfDelete }) => {
  const [values, setValues] = useState(null);
  useEffect(() => {
    TraitsService.GetTraitValues(id).then((res) =>
      setValues(res.map((el) => el.value))
    );
  }, [id]);

  useEffect(() => {
    if (values?.length === 0) selfDelete(id);
  }, [values]);

  if (!values) {
    return (
      <AccordionItem>
        <div
          className="left-right-anim"
          style={{ "--anim-delay": Math.random() + "s" }}
        >
          <Spinner size={"xl"}>Loading</Spinner>
        </div>
      </AccordionItem>
    );
  }
  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            {name}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <Select
          placeholder={"Select option for " + name}
          onChange={(e) => onOptionClick(name, e.target.value)}
          style={{ display: values ? "initial" : "none" }}
        >
          {values &&
            values.map((el) => {
              return (
                <option value={el.value} key={el}>
                  {el}
                </option>
              );
            })}
        </Select>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default memo(FilterAccordion);
