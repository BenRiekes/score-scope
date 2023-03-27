//React:
import React from "react";

//Styling:
import Icon from "@mdi/react";

import {
    mdiNumeric1Box, mdiNumeric2Box, mdiNumeric3Box, 
    mdiFire, mdiArmFlex, mdiCheckboxMultipleMarked, mdiArrowUpBoldBox, mdiArrowDownBoldBox
} from '@mdi/js'

import { 
    Modal, ModalHeader, ModalBody, ModalContent, 
    ModalOverlay, ModalFooter, Button, useDisclosure, ModalCloseButton, 
} from "@chakra-ui/react";

import { 
    Box, Image, Flex, Divider,
    Heading, Spacer, HStack, VStack, Text
} from "@chakra-ui/react";

import {
    List, ListItem
} from '@chakra-ui/react'


const ParlayInstructions = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const lebronImg = 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png'; 
    const mahomesImg =  'https://static.www.nfl.com/image/private/t_player_profile_landscape/f_auto/league/vs40h82nvqaqvyephwwu'; 

    return (
        <>
            <Button color = 'white' onClick = {onOpen}>
                How 2 Play
            </Button>

            <Modal 
                size = 'md' 
                isCentered 
                motionPreset = 'slideInBottom'  
                isOpen = {isOpen} onClose = {onClose} 
            >
                <ModalOverlay />

                <ModalContent>

                    <ModalHeader>How 2 Play</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>

                        <List spacing={3}>

                            <ListItem p = '5px' bg = '#2d2d2d' borderRadius = 'md' >
                                <Flex direction = 'column' gap = '5px'>
                                    <HStack>

                                        <Image 
                                            boxSize = '60px'
                                            objectFit = 'cover'
                                            src = {lebronImg}
                                            alt = 'Lebron James'
                                        />
                                        <Image 
                                            boxSize = '60px'
                                            objectFit = 'cover'
                                            src = {mahomesImg}
                                            alt = 'Patrick Mahomes'
                                        />

                                        <Icon path = {mdiCheckboxMultipleMarked} 
                                            size = {1.5} color = 'white'
                                        />
                                        <Icon path = {mdiNumeric1Box} size = {1} color = 'white'
                                            style = {{alignSelf: 'baseline', marginLeft: 'auto'}}
                                        />
                                    </HStack>

                                    <Heading size = 'sm' color = 'white'>
                                        Choose 2 or more players from any sport
                                    </Heading>
                                </Flex>
                            </ListItem>

                            <ListItem p = '5px' bg = '#2d2d2d' borderRadius = 'md'>
                                <Flex direction = 'column' gap = '5px'>
                                    <HStack>

                                        <Icon path = {mdiArrowUpBoldBox} 
                                            size = {1.5} color = 'white'
                                        />
                                    
                                        <Image 
                                            boxSize = '60px'
                                            objectFit = 'cover'
                                            src = {lebronImg}
                                            alt = 'Shohei Ohtani'
                                        />

                                        <Icon path = {mdiArrowDownBoldBox} 
                                            size = {1.5} color = 'white'
                                        />
                                        <Icon path = {mdiNumeric2Box} size = {1} color = 'white'
                                            style = {{alignSelf: 'baseline', marginLeft: 'auto'}}
                                        />
                                    </HStack>

                                    <Heading size = 'sm' color = 'white'>
                                        Go over or under on their projected stats
                                    </Heading>

                                </Flex>
                            </ListItem>

                            <ListItem p = '5px' bg = '#2d2d2d' borderRadius = 'md'>
                                <Flex direction = 'column' gap = '5px'>
                                    <HStack>

                                        <Icon path = {mdiArmFlex} 
                                            size = {1.5} color = 'white'
                                        />

                                        <Icon path = {mdiFire} 
                                            size = {1.5} color = 'white'
                                        />
                                        <Icon path = {mdiNumeric3Box} size = {1} color = 'white'
                                            style = {{alignSelf: 'baseline', marginLeft: 'auto'}}
                                        />
                                    </HStack>

                                    <Heading size = 'sm' color = 'white'>
                                       Select FLEX or POWER play
                                    </Heading>

                                    <Text fontSize = '12.5px' color = 'white'>
                                        • Flex Plays: You still win if one pick misses!
                                    </Text>

                                    <Text fontSize = '12.5px' color = 'white'>
                                        • Power Plays: Higher payouts, but you must get all your picks right.
                                    </Text>

                                </Flex>
                            </ListItem>

                        </List>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ParlayInstructions; 
