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
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
         
} from "@chakra-ui/react";





const CreateAccount = () => {

    const { isOpen, onOpen, onClose } = useDisclosure(); 

    const [age, setAge] = useState(); 
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');

    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(['', '']); 

    const [genderMap, setGenderMap] = useState(new Map([
        [0, {genderVal: 'Male', checked: false}],
        [1, {genderVal: 'Female', checked: false}],
        [2, {genderVal: 'Other', checked: false}]
    ]));

    //------------------------------------------------------------------

    const createUser = async () => {

        const formParams = {
            password: [password[0], password[1]],
            username: username, 
            gender: gender,
            age: age
        }

        let form = await CreateValidation(formParams); 

        if (form.isValid === false) {
            alert (form.reason);
            return; 
        }

        try {

            const firebaseCreateAccount = httpsCallable(getFunctions(), "createUser");
            const userCredential =  await createUserWithEmailAndPassword(auth, email, password);

            if (userCredential) {

                firebaseCreateAccount ({

                    uid: userCredential.uid,
                    username: username,
                    password: [password[0], password[1]],
                    gender: gender,
                    age: age

                }).then(response => {

                    if (response.data != "Account Successfully Created") {
                        alert("An error occured while creating your account");
                        return; 
                    }

                    alert("Account successfully created"); 
                    return; 

                }).catch(error => {

                    console.log("An error occured " + error); 
                })
            }

        } catch (error) {

            let errorCode = error.code; 

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
        }
    }

  
    //------------------------------------------------------------------

    const handlePassword = (newChar, passwordIndex) => {
 
        setPassword([...password.slice(0, 1), password[passwordIndex] + newChar, ...password.slice(1)]);
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
                mapCopy.set(boxKey, boxObj)
                setGender(undefined); 
            
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
                scrollBehavior = 'inside'
                motionPreset = 'slideInBottom'
                isOpen = {isOpen} isCentered onClose = {onClose}
            >
                <ModalOverlay />

                <ModalContent>

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
                                        onChange = {(event) => setEmail(email + event.target.value)}
                                    />
                                    <FormHelperText>We'll never share your email</FormHelperText>
                                </Box>

                                

                                <Box>
                                    <FormLabel m={2}>Username</FormLabel>
                                    <Input 
                                        type = 'username' 
                                        onChange = {(event) => setUsername(username + event.target.value)}
                                    />
                                    <FormHelperText>Username must be at least 3 characters, alphanumeric </FormHelperText>
                                </Box>
                                
                                <Box>
                                    <FormLabel>Password</FormLabel>

                                    <HStack>
                                        <PinInput type = 'alphanumeric'>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 0)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 0)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 0)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 0)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 0)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 0)}/>
                                        </PinInput>
                                    </HStack>

                                    <FormHelperText>Password must be 6 characters, alphanumeric </FormHelperText>   
                                </Box>

                                <Box>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <HStack>
                                        <PinInput type = 'alphanumeric' mask>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 1)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 1)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 1)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 1)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 1)}/>
                                            <PinInputField 
                                                onChange = {(event) => handlePassword(event.target.value, 1)}/>
                                        </PinInput>
                                    </HStack>
                                </Box>

                                <Box>
                                    <FormLabel>Age</FormLabel>

                                    <NumberInput
                                        size = 'md'
                                        maxW = {32}
                                        min = {18}
                                        max = {100}
                                        defaultValue = {18}
                                        keepWithinRange={true}
                                        clampValueOnBlur={true}
                                    >
                                        
                                        <NumberInputField onChange = {(event) => setAge(event.target.value)}/>
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>

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

                               
                                <Button colorScheme = 'teal' varient = 'solid'>Create</Button>
                            </VStack>
                            
                        </FormControl>

                    </ModalBody>

                </ModalContent>

            </Modal>
        </>
    )
}

export default CreateAccount; 