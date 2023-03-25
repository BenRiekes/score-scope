//React:
import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useState, useRef, useEffect } from "react";

//Styling:
import Icon from "@mdi/react";

import {
    Modal, ModalOverlay, ModalContent, Button, Flex,
    ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
} from '@chakra-ui/react'

import { 
    Tabs, TabList, 
    TabPanels, Tab, TabPanel 
} from '@chakra-ui/react'

import {
    Table, Thead, Tbody, Tfoot,
    Tr, Th, Td, TableCaption, TableContainer,
} from '@chakra-ui/react'

import { 
    mdiBasketball, mdiFootball, mdiHockeyPuck, 
    mdiSoccer, mdiBaseball
} from '@mdi/js';

//--------------------------------------------------------------------

const scoringData = {

    NBA: [
        { caption: 'NBA Scoring:',
            
            data: [
                { action: 'Point', points: '1' },
                { action: 'Rebound', points: '1.2' },
                { action: 'Assist', points: '1.5' },
                { action: 'Block', points: '3' },
                { action: 'Steal', points: '3' },
                { action: 'Turnover', points: '-1' }
            ]
        }
    ],

    NFL: [
        { caption: 'NFL Offensive Scoring:', 

            data: [
                { action: 'Passing Yards', points: '0.04 / yard' },
                { action: 'Passing TDs', points: '4' },
                { action: 'Interceptions', points: '-1' },
                { action: 'Rushing Yards', points: '0.1 / yard' },
                { action: 'Rushing TDs', points: '6 pts' },
                { action: 'Receiving Yards', points: '0.1 / yard' },
                { action: 'Receiving TDs', points: '6' },
                { action: 'Receptions', points: '1' },
                { action: 'Fumbles Lost', points: '-1' },
                { action: '2 Point Conversions', points: '2' },
                { action: 'Offensive Fumble Recovery Touchdown', points: '6' },
                { action: 'Kick/Punt/Field Goal Return Touchdown', points: '6' }
            ]
        },

        { caption: 'NFL DST Scoring:', 
        
            data: [
                { action: 'Sack', points: '1' },
                { action: 'Interception', points: '2' },
                { action: 'Fumble Recovery', points: '2' },
                { action: 'Punt/Kickoff/FG Return for TD', points: '6' },
                { action: 'Interception Return TD', points: '6' },
                { action: 'Fumble Recovery TD', points: '6' },
                { action: 'Blocked Punt or FG Return TD', points: '6' },
                { action: 'Safety', points: '2' },
                { action: 'Blocked Kick', points: '2' },
                { action: '2 Point Conversion', points: '2' },
                { action: '0 Point Allowed', points: '10' },
                { action: '1-6 Points Allowed', points: '7' },
                { action: '7-13 Points Allowed', points: '4' },
                { action: '14-20 Points Allowed', points: '1' },
                { action: '21-27 Points Allowed', points: '0' },
                { action: '28-34 Points Allowed', points: '-1' },
                { action: '35+ Points Allowed', points: '-4' }
            ]
        }, 

        { caption: 'NFL Kicker Scoring:',

            data: [
                { action: 'Field-goals from 0-39 yards', points: '3' },
                { action: 'Field-goals from 40-49 yards', points: '4' },
                { action: 'Field-goals from 50+ yards', points: '5' },
                { action: 'Extra-point conversions', points: '1' },
            ]
        }
    ],

    NHL: [
        { caption: 'NHL Scoring:',

            data: [
                { action: 'Goal', points: '8' },
                { action: 'Assists', points: '5' },
                { action: 'Shots on Goal', points: '1.5' },
                { action: 'Blocked Shots', points: '1.5' }
            ]
        }
    ],

    MLB: [
        { caption: 'Hitters Scoring:',

            data: [
                { action: 'Single', points: '3' },
                { action: 'Double', points: '5' },
                { action: 'Triple', points: '8' },
                { action: 'Home Run', points: '10' },
                { action: 'Run', points: '2' },
                { action: 'Run Batted In', points: '2' },
                { action: 'Base on Balls', points: '2' },
                { action: 'Hit By Pitch', points: '2' },
                { action: 'Stolen Base', points: '5' }
            ]
        },

        { caption: 'Pitchers Scoring:',

            data: [
                { action: 'Win', points: '6' },
                { action: 'Quality Start', points: '4' },
                { action: 'ER', points: '-3' },
                { action: 'K', points: '3' },
                { action: 'Out', points: '1' }
            ]
        }
    ],

    MLS: [
        { caption: 'MLS Scoring:',

            data: [
                { action: 'Goal', points: '5' },
                { action: 'Assist', points: '4' },
                { action: 'Goal from PEN', points: '3' },
                { action: 'Shot on Target', points: '2' },
                { action: 'Completed Pass', points: '0.1' },
                { action: 'Missed Pass', points: '-0.1' },
                { action: 'Yellow Card', points: '-1' },
                { action: 'Red Card', points: '-2' }
            ]
        },

        { caption: 'Goalie Scoring:',

            data: [
                { action: 'Match Played', points: '5' },
                { action: 'Save', points: '1' },
                { action: 'Goal Against', points: '-3' },
            ]
        }
    ]
}

