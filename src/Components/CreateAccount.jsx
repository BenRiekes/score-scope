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
    checkAll, checkEmail, checkUsername, checkPassword,
    checkSetPassword, checkAge, checkGender, checkSpecific, valueExist
} from "../Functions/CreateValidation";

//Styles:
import { 
    Modal, ModalHeader, ModalBody, ModalContent,  
    ModalOverlay, ModalCloseButton, FormControl, 
    FormLabel, FormErrorMessage, FormHelperText, PinInputField, 
    Checkbox, StackDivider,  VStack, HStack, Input, Button, Box, useDisclosure, NumberInput, NumberInputField,
         
} from "@chakra-ui/react";


const CreateAccount = () => {

    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const [submitting, setSumbitting] = useState(false);
    
    const [form, setForm] = useState({
        email: '', username: '', password: '', 
        setPassword: '', age: 0, gender: ''
    });

    const [genderBox, setGenderBox] = useState({
        'Male': false, 'Female': false, 'Other': false
    }); 
    
    const [invalid, setInvalid] = useState({
        email: {error: false, message: ''},
        username: {error: false, message: ''},
        password: {error: false, message: ''},
        setPassword: {error: false, message: ''}, 
        age: {error: false, message: ''},
        gender: {error: false, message: ''},
    });

    
   
    //------------------------------------------------------------------

    const handleClose = () => {
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

    const handleForm = (e) => {
        e.preventDefault();
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));

        if (e.target.name == 'setPassword') {
            setInvalid(prev => ({...prev, [e.target.name]: checkSetPassword(e.target.value, form.password)}));
        } else {
            setInvalid(prev => ({...prev, [e.target.name]: checkSpecific(e.target.name, e.target.value)}));
        }
    }

    //------------------------------------------------------------------

    const handleCheckbox = (e) => {
        e.preventDefault();

        const getTrueKeys = () => {
            let trueKeys = []; 
            const keys = ['Male', 'Female', 'Other']; 
            
            for (let i = 0; i < keys.length; i++) {
                if (genderBox[keys[i]] === true) {
                    trueKeys.push(keys[i]); 
                }
            }
            return trueKeys; 
        }

        const trueKeys = getTrueKeys();

        switch (true) {
            case !trueKeys: // All boxes empty
                setGenderBox(prev => ({ ...prev, [e.target.value]: true }));
                setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
                break;
          
            case trueKeys[0] != e.target.value: // One box to another
                setGenderBox(prev => ({...prev, [trueKeys[0]]: false, [e.target.value]: true}));
                setForm(prev => ({...prev, [e.target.name]: e.target.value}));

                setInvalid(prev => ({   //Being weird in create validation
                    ...prev, 
                    gender: ({error: false, message: 'false'})
                })); 
                break;
            case trueKeys[0] === e.target.value: // Uncheck box
                setGenderBox(prev => ({...prev, [e.target.value]: false}));
                setForm(prev => ({...prev, [e.target.name]: ''}));  
                
                setInvalid(prev => ({   //Being weird in create validation
                    ...prev, 
                    gender: ({error: true, message: 'Gender selection required'})
                })); 
              break;

            default:
              break;
        }


    }

    //------------------------------------------------------------------

    const createUser = async () => {

        if (checkAll(form) === true) return; 
        setSumbitting(true);
        
        setTimeout(async () => {

            //Firebase auth createion and handeling: 
            const userCredential =  await createUserWithEmailAndPassword(auth, form.email, form.password).catch (error => {

                let errorCode = error.message; 

                switch (errorCode) {
        
                    case errorCode === 'auth/weak-password' : 
                        alert("weak password")
                        break; 
                    case errorCode === 'auth/email-already-in-use' :
                        alert ("account already exist"); 
                        break; 
                    case errorCode == 'auth/invalid-email' :
                        alert ("invalid email"); 
                    default:
                        alert (error.message); 
                        break; 
                }
            })

            //-----------------------------------------------------

            if (!userCredential) {
                setSumbitting(false);
                return; 

            }  else {

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
                    alert("Account successfully created"); 
                    window.location.reload();
                    return; 
                }   
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

                                            onChange = {(e) => handleCheckbox(e)}
                                        >Male</Checkbox>
                                        
                                        <Checkbox
                                            size = 'md' colorScheme = 'purple' isChecked = {genderBox['Female']}
                                            name = 'gender' value = 'Female'

                                            onChange = {handleCheckbox}
                                        >Female</Checkbox>

                                        <Checkbox
                                            size = 'md' colorScheme = 'purple' isChecked = {genderBox['Other']}
                                            name = 'gender' value = 'Other'

                                            onChange = {(e) => handleCheckbox(e)}
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