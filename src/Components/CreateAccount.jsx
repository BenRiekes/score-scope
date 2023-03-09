//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";

//Styles:
import { 
    Modal, ModalHeader, ModalBody, ModalContent, Input,
    ModalOverlay, ModalFooter, Button, useDisclosure, ModalCloseButton, Radio, 
    RadioGroup, Stack, FormControl, FormLabel, FormErrorMessage, FormHelperText
} from "@chakra-ui/react";


const CreateAccount = () => {

    const [genderValue, setGenderValue] = React.useState('1')
    const [ageValue, setAgeValue] = React.useState('1')
    const [termValue, setTermValue] = React.useState('1')
    const { isOpen, onOpen, onClose } = useDisclosure(); 

    return <div>
        
        <button onClick={onOpen}>Create Account</button>
        <Modal isCentered onClose = {onClose} isOpen = {isOpen} motionPreset = 'slideInBottom'>

        <ModalOverlay />

        <ModalContent>

            <ModalHeader>Sign Up</ModalHeader>
            <ModalCloseButton />

            <ModalBody>

                <FormControl>
                    <FormLabel m={2}>Username</FormLabel>
                    <Input type = 'username' />
                    
                    <FormLabel>Email Address</FormLabel>
                    <Input type = 'email' />
                    <FormHelperText>We'll never share your email</FormHelperText>

                    <FormLabel>Password</FormLabel>
                    <Input type = 'password' />
                    <FormHelperText></FormHelperText>

                    <FormLabel>Confirm Password</FormLabel>
                    <Input type = 'password' />

                    <FormLabel>What is your Gender?</FormLabel>
                    <RadioGroup onChange={setGenderValue} value={genderValue} type="gender">
                        <Stack direction='row'>
                            <Radio value='1'>Female</Radio>
                            <Radio value='2'>Male</Radio>
                            <Radio value='3'>Other</Radio>
                        </Stack>
                    </RadioGroup>


                    <FormLabel>Are you Over 18 Years Old?</FormLabel>
                    <RadioGroup onChange={setAgeValue} value={ageValue} type="age">
                        <Stack direction='row'>
                            <Radio value='1'>No</Radio>
                            <Radio value='2'>Yes</Radio>
                        </Stack>
                    </RadioGroup>

                    <FormLabel>Do You Agree To the Terms And Conditions</FormLabel>
                    <RadioGroup onChange={setTermValue} value={termValue} type="term">
                        <Stack direction='row'>
                            <Radio value='1'>No</Radio>
                            <Radio value='2'>Yes</Radio>
                        </Stack>
                    </RadioGroup>
                    
                    <center>
                        <Button>Create Account</Button>
                    </center>
                    
                </FormControl>
            </ModalBody>
        </ModalContent>
        </Modal>
    </div>
}

export default CreateAccount; 