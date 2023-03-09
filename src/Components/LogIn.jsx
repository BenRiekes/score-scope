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
    FormControl, FormLabel, 
    FormErrorMessage, FormHelperText, PinInput, 
    PinInputField, Input, HStack, VStack, StackDivider, Box
} from '@chakra-ui/react'


const LogIn = () => {

    const { isOpen, onOpen, onClose } = useDisclosure(); 

    return (

        <>
            <Button onClick={onOpen}>Log In</Button>

            <Modal isCentered size = 'md' motionPreset = 'slideInBottom' onClose = {onClose} isOpen = {isOpen} >

                <ModalOverlay />

                <ModalContent>

                    <ModalHeader>Welcome Back</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>

                        <FormControl>

                            <VStack 
                                align = 'stretch'
                                spacing = {5}
                                divider = {<StackDivider borderColor='gray.200' />}
                               
                            >
                                <Box>
                                    <FormLabel>Email Address</FormLabel>
                                    <Input type = 'email' />
                                    <FormHelperText>We'll never share your email</FormHelperText>
                                </Box>

                                <Box>
                                    <FormLabel>Password</FormLabel>
                                    <HStack>
                                        <PinInput type = 'alphanumeric' mask>
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                            <PinInputField />
                                        </PinInput>
                                    </HStack>
                                </Box>
                                
                                <Button colorScheme = 'teal' varient = 'solid'>Log In</Button>
                            </VStack>

                        </FormControl>

                        
                    </ModalBody>

                    <ModalFooter style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
   
                        <Button varient = 'link'>Dont have an account? Sign up here</Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    )
}

export default LogIn; 