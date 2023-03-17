//React:
import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useState, useRef, useEffect } from "react";

import { checkEmail, valueExist } from "../Functions/CreateValidation";

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
       email: {error: false, message: ''},
       password: {error: false, message: ''}
    })
    
    const [loading, setLoading] = useState(false); 

    useState(() => {
        console.log(invalid)
    }, [invalid]);

    //------------------------------------------------------------------

    const handleClose = () => {
        onClose(); 

        setForm({
            email: '',
            password: ''
        })

        setInvalid({
            email: {error: false, message: ''},
            password: {error: false, message: ''}
        }); 

        setLoading(false);
    }

    
    //------------------------------------------------------------------

    const handleInvalid = (field, error, message) => {

        setInvalid(prev => ({...prev, 
            [field]: {error: error, message: message}
        }));
    }

    const handleForm = (e) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value})); 

        if (e.target.value === '') {
            handleInvalid(e.target.name, true, 'Required Field');
        } 

        handleInvalid(e.target.name, false, '');
    }

    


    //------------------------------------------------------------------

    const handleLogIn = async () => {

        //Static error check: ----------------------------------

        

        const finalCheck = () => {
            let trigger;

            if (form.email === '') {
                handleInvalid('email', true, 'Required Field');
                trigger = true; 
            }

            if (form.password === '') {
                handleInvalid('password', true, 'Required Field');
                trigger = true; 
            }

            return trigger; 
        }
        
        if (finalCheck()) return; 


        //Limit queries ----------------------------------------

        const queryCheck = await valueExist('email', form.email); 

        if (!(queryCheck.error)) {
            handleInvalid('email', true, `${form.email} does not exist`);
            return; 
        }

        //Limit queries ----------------------------------------

        setLoading(true); 

        setTimeout(() => {

            signInWithEmailAndPassword(getAuth(), form.email, form.password).then (userCredential => {

                if (!userCredential) {
                    setLoading(false); 

                    handleInvalid('email', true, 'Incorrect username or password');
                    handleInvalid('password', true, 'Incorrect username or password');

                    return; 
                } 

                onClose(); 
                
            }).catch(error => {

                handleInvalid('email', true, 'Incorrect username or password');
                handleInvalid('password', true, 'Incorrect username or password');

                setLoading(false); 
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

                                <FormControl isInvalid = {invalid.email.error}>

                                    <FormLabel>Email Address</FormLabel>

                                    <Input 
                                        type = 'email' name = 'email' 
                                        onChange = {handleForm}
                                    />

                                    {invalid.email.error ? (
                                        <FormErrorMessage>
                                            {invalid.email.message}
                                        </FormErrorMessage>
                                        
                                    ) : (
                                        <FormHelperText>
                                            We'll never share your email
                                        </FormHelperText>
                                    )}

                                </FormControl>

                            </Box>

                            <Box>
                                <FormControl isInvalid = {invalid.password.error}>

                                    <FormLabel>Password</FormLabel>

                                    <Input 
                                        type = 'password' name = 'password'  
                                        onChange = {handleForm}
                                    />

                                    {invalid.password.error ? (
                                        <FormErrorMessage>
                                            {invalid.password.message}
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