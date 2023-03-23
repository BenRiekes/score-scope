//React:
import React from "react"; 
import { useState, useRef, useEffect, useReducer } from "react";

//Firebase: 
import firebase from 'firebase/compat/app';
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { httpsCallable, getFunctions } from "firebase/functions";

//Functions:

import { 
    checkAllErrors, setAllErrors, checkSpecific, 
    checkSetPassword, checkAge, checkGender,  valueExist, checkGenderBox
} from "../Functions/CreateValidation";

//Styles:
import { useToast } from '@chakra-ui/react'

import { 
    Modal, ModalHeader, ModalBody, ModalContent, ModalOverlay, 
    ModalCloseButton, FormControl, FormLabel, FormErrorMessage, Checkbox, 
    StackDivider,  VStack, HStack, Input, Button, Box, useDisclosure
} from "@chakra-ui/react";


const CreateAccount = () => {
    //Style State:
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const [submitting, setSumbitting] = useState(false);
    
    //Object of all form fields
    const [form, setForm] = useState({
        email: '', username: '', password: '', 
        setPassword: '', age: 0, gender: ''
    });

    //Object to conditionally display checkboxes
    const [genderBox, setGenderBox] = useState({
        'Male': false, 'Female': false, 'Other': false
    }); 
    
    //Object to conditionally display errors
    const [invalid, setInvalid] = useState({
        email: {error: false, message: ''},
        username: {error: false, message: ''},
        password: {error: false, message: ''},
        setPassword: {error: false, message: ''}, 
        age: {error: false, message: ''},
        gender: {error: false, message: ''},
    });

    
    //------------------------------------------------------------------

    const handleClose = () => { //Close form and reset all objects back to original state
        onClose();

        setForm({
            email: '', username: '', password: '', 
            setPassword: '', age: 0, gender: ''
        }); 

        setGenderBox({
            'Male': false, 'Female': false, 'Other': false
        })

        setInvalid({
            email: {error: false, message: ''},
            username: {error: false, message: ''},
            password: {error: false, message: ''},
            setPassword: {error: false, message: ''}, 
            age: {error: false, message: ''},
            gender: {error: false, message: ''},
        })

        setSumbitting(false);
    }

    //------------------------------------------------------------------

    const handleForm = (e) => { //Take the name of the field id for the key and set its value
        e.preventDefault();

        switch (e.target.name) {

            case 'gender' : 
                let result = checkGenderBox(genderBox, e.target.value);

                setGenderBox(result.genderBox); 
                setForm(prev => ({...prev, [e.target.name]: result.selectedGender})); 
                setInvalid(prev => ({...prev,[e.target.name]: result.invalid})); 
               
               break;  
            case 'setPassword' :
                setForm(prev => ({...prev, [e.target.name]: e.target.value}));

                setInvalid(prev => ({...prev, [e.target.name]: 
                    checkSetPassword(e.target.value, form.password)
                }));

                break; 
            default : 
                setForm(prev => ({...prev, [e.target.name]: e.target.value}));
                setInvalid(prev => ({
                    ...prev, [e.target.name]: 
                    checkSpecific(e.target.name, e.target.value)
                }));

                break;
        } 

    }

    //------------------------------------------------------------------

    const createUser = async () => {

        let finalCheck = await checkAllErrors(form); 

        if (!(finalCheck.passedCheck)){
            setInvalid(finalCheck.invalid);
            return; 
        }

        setSumbitting(true);
        
        setTimeout(async () => {

            //Firebase auth creation and handeling: 
            const userCredential =  await createUserWithEmailAndPassword (
                auth, form.email, form.password

            ).catch (error => {
                
                setSumbitting(false);
                alert(error.message);
                return;  
            })

            //-----------------------------------------------------

            if (!userCredential) { setSumbitting(false); return;} 

            //Firebase function to call after create user isntance has been successfull
            const firebaseCreateAccount = httpsCallable(getFunctions(), "createUser");
            
            const response = await firebaseCreateAccount ({
                uid: userCredential.user.uid,
                username: form.username,  
                gender: form.gender,
                email: form.email,
                age: form.age
            })
            
            if (response.data.isValid === false) {
                alert("An error occured while creating your account");
                setSumbitting(false); 
                return; 

            } else {
                onClose();
                toast({
                    position: 'top',
                    title: 'Account successfully created!',
                    description: 'Welcome to Score Scope',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
                return; 
            }   
        
        }, 1000);
          
    }    
   

    //------------------------------------------------------------------
    
    return (

        <>
            <Button onClick={onOpen}>Create Account</Button>

            <Modal 
                size = 'lg'
                maxH = '30%'
                scrollBehavior = 'inside'
                motionPreset = 'slideInBottom'
                isOpen = {isOpen} isCentered onClose = {handleClose}
                
            >
                <ModalOverlay />

                <ModalContent >

                    <ModalHeader>Create Account</ModalHeader>
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

                                    <Input type = 'email' name = 'email' 
                                        onChange = {handleForm}
                                    />

                                    {invalid.email.error ? (
                                        <FormErrorMessage>
                                            {invalid.email.message}
                                        </FormErrorMessage>
                                    ) : (
                                        <div/>
                                    )}
                                </FormControl>
                                
                            </Box>

                            <Box>
                                <FormControl isInvalid = {invalid.username.error}>

                                    <FormLabel m={2}>Username</FormLabel>

                                    <Input 
                                        type = 'username' name = 'username'  
                                        onChange = {handleForm}
                                    />

                                    {invalid.username.error ? (
                                        <FormErrorMessage>
                                            {invalid.username.message}
                                        </FormErrorMessage>
                                    ) : (
                                        <div/>
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
                                        <div/>
                                    )}
                                    
                                </FormControl>  
                            </Box>

                            <Box>
                                <FormControl isInvalid = {invalid.setPassword.error}>
                                    <FormLabel>Confirm Password</FormLabel>
                                    
                                    <Input 
                                        type = 'password' name = 'setPassword'  
                                        onChange = {handleForm}
                                    />

                                    {invalid.setPassword.error ? (
                                        <FormErrorMessage>
                                            {invalid.setPassword.message}
                                        </FormErrorMessage>
                                    ) : (
                                        <div/>
                                    )}
                                </FormControl>  
                            </Box>

                            <Box>
                                <FormControl isInvalid = {invalid.age.error}>
                                    <FormLabel>Age</FormLabel>

                                    <Input maxW = {32}
                                        type = 'number' name = 'age'  
                                        onChange = {handleForm}
                                    />

                                    {invalid.age.error ? (
                                        <FormErrorMessage>
                                            {invalid.age.message}
                                        </FormErrorMessage>
                                    ) : (
                                        <div/>
                                    )}
                                </FormControl>
                            </Box>
                            
                            <Box> 
                                <FormControl isInvalid = {invalid.gender.error}>
                                    <FormLabel>Gender</FormLabel>

                                    <HStack>
                                        <Checkbox
                                            size = 'md'
                                            colorScheme = 'purple' isChecked = {genderBox['Male']}
                                            name = 'gender' value = 'Male'

                                            onChange = {handleForm}
                                        >Male</Checkbox>
                                        
                                        <Checkbox
                                            size = 'md' colorScheme = 'purple' isChecked = {genderBox['Female']}
                                            name = 'gender' value = 'Female'

                                            onChange = {handleForm}
                                        >Female</Checkbox>

                                        <Checkbox
                                            size = 'md' colorScheme = 'purple' isChecked = {genderBox['Other']}
                                            name = 'gender' value = 'Other'

                                            onChange = {handleForm}
                                        >Other</Checkbox>
                                    </HStack>

                                    {invalid.gender.error ? (
                                        <FormErrorMessage>
                                            {invalid.gender.message}
                                        </FormErrorMessage>
                                    ) : (
                                        <div/>
                                    )}
                                </FormControl>
                                
                            </Box>
                                  
                            <Button 
                                colorScheme = 'purple' varient = 'solid'
                                isLoading = {submitting} loadingText = 'Creating...'
                                onClick = {createUser}
                            >   
                                Create
                            </Button>
                        </VStack>                           
                        
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateAccount; 