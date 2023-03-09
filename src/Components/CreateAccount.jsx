//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";

//Styles:
import { 
    Modal, ModalHeader, ModalBody, ModalContent, Input,
    ModalOverlay, ModalFooter, Button, useDisclosure, ModalCloseButton, Radio, 
    RadioGroup, HStack, FormControl, FormLabel, FormErrorMessage, FormHelperText, 
    VStack, StackDivider, Box, Checkbox, 
} from "@chakra-ui/react";


const CreateAccount = () => {

    const { isOpen, onOpen, onClose } = useDisclosure(); 

    const [age, setAge] = useState(); 
    const [gender, setGender] = useState();

    const [genderMap, setGenderMap] = useState(new Map([
        [0, {genderVal: 'Male', checked: false}],
        [1, {genderVal: 'Female', checked: false}],
        [2, {genderVal: 'Other', checked: false}]
    ])); 

    
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
                                    <Input type = 'email' />
                                    <FormHelperText>We'll never share your email</FormHelperText>
                                </Box>

                                <Box>
                                    <FormLabel m={2}>Username</FormLabel>
                                    <Input type = 'username' />
                                </Box>
                                
                                
                                <Box>
                                    <FormLabel>Password</FormLabel>
                                    <Input type = 'password' />
                                    <FormHelperText>Password must be 6 characters, alphanumeric </FormHelperText>   

                                </Box>

                                <Box>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <Input type = 'password' />
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
                                
                                <Button colorScheme = 'teal' varient = 'solid'>Log In</Button>
                            </VStack>
                            
                        </FormControl>

                    </ModalBody>

                </ModalContent>

            </Modal>
        </>
    )
}

export default CreateAccount; 