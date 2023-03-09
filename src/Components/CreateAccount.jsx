//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";
import { 
    Modal, ModalHeader, ModalBody, ModalContent, Input,
    ModalOverlay, ModalFooter, Button, useDisclosure, ModalCloseButton, Radio, RadioGroup, Stack, FormControl, FormLabel, FormErrorMessage, FormHelperText
} from "@chakra-ui/react";



const CreateAccount = () => {
    const [value, setValue] = React.useState('1')
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
                    <FormLabel>Username</FormLabel>
                    <Input type = 'username' />

                    <FormLabel>Email Address</FormLabel>
                    <Input type = 'email' />
                    <FormHelperText>We'll never share your email</FormHelperText>

                    <FormLabel>Password</FormLabel>
                    <Input type = 'password' />
                    <FormHelperText></FormHelperText>

                    <FormLabel>Confirm Password</FormLabel>
                    <Input type = 'password' />

                    <FormLabel>
                    <RadioGroup onChange={setValue} value={value}>
                        <Stack direction='row'>
                            <Radio value='1'>First</Radio>
                            <Radio value='2'>Second</Radio>
                            <Radio value='3'>Third</Radio>
                        </Stack>
                        </RadioGroup>
                    </FormLabel>
                    <Input type = 'gender' />

                    <FormLabel>Over 18</FormLabel>
                    <Input type = 'ageverification' />


                    
                </FormControl>
                
            </ModalBody>

        </ModalContent>

        </Modal>
    </div>
}

export default CreateAccount; 