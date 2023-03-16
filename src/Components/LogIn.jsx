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
    
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [invalid, setInvalid] = useState({
        error: false,
        message: ''
    })
    
    const [loading, setLoading] = useState(false); 

    //------------------------------------------------------------------

    const handleClose = () => {
        onClose(); 

        setForm({
            email: '',
            password: ''
        })

        setInvalid({
            error: false,
            message: ''
        }); 

        setLoading(false);
    }

    
    //------------------------------------------------------------------

    const handleForm = (e) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value})); 
    }

    //------------------------------------------------------------------

    const handleLogIn = () => {

        setLoading(true); 

        setTimeout(() => {

            signInWithEmailAndPassword(getAuth(), form.email, form.password).then (userCredential => {

                if (!userCredential) {
                    setLoading(false); 
                    setInvalid({error: true, message: 'Incorrect username or password'});
                    return; 
                } 

                onClose(); 
                window.location.reload();
    
            }).catch(error => {
                setLoading(false);
                setInvalid({error: true, message: 'Incorrect username or password'}); 
                return; 
            })

        }, 500)
    }

    //------------------------------------------------------------------

    return (

        <>
            <Button onClick = {onOpen}>Log In</Button>

            <Modal 
                size = 'md' 
                isCentered 
                motionPreset = 'slideInBottom'  
                isOpen = {isOpen} onClose = {handleClose} 
            >

                <ModalOverlay />

                <ModalContent>

                    <ModalHeader>Welcome Back</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>

                        <VStack 
                            align = 'stretch'
                            spacing = {5}
                            divider = {<StackDivider borderColor='gray.200' />}
                        >
                            <Box>

                                <FormControl isInvalid = {invalid.error}>

                                    <FormLabel>Email Address</FormLabel>

                                    <Input 
                                        type = 'email' name = 'email' 
                                        onChange = {handleForm}
                                    />

                                    {invalid.error ? (
                                        <FormErrorMessage>
                                            {invalid.message}
                                        </FormErrorMessage>
                                        
                                    ) : (
                                        <FormHelperText>
                                            We'll never share your email
                                        </FormHelperText>
                                    )}

                                </FormControl>

                            </Box>

                            <Box>
                                <FormControl isInvalid = {invalid.error}>

                                    <FormLabel>Password</FormLabel>

                                    <Input 
                                        type = 'password' name = 'password'  
                                        onChange = {handleForm}
                                    />

                                    {invalid.error ? (
                                        <FormErrorMessage>
                                            {invalid.message}
                                        </FormErrorMessage>
                                            
                                    ) : (
                                        <FormHelperText>
                                            Never share your password
                                        </FormHelperText>
                                    )}

                                </FormControl>                                        
                            </Box>
                            
                            <Button colorScheme = 'purple' varient = 'solid'
                                isLoading = {loading} loadingText = 'Loggin in...'
                                onClick = {handleLogIn}
                            >
                                Log In
                            </Button>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default LogIn; 