//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";
import CreateValidation from "../Functions/CreateValidation";

import firebase from 'firebase/compat/app';
import { auth, db } from "../firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { httpsCallable, getFunctions } from "firebase/functions";


//Styles:
import { 
    Modal, ModalHeader, ModalBody, ModalContent,  
    ModalOverlay, ModalFooter, ModalCloseButton, FormControl, 
    FormLabel, FormErrorMessage, FormHelperText, PinInputField, 
    PinInput, Checkbox, StackDivider,  VStack, HStack, Input, Button, Box, useDisclosure, NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Spinner
         
} from "@chakra-ui/react";


const CreateAccount = () => {

    const { isOpen, onOpen, onClose } = useDisclosure(); 
    const [creationLoading, setCreationLoading] = useState(false);
    

    const [age, setAge] = useState(18); 
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [username, setUsername] = useState('');  

    const [passwordMap, setPasswordMap] = useState(new Map([
        [0, ['', '','','','','']],
        [1, ['','','','','','']]
    ])); 

    const [genderMap, setGenderMap] = useState(new Map([
        [0, {genderVal: 'Male', checked: false}],
        [1, {genderVal: 'Female', checked: false}],
        [2, {genderVal: 'Other', checked: false}]
    ]));

    useEffect(() => {
        console.log(age);
    },[age]);

    //------------------------------------------------------------------

    const createUser = async () => {

        setCreationLoading(true);

        const password1 = passwordMap.get(0).join('');
        const password2 = passwordMap.get(1).join('');

        const formParams = {
            password: [
                password1,
                password2
            ],
            username: username, 
            gender: gender,
            age: age
        }

        //-----------------------------------------------------

        const form = await CreateValidation(formParams); 

        if (form.isValid === false) {
            setCreationLoading(false);
            alert (form.reason);
            return; 
        }

        //-----------------------------------------------------

        //Firebase auth createion and handeling: 
        const userCredential =  await createUserWithEmailAndPassword(auth, email, password1).catch (error => {

            setCreationLoading(false);
            let errorCode = error.message; 

            switch (errorCode) {
    
                case errorCode === 'auth/weak-password' : 
                    alert ("Password is too weak"); 
                    break; 
                case errorCode === 'auth/email-already-in-use' :
                    alert ("Account already exist");
                    break; 
                case errorCode == 'auth/invalid-email' :
                    alert ("Invalid email"); 
                default:
                    alert (error.message); 
                    break; 
            }
        })

        //-----------------------------------------------------

        if (!userCredential) {
            setCreationLoading(false);
            return; 

        }  else {

            //Firebase function to call after create user isntance has been successfull
            const firebaseCreateAccount = httpsCallable(getFunctions(), "createUser");
            
            const response = await firebaseCreateAccount ({

                uid: userCredential.user.uid,
                username: username,  
                gender: gender,
                email: email,
                age: parseInt(age)

            })
            
            if (response.data.isValid === false) {
                setCreationLoading(false);
                alert("An error occured while creating your account");
                return; 

            } else {
                setCreationLoading(false); onClose();
                alert("Account successfully created"); 
                window.location.reload();
                return; 
            }   
  
        }
    }

  
    //------------------------------------------------------------------

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

    const toggleGender = (boxKey) => {

        const mapCopy = new Map(genderMap); 
        let boxObj = mapCopy.get(boxKey);

        const prevCheck = () => {

            for (let i = 0; i < mapCopy.size; i++) {

                if (mapCopy.get(i).checked === true && i != boxKey) {
                    return i; 
                }
            }
            return undefined; 
        }

        //------------------------------------------------------------------
        
        if (boxObj.checked) { boxObj.checked = false;

            mapCopy.set(boxKey, boxObj)
            setGender(undefined); 
    
        } else { boxObj.checked = true; 

            if (prevCheck() === undefined) {
                mapCopy.set(boxKey, boxObj);
                setGender(boxObj.genderVal); 
            
            } else {

                let prevKey = prevCheck();
                let prevObj = mapCopy.get(prevKey); 
                prevObj.checked = false; 

                mapCopy.set(prevKey, prevObj)
                mapCopy.set(boxKey, boxObj)
                setGender(boxObj.genderVal);   
            }
        }

        setGenderMap(mapCopy);
    }

    //------------------------------------------------------------------
    
    return (

        <>
            <Button onClick={onOpen}>Create Account</Button>

            <Modal 
                size = 'md'
                maxH = '30%'
                scrollBehavior = 'inside'
                motionPreset = 'slideInBottom'
                isOpen = {isOpen} isCentered onClose = {onClose}
                
            >
                <ModalOverlay />

                <ModalContent style = {{maxH:'20px'}}>

                    <ModalHeader>Create Account</ModalHeader>
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
                                    <Input 
                                        type = 'email' 
                                        onChange = {(event) => setEmail(event.target.value)}
                                    />
                                    <FormHelperText>We'll never share your email</FormHelperText>
                                </Box>

                                <Box>
                                    <FormLabel m={2}>Username</FormLabel>
                                    <Input 
                                        type = 'username' 
                                        onChange = {(event) => setUsername(event.target.value)}
                                        
                                    />
                                    <FormHelperText>Username must be at least 3 characters, alphanumeric </FormHelperText>
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

                                    <FormHelperText>Password must be 6 characters, alphanumeric </FormHelperText>   
                                </Box>

                                <Box>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <HStack>
                                        <PinInput type = 'alphanumeric'>
                                        <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (1, 0, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (1, 1, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (1, 2, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (1, 3, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (1, 4, event.target.value, event.target.keyCode)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword
                                                (1, 5, event.target.value, event.target.keyCode)}/>
                                        </PinInput>
                                    </HStack>
                                </Box>

                                <Box>
                                    <FormLabel>Age</FormLabel>

                                    <NumberInput
                                        size = 'md'maxW = {32} min = {18} max = {100}
                                        defaultValue = {18}
                                        keepWithinRange={true}
                                        clampValueOnBlur={true}
                                    > 
                                        <NumberInputField onChange = {(event) => setAge(event.target.value)}/>
                                    </NumberInput>
                                            
                                    <FormHelperText>Must be 18 or older</FormHelperText>
                                </Box>
                                
                                <Box> 
                                    <FormLabel>Gender</FormLabel>

                                    <HStack>
                                        <Checkbox
                                            size = 'md'
                                            colorScheme = 'teal'
                                            isChecked = {genderMap.get(0).checked}

                                            onChange = {() => {
                                                toggleGender(0);
                                            }}
                                        >Male</Checkbox>
                                        
                                        <Checkbox
                                            size = 'md'
                                            colorScheme = 'teal'    
                                            isChecked = {genderMap.get(1).checked}

                                            onChange = {() => {
                                                toggleGender(1);
                                            }}
                                        >Female</Checkbox>

                                        <Checkbox
                                            size = 'md'
                                            colorScheme = 'teal'
                                            isChecked = {genderMap.get(2).checked}

                                            onChange = {() => {
                                                toggleGender(2);
                                            }}
   
                                        >Other</Checkbox>
                                    </HStack>
                                </Box>
                                    
                                
                                <Button 
                                    colorScheme = 'purple' varient = 'solid'
                                    isLoading = {creationLoading}
                                    onClick = {createUser}
                                >   
                                    Create
                                </Button>
                            </VStack>                           
                        </FormControl>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CreateAccount; 