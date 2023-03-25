//React:
import React from "react";

//Styling:
import Icon from "@mdi/react";

import {
    Modal, ModalOverlay, ModalContent, Button, Flex, Box,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Divider
} from '@chakra-ui/react'

import { 
    Tabs, TabList, Text,
    TabPanels, Tab, TabPanel 
} from '@chakra-ui/react'

import {
    List, ListItem, 
    ListIcon, OrderedList, UnorderedList,
} from '@chakra-ui/react'


import { 
    mdiFire, mdiArmFlex
} from '@mdi/js';

const prizeData = {

    powerPlays: { title: 'POWER PLAYS',

        description: 'If youre looking for a higher-risk, higher-reward play, look no further than Power Plays. You pick 2 or more player squares, and if they all win, you get a huge payout! But if even one loses, the entire entry loses.', 

        examples: [
            {case: '4-Pick Power Play', math: '4/4 = 10X', ex: 'A $10 winning 4-Pick Power pays $100 total.'},
            {case: '3-Pick Power Play', math: '3/3 = 5X', ex: 'A $10 winning 3-Pick Power pays $50 total.'},
            {case: '2-Pick Power Play', math: '2/2 = 3X', ex: 'A $10 2-Pick Power pays $30 total.'}
        ]  
    },

    flexPlays: { title: 'FLEX PLAYS', 

        description: 'Flex Plays are the safest way to play ScoreScope! You can still make a profit or win some money back even if a couple of your picks dont hit.', 

        examples: [

            {case: '6-Pick Flex Play', 
                math: '6/6 = 25X | 5/6 = 2X | 4/6 = 0.4X', 

                ex: `A $10 6-Pick Flex that goes 6/6 pays $250 total.
                    A $10 6-Pick Flex that goes 5/6 pays $20 total.
                    A $10 6-Pick Flex that goes 4/6 pays $4 total.
                `    
            },

            { case: '5-Pick Flex Play',
                math: '5/5 = 10X | 4/5 = 2X | 3/5 = 0.4X',

                ex: `A $10 5-Pick Flex that goes 5/5 pays $100 total. 
                    A $10 5-Pick Flex that goes 4/5 pays $20 total.
                    A $10 5-Pick Flex that goes 3/5 pays $4 total.
                `    
            },

            { case: '4-Pick Flex Play',

                math: '4/4 = 5X |  3/4 = 1.5X',

                ex: `A $10 4-Pick Flex that goes 4/4 = $50.
                    A $10 4-Pick Flex that goes 3/4 = $15.
                `    
            },

            { case: '3-Pick Flex-Play',

                math: '3/3 = 2.25X | 2/3 = 1.25X',

                ex: `A $10 3-Pick Flex that goes 3/3 = $20.
                    A $10 3-Pick Flex that goes 2/3  = $12.50.
                `
            }
        ]
    }
}

const PrizeChart = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    //--------------------------------------------------------------------

    const generateList = (prizeKey) => {

        if (!(prizeData[prizeKey])) return null; 

        const calculuateLines = (str) => {
            let count = 0; 

            for (let i = 0; i < str.length; i++) {

                if (str[i] === '.' || str[i] === '|' || '!' || ',') {
                    count++; 
                }
            }

            return count; 
        }

        return (

            <Flex direction = 'column' alignItems = 'flex-start'>
                
                <Box p = '5px' bg = 'purple.300' borderRadius = 'md' marginBottom = '5px'>
                    <Text>{prizeData[prizeKey].description}</Text>
                </Box>
               

                {prizeData[prizeKey].examples.map((listData, index) => {

                    return (

                        <UnorderedList spacing = {3} key = {index}>
                            
                            <ListItem>
                                {listData.case}
                            </ListItem>

                            <ListItem>
                                <Text noOfLines = {calculuateLines(listData.math)}>{listData.math}</Text>
                            </ListItem>

                            <ListItem>
                                <Text noOfLines = {calculuateLines(listData.ex)}>{listData.ex}</Text>
                            </ListItem>

                            <Divider borderWidth = '2px'/>
                        </UnorderedList>
                    )
                })}
                
            </Flex>
           
        )
    }

    return (
        <>

            <Button color = 'white' onClick = {onOpen}>
                Prize Chart
            </Button>
    
            <Modal
                size = 'md' 
                isCentered 
                scrollBehavior = 'inside'
                motionPreset = 'slideInBottom'  
                isOpen = {isOpen} onClose = {onClose}  
            >
                <ModalOverlay />

                <ModalContent maxHeight = '50%'>
                    
                    <ModalHeader>Prize Charts</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>

                        <Tabs 
                            isFitted variant='enclosed'
                        >
                            
                            <TabList mb = '1em'>

                                <Tab>
                                    <Flex direction = 'column' alignItems = 'center'>
                                        <Icon path={mdiFire} size={1} />
                                        Power Plays
                                    </Flex>
                                </Tab>

                                <Tab>
                                    <Flex direction = 'column' alignItems = 'center'>
                                        <Icon path={mdiArmFlex} size={1} />
                                        Flex Plays
                                    </Flex>
                                </Tab>

                            </TabList>

                            <TabPanels>

                               <TabPanel>
                                    {generateList('powerPlays')}
                               </TabPanel>

                               <TabPanel>
                                    {generateList('flexPlays')}
                               </TabPanel>
                            </TabPanels>

                        </Tabs>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default PrizeChart; 