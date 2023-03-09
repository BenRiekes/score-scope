//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";

//Firebase:
import { 
    getAuth, createUserWithEmailAndPassword, 
    signOut, signInWithEmailAndPassword
} from "firebase/auth"; 

//Styling:
import { 
    Modal, ModalHeader, ModalBody, ModalContent,
    ModalOverlay, ModalFooter, Button, useDisclosure, ModalCloseButton
} from "@chakra-ui/react";

import {
    FormControl, FormLabel, FormErrorMessage, FormHelperText,
} from '@chakra-ui/react'


const LogIn = () => {

    const { isOpen, onOpen, onClose } = useDisclosure(); 

    return (

        <>
            <Modal isCentered onClose = {onClose} isOpen = {isOpen} motionPreset = 'slideInBottom'>

                <ModalOverlay />

                <ModalContent>

                    <ModalHeader>Log In</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>

                        <FormControl>
                            <FormLabel>Email Address</FormLabel>
                            <Input type = 'email' />
                            <FormHelperText>We'll never share your email</FormHelperText>
                        </FormControl>
                        
                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}

export default LogIn; 