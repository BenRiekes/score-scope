//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";

//Styles:
import { 
    Modal, ModalHeader, ModalBody, ModalContent,  
    ModalOverlay, ModalFooter, ModalCloseButton, FormControl, 
    FormLabel, FormErrorMessage, FormHelperText, PinInputField, 
    PinInput, Checkbox, StackDivider,  VStack, HStack, Input, Button, Box, useDisclosure  
         
} from "@chakra-ui/react";

import {
    NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
} from '@chakra-ui/react'


const CreateAccount = () => {

    const { isOpen, onOpen, onClose } = useDisclosure(); 

    const [age, setAge] = useState(); 
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState();
    const [password, setPassword] = useState(['', '']); 

    const [genderMap, setGenderMap] = useState(new Map([
        [0, {genderVal: 'Male', checked: false}],
        [1, {genderVal: 'Female', checked: false}],
        [2, {genderVal: 'Other', checked: false}]
    ]));
    
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
                                    <Input type = 'username'/>
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