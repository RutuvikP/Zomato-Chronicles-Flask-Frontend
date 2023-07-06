import {Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { Chatbot } from "./Chatbot";

export const ChatBotModal = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
    <Box position="fixed" bottom="4" right="4">
          <Button colorScheme="yellow" onClick={onOpen}>
            Chat with AI Assistant
          </Button>
    </Box>
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Flavor Fusion AI Assistant</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Chatbot />
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
};
