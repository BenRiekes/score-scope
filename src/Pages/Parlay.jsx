//React Imports:
import React from "react";
import { useState, useRef, useEffect } from "react";

//Firebase:
import axios from 'axios'
import { httpsCallable, getFunctions } from "firebase/functions";


//Styling:
import Icon from '@mdi/react';
import "./PageStyles/ParlayStyles.css";

import { 
    HStack, Button, ButtonGroup, Heading,
    Flex, VStack, Box, Container
} from '@chakra-ui/react'; 

import {
    Accordion, AccordionItem, AccordionButton, 
    AccordionPanel, AccordionIcon, Spacer, Divider, useToast
} from '@chakra-ui/react'


import { 
    mdiBasketball, mdiFootball, mdiHockeyPuck, 
    mdiSoccer, mdiBaseball
} from '@mdi/js';

//Functions
import ScoringChart from "../Components/ScoringChart";

const Parlay = () => {
    const toast = useToast();

    //States: ---------------------------------------------------------
    const [selectedLeague, setSelectedLeague] = useState('NBA');

    const [parlayBoard, setParlayBoard] = useState({

        NBA: {
            filters: [
                { name: 'Points', isActive: true },
                { name: 'Rebounds', isActive: false },
                { name: 'Assist', isActive: false },
                { name: 'Pts + Rebs + Asts', isActive: false },
                { name: 'Blks + Stls', isActive: false },
                { name: '3-PT Made', isActive: false },
                { name: 'FT Made', isActive: false },
            ],
        }, 

        NFL: {
            filters: [
                { name: 'Touchdowns', isActive: true },
                { name: 'Interceptions', isActive: false },
                { name: 'Completions', isActive: false },
                { name: 'Sacks', isActive: false },
                { name: 'Passing Yards', isActive: false },
                { name: 'Recieving Yards', isActive: false },
                { name: 'Rushing Yards', isActive: false },
            ]
        },

        NHL: {
            filters: [
                { name: 'Points', isActive: true },
                { name: 'Goals', isActive: false },
                { name: 'Assists', isActive: false },
                { name: 'Shots on Goal', isActive: false },
                { name: 'Goals Allowed', isActive: false },
                { name: 'Saves', isActive: false },
            ]
        }, 

        MLB: {
            filters: [
                { name: 'Hits', isActive: true },
                { name: 'Strikeouts', isActive: false },
                { name: 'Total Bases', isActive: false },
                { name: 'Hits + Walks', isActive: false },
                { name: 'Pitching Outs', isActive: false },
            ]
        }, 

        MLS: {
            filters: [
                { name: 'Goals', isActive: true },
                { name: 'Shots on Goal', isActive: false },
                { name: 'Saves', isActive: false },
                { name: 'Goals Allowed', isActive: false },
            ]
        },

        leagueButtons: [
            { name: 'NBA', isActive: true, icon: mdiBasketball },
            { name: 'NFL', isActive: false, icon: mdiFootball },
            { name: 'NHL', isActive: false, icon: mdiHockeyPuck },
            { name: 'MLB', isActive: false, icon: mdiBaseball },
            { name: 'MLS', isActive: false, icon: mdiSoccer }
        ], 
    }); 

    
    //--------------------------------------------------------------------

    const handleLeagueChange = (buttonName) => {

        //Check if league is current being offered

        const validLeagues = {
            NBA: true, NFL: true, 
            NHL: true, MLB: true, MLS: true
        }

        if (!(validLeagues[buttonName])) { 

            return (
                toast({
                    position: 'top',
                    title: buttonName + ' is coming soon!',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })  
            )
        }

        //--------------------------------------

        //Get index of the current active button
        const prevIndex = parlayBoard.leagueButtons.findIndex(
            button => button.isActive === true
        ); 
        
        //Get index of the new button
        const newIndex = parlayBoard.leagueButtons.findIndex(
            button => button.name === buttonName
        );

        if (prevIndex === newIndex) return; 
        
        //Set state 
        setParlayBoard(prev => {

            const updatedButtons = [...prev.leagueButtons]; 

            updatedButtons[prevIndex] = {
                ...updatedButtons[prevIndex], isActive: false
            }; 

            updatedButtons[newIndex] = {
                ...updatedButtons[newIndex], isActive: true
            };
            
            return { ...prev, leagueButtons: updatedButtons }; 
        }); 

        setSelectedLeague(buttonName);
    }

    //--------------------------------------------------------------------

    const handleFilterChange = (filterName) => {

        const prevIndex = parlayBoard[selectedLeague].filters.findIndex(
            filter => filter.isActive === true
        ); 

        const newIndex = parlayBoard[selectedLeague].filters.findIndex(
            filter => filter.name === filterName
        ); 

        if (prevIndex === newIndex) return; 

        setParlayBoard(prev => {

            const updatedFilters = [...prev[selectedLeague].filters]; 

            updatedFilters[prevIndex] = {
                ...updatedFilters[prevIndex], isActive: false
            }; 

            updatedFilters[newIndex] = {
                ...updatedFilters[newIndex], isActive: true
            };
            
            return {
                ...prev, [selectedLeague]: {
                    ...prev[selectedLeague], filters: updatedFilters
                }
            }
        })
    }

    //--------------------------------------------------------------------

    return (

        <div className = "parlay-wrapper">

            <HStack style = {{margin: '1.5%'}}>

                <ButtonGroup varient = 'outline' spacing = '6' size = 'lg'>

                    <Heading style = {{color: 'white'}}>Leagues:</Heading>

                    {parlayBoard.leagueButtons.map((button) => {

                        return (
                            <Button
                                key = {button.name}

                                rightIcon = {<Icon path = {button.icon} size = {1} />}
                                colorScheme = {selectedLeague === button.name ? 'purple' : 'whiteAlpha'}

                                onClick = {() => {
                                    handleLeagueChange(button.name); 
                                }}
                                
                            >
                                {button.name}
                            </Button>
                        ) 
                    })}
                </ButtonGroup>

            </HStack>

            <hr style = {{border: 'none', borderTop: '3px solid #2d2d2d'}}/>
            
            <Box 
                bg = '#2d2d2d'
                borderRadius = 'md' 
                style = {{ margin: '1.5%', padding: '.75%', width: '60%' }}
            >

                <VStack style = {{alignItems: 'flex-start', gap: '10px'}}>

                    <ButtonGroup  
                        spacing = '8' 
                        size = 'lg' 
                        colorScheme = 'whiteAlpha' 
                        variant = 'link'
                    >
                        <Heading style = {{ color: 'white'}}>
                            The Board:
                        </Heading>

                        <Button color = 'white'>How 2 Play</Button>
                        <ScoringChart defaultIndex = {selectedLeague}/>
                        <Button color = 'white'>Prize Chart</Button>

                    </ButtonGroup>
                                    
                    <ButtonGroup spacing = '5' size = 'sm'>

                        {parlayBoard[selectedLeague].filters.map((filter) => {

                            return (

                                <Button 
                                    key = {filter.name} 
                                    borderRadius = 'xl' color = 'white'

                                    colorScheme = {filter.isActive ? 'purple' : 'whiteAlpha'} 
                                    variant = {filter.isActive ? 'solid' : 'outline'} 

                                    onClick = {() => {
                                        handleFilterChange(filter.name);
                                    }}
                                >
                                    {filter.name}
                                </Button>
                            )
                        })}

                    </ButtonGroup>

                </VStack>

            </Box>
           
        </div>
    )
}

export default Parlay; 