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
    const [genderChecked, setGenderChecked] = useState([true, false, false]); 


    const handleGender = (selectedGender, boxIndex) => {

        switch (selectedGender) {

            case selectedGender == gender: 
                setGender('');
                setGenderChecked([boxIndex] = false); 
                break; 

            case selectedGender != gender:
                setGender(selectedGender); 
                setGenderChecked([boxIndex] = true); 

                for (let i of genderChecked) {
                    if (i != boxIndex && i == true) {
                        setGenderChecked([i] = false); 
                    }
                }
                break; 

            default:
                break; 
        }
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
                                            isChecked = {[genderChecked[0]]}

                                            onChange = {handleGender('Male', 0)}
                                        >Male</Checkbox>
                                        
                                        <Checkbox
                                            size = 'md'
                                            colorScheme = 'teal'    
                                            isChecked = {[genderChecked[1]]}

                                            onChange = {handleGender('Female', 1)}
                                        >Female</Checkbox>

                                        <Checkbox
                                            size = 'md'
                                            colorScheme = 'teal'
                                            isChecked = {[genderChecked[2]]}
   
                                            onChange = {handleGender('Other', 2)}
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