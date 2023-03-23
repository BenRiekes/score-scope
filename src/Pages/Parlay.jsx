//React Imports:
import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from 'axios'

//Styling:
import Icon from '@mdi/react';
import "./PageStyles/ParlayStyles.css";

import { 
    HStack, Button, ButtonGroup, Heading,
    Flex, VStack, Box, Container
} from '@chakra-ui/react'; 

import {
    Accordion, AccordionItem, AccordionButton, 
    AccordionPanel, AccordionIcon, Spacer, Divider
} from '@chakra-ui/react'

import { useToast } from '@chakra-ui/react'

import { 
    mdiBasketball, mdiFootball, mdiHockeyPuck, 
    mdiSoccer, mdiBaseball, mdiMixedMartialArts 
} from '@mdi/js';

//Functions
import { httpsCallable, getFunctions } from "firebase/functions";


const Parlay = () => {
    //Style State: 
    const toast = useToast();

    const [league, setLeague] = useState('NBA'); 

    const leagues = {
        NBA: true, NFL: false, NHL: false,
        MLB: false, MLS: false, MMA: false,    
    }; 

    const leagueButtons = [
        { name: 'NBA', colorScheme: 'purple', icon: mdiBasketball },
        { name: 'NFL', colorScheme: 'gray', icon: mdiFootball },
        { name: 'NHL', colorScheme: 'gray', icon: mdiHockeyPuck },
        { name: 'MLB', colorScheme: 'gray', icon: mdiBaseball },
        { name: 'MLS', colorScheme: 'gray', icon: mdiSoccer },
        { name: 'MMA', colorScheme: 'gray', icon: mdiMixedMartialArts },
    ];
    
    const nbaBoardFliters = [
        {name: 'Points', selected: true},
        {name: 'Rebounds', slected: false},
        {name: 'Assist', selected: false},
        {name: 'Steals', selected: false}, 
        {name: 'Turnovers', selected: false}, 

        {name: '3-PT Made', selected: false}, 
        {name: 'FT Made', selected: false}, 

        {name: 'Pts + Rebs + Asst', selected: false},
        {name: 'Pts + Rebs', selected: false},
        {name: 'Pts + Asst', selected: false},
        {name: 'Blks + Stls', selected: false}, 
    ]
   
    //--------------------------------------------------------------------

    
    const handleAPITest = async() => {

        const createTeams = httpsCallable(getFunctions(), "createNBATeams");
        
        createTeams(); 
    }

    

    //--------------------------------------------------------------------


    return (

        <div className = "parlay-wrapper">

            <HStack style = {{margin: '1.5%'}}>

                <ButtonGroup varient = 'outline' spacing = '6' size = 'lg'>

                    <Heading style = {{color: 'white'}}>Leagues:</Heading>

                    <Button onClick = {() => {
                        handleAPITest();
                    }}>Test API</Button>

                    {leagueButtons.map((button) => {

                        return (

                            <Button
                                key = {button.name}
                                name = {button.name}
                                colorScheme = {button.colorScheme}
                                rightIcon = {<Icon path = {button.icon} size = {1} />}
                                onClick = {() => {

                                    if (!(leagues[button.name])) {

                                        toast({
                                            position: 'top',
                                            title: 'Coming Soon!',
                                            description: `${button.name} is coming to Score Scope soon!`,
                                            status: 'success',
                                            duration: 1000,
                                            isClosable: true,
                                        })
                                    }
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
                style = {{ margin: '1.5%', padding: '5px' }}
            >

                <VStack style = {{alignItems: 'flex-start', gap: '10px'}}>

                    <ButtonGroup  
                        spacing = '10' 
                        size = 'lg' 
                        colorScheme = 'whiteAlpha' 
                        variant = 'link'
                    >
                        <Heading style = {{ color: 'white'}}>
                            The Board:
                        </Heading>

                        <Button color = 'white'>How 2 Play</Button>
                        <Button color = 'white'>Scoring Chart</Button>
                        <Button color = 'white'>Prize Chart</Button>

                    </ButtonGroup>
                                    
                    <ButtonGroup
                        spacing = '5' size = 'sm'
                        colorScheme = 'whiteAlpha' variant = 'outline' 
                    >
                        {nbaBoardFliters.map((button) => (
                            <Button key = {button.name} borderRadius = 'xl' color = 'white'>
                                {button.name}
                            </Button>
                        ))}

                    </ButtonGroup>

                </VStack>

            </Box>
           
        </div>
    )
}

export default Parlay; 