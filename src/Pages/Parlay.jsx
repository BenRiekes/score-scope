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
    mdiSoccer, mdiBaseball
} from '@mdi/js';

//Functions
import { httpsCallable, getFunctions } from "firebase/functions";


const Parlay = () => {
    const toast = useToast();

    //States: ---------------------------------------------------------
    const [league, setLeague] = useState('NBA');

    const [leagueButtons, setLeagueButtons] = useState([
        { name: 'NBA', icon: mdiBasketball },
        { name: 'NFL', icon: mdiFootball },
        { name: 'NHL', icon: mdiHockeyPuck },
        { name: 'MLB', icon: mdiBaseball },
        { name: 'MLS', icon: mdiSoccer }
    ])

    const [boardFilters, setBoardFilters] = useState({
        NBA: [
            { name: 'Points', selected: true, isActive: true },
            { name: 'Rebounds', selected: false, isActive: false },
            { name: 'Assist', selected: false, isActive: false },
            { name: 'Pts + Rebs + Asts', selected: false, isActive: false },
            { name: 'Blks + Stls', selected: false, isActive: false },
            { name: '3-PT Made', slected: false, isActive: false },
            { name: 'FT Made', selected: false, isActive: false },
        ],
  
        NFL: [
            { name: 'Touchdowns', selected: false, isActive: true },
            { name: 'Interceptions', selected: false, isActive: false },
            { name: 'Completions', selected: false, isActive: false },
            { name: 'Sacks', selected: false, isActive: false },
            { name: 'Passing Yards', selected: false, isActive: false },
            { name: 'Recieving Yards', slected: false, isActive: false },
            { name: 'Rushing Yards', selected: false, isActive: false },
        ],
  
        NHL: [
            { name: 'Points', selected: false, isActive: true },
            { name: 'Goals', selected: false, isActive: false },
            { name: 'Assists', selected: false, isActive: false },
            { name: 'Shots on Goal', selected: false, isActive: false },
            { name: 'Goals Allowed', selected: false, isActive: false },
            { name: 'Saves', selected: false, isActive: false },
        ],
  
        MLB: [
            { name: 'Hits', selected: false, isActive: true },
            { name: 'Strikeouts', selected: false, isActive: false },
            { name: 'Total Bases', selected: false, isActive: false },
            { name: 'Hits + Walks', selected: false, isActive: false },
            { name: 'Pitching Outs', selected: false, isActive: false },
        ],
  
        MLS: [
            { name: 'Goals', selected: false, isActive: true },
            { name: 'Shots on Goal', selected: false, isActive: false },
            { name: 'Saves', selected: false, isActive: false },
            { name: 'Goals Allowed', selected: false, isActive: false },
        ],
    }); 

    //--------------------------------------------------------------------

    const handleLeagueChange = (e) => {
        e.preventDefault();

        const leagues = {
            NBA: true, NFL: true,
            NHL: true, MLB: true, MLS: true
        };

        if (league === e.target.name) return; 

        if (leagues[e.target.name] === false) {

            return (
                toast({
                    position: 'top',
                    title: e.target.name + ' is coming soon!',
                    status: 'success',
                    duration: 1000,
                    isClosable: true,
                })
            );
        } 

        if (leagues[e.target.name] === undefined) {

            return (
                toast({
                    position: 'top',
                    title: e.target.name + ' is not an offered league!',
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                })
            );
        } 

        setLeague(e.target.name);   
        return; 
    }

    //--------------------------------------------------------------------

    const handleFilterChange = (e) => {

        const prevIndex = boardFilters[league].findIndex(filter => filter.isActive); 
        const newIndex = boardFilters[league].findIndex(filter => filter.name === e.target.name); 
       
        if (prevIndex !== newIndex) {

            setBoardFilters (prev => {
                
                //Ref to array based on league useState
                const updatedFilters = [...prev[league]]; 

                //Set prevIndex to false:
                updatedFilters[prevIndex] = { ...updatedFilters[prevIndex], isActive: false }; 

                //Set newIndex to true:
                updatedFilters[newIndex] = { ...updatedFilters[newIndex], isActive: true };
                
                return { ...prev, [league]: updatedFilters }; 
            });
        }
    }

    //--------------------------------------------------------------------

    return (

        <div className = "parlay-wrapper">

            <HStack style = {{margin: '1.5%'}}>

                <ButtonGroup varient = 'outline' spacing = '6' size = 'lg'>

                    <Heading style = {{color: 'white'}}>Leagues:</Heading>

                    {leagueButtons.map((button) => {

                        return (

                            <Button
                                key = {button.name}
                                name = {button.name}

                                rightIcon = {<Icon path = {button.icon} size = {1} />}
                                colorScheme = {button.name === league ? 'purple' : 'whiteAlpha'}
                                
                                onClick = {(e) => {
                                    handleLeagueChange(e); 
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
                        <Button color = 'white'>Scoring Chart</Button>
                        <Button color = 'white'>Prize Chart</Button>

                    </ButtonGroup>
                                    
                    <ButtonGroup spacing = '5' size = 'sm' >

                        {boardFilters[league].map((filter) => {

                            return (

                                <Button 
                                    key = {filter.name} name = {filter.name}
                                    borderRadius = 'xl' color = 'white'

                                    colorScheme = {filter.isActive ? 'purple' : 'whiteAlpha'} 
                                    variant = {filter.isActive ? 'solid' : 'outline'} 

                                    onClick = {(e) => {
                                        handleFilterChange(e);
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