//--------------------------------------------------------------------

const ScoringChart = (selectedLeague) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const scoringTabs = [
        { name: 'NBA', icon: mdiBasketball },
        { name: 'NFL', icon: mdiFootball },
        { name: 'NHL', icon: mdiHockeyPuck },
        { name: 'MLB', icon: mdiBaseball },
        { name: 'MLS', icon: mdiSoccer }
    ]; 

    const defaultIndex = scoringTabs.findIndex (
        league => league.name === selectedLeague.defaultIndex
    );

    //--------------------------------------------------------------------

    const generateTable = (leagueData) => {

        return leagueData.map((tableData, index) => (

            <TableContainer key = {index}>

                <Table size = 'sm' varient = 'simple' overflowX = 'auto'>
                    <TableCaption 
                        placement = 'top' 
                        fontSize={'25px'} fontWeight = {'700'} fontStyle = {'italic'} 
                    >
                        {tableData.caption}
                    </TableCaption>

                    <Thead>
                        <Tr >
                            <Th fontSize={'17.5px'} fontWeight = {'700'}>
                                Action
                            </Th>

                            <Th fontSize={'17.5px'} fontWeight = {'700'} isNumeric>
                                Points
                            </Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {tableData.data.map((rowData, index) => (
                            <Tr key = {index}>

                                <Td fontSize = {'20px'} style = {{ wordBreak: 'break-word', whiteSpace: 'normal'}}>
                                    {rowData.action}
                                </Td>

                                <Td fontSize={'20px'} isNumeric>
                                    {rowData.points}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>

                

            </TableContainer>
        ));
    } 

    

    //--------------------------------------------------------------------

    return (

        <>
            <Button color = 'white' onClick = {onOpen}>
                Scoring Chart
            </Button>
    
            <Modal
                size = 'md' 
                isCentered 
                scrollBehavior = 'inside'
                motionPreset = 'slideInBottom'  
                isOpen={isOpen} onClose={onClose}  
            >
                <ModalOverlay />

                <ModalContent maxHeight = '50%'>
                    
                    <ModalHeader>Scoring Charts</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>

                        <Tabs 
                            defaultIndex = {defaultIndex}
                            variant='enclosed' isFitted
                        >
                            <TabList>
                               
                                {scoringTabs.map((tab) => {
                                    return (
                                        <Tab key = {tab.name}>

                                            <Flex direction = 'column' alignItems = 'center'>
                                                <Icon path={tab.icon} size={1} />
                                                {tab.name}
                                            </Flex>
                                        </Tab>
                                    ) 
                                })}

                            </TabList>

                            <TabPanels>

                                {scoringTabs.map((tab) => {
                                    return (
                                        <TabPanel>
                                            {generateTable(scoringData[tab.name])}
                                        </TabPanel>
                                    ) 
                                })}

                            </TabPanels>

                        </Tabs>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ScoringChart;


