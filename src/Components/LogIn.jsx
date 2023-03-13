//React:
import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useState, useRef, useEffect } from "react";
import CreateAccount from "./CreateAccount";

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

    //Import State:
    const navigate = useNavigate(); 
    const { isOpen, onOpen, onClose } = useDisclosure(); 

    //State:
    const [email, setEmail] = useState(''); 

    const [passwordMap, setPasswordMap] = useState(new Map([
        [0, ['', '','','','','']]
    ])); 

    const handlePassword = (passwordIndex, charIndex, newChar, keyCode) => {

       
        const mapCopy = new Map(passwordMap);
        const charArray = mapCopy.get(passwordIndex); 

        if (keyCode === 8) {
            charArray[charIndex] = '';
        } else {
            charArray[charIndex] = newChar;
        }   

        mapCopy.set(passwordIndex, charArray); 
        setPasswordMap(mapCopy);  
    } 



    //------------------------------------------------------------------

    const handleLogIn = () => {

        const password = passwordMap.get(0).join('');

        signInWithEmailAndPassword(getAuth(), email, password).then (userCredential => {

            onClose();
            window.location.reload();

        }).catch(error => {
            console.log("An error occured " + error); 
            alert ("An error occured while logging in"); 
        })
    }

    
    //------------------------------------------------------------------

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
                                    <Input type = 'email' onChange = {(event) => setEmail(event.target.value)} />
                                    <FormHelperText>We'll never share your email</FormHelperText>
                                </Box>

                                <Box>
                                    <FormLabel>Password</FormLabel>
                                    <HStack>
                                    <PinInput type = 'alphanumeric'>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (0, 0, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (0, 1, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (0, 2, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (0, 3, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (0, 4, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (0, 5, event.target.value, event.target.keyCode)}/>
                                        </PinInput>
                                    </HStack>
                                </Box>
                                
                                <Button colorScheme = 'purple' varient = 'solid' onClick = {handleLogIn}>Log In</Button>
                            </VStack>

                        </FormControl>

                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}

export default LogIn; 