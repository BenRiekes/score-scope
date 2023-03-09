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
    const [password, setPassword] = useState('');
    const [luanchCreate, setLuanchCreate] = useState(false); 

    //------------------------------------------------------------------

    useState(() => { //FIX ME 

        if (luanchCreate) {
            onClose()
            return <CreateAccount />
        }

    }, [luanchCreate])

    //------------------------------------------------------------------

    const handleLogIn = () => {

        signInWithEmailAndPassword(getAuth(), email, password).then (userCredential => {

            navigate("/profile"); 

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
                                        <PinInput type = 'alphanumeric' mask>
                                            <PinInputField 
                                                onChange = {(event) => setPassword(password + event.target.value)}/>
                                            <PinInputField 
                                                onChange = {(event) => setPassword(password + event.target.value)}/>
                                            <PinInputField 
                                                onChange = {(event) => setPassword(password + event.target.value)}/>
                                            <PinInputField 
                                                onChange = {(event) => setPassword(password + event.target.value)}/>
                                            <PinInputField 
                                                onChange = {(event) => setPassword(password + event.target.value)}/>
                                            <PinInputField 
                                                onChange = {(event) => setPassword(password + event.target.value)}/>
                                        </PinInput>
                                    </HStack>
                                </Box>
                                
                                <Button colorScheme = 'teal' varient = 'solid'>Log In</Button>
                            </VStack>

                        </FormControl>

                    </ModalBody>

                    <ModalFooter style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
   
                        <Button varient = 'link' onClick = {() => {
                            setLuanchCreate(true);
                        }}>Dont have an account? Sign up here</Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    )
}

export default LogIn; 