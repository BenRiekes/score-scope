//React Imports:
import React from "react";
import { useState, useRef, useEffect } from "react";

//Styling:
import Icon from '@mdi/react';
import "./PageStyles/ParlayStyles.css";

import { 
    HStack, Button, ButtonGroup, Heading,
    Flex, VStack, Box
} from '@chakra-ui/react'; 

import {
    Accordion, AccordionItem, AccordionButton, 
    AccordionPanel, AccordionIcon, Spacer, Divider
} from '@chakra-ui/react'

import { 
    mdiBasketball, mdiFootball, mdiHockeyPuck, 
    mdiSoccer, mdiBaseball, mdiMixedMartialArts 
} from '@mdi/js';


const Parlay = () => {

    
    const leagues = {
        'NBA': true, 'NFL': false, 'NHL': false,
        'MLB': false, 'MLS': false, 'MMA': false,    
    }; 

    const handleSelection = (leagueChoice) => {

        if (leagues[leagueChoice] != true) {
            alert ("Coming Soon!")
        }
    }


    return (

        <div className = "parlay-wrapper">

            <HStack style = {{margin: '1.5%'}}>


                <ButtonGroup varient = 'outline' spacing = '6' size = 'lg'>

                    <Heading style = {{color: 'white'}}>Leagues:</Heading>

                    <Button colorScheme = 'purple' rightIcon = {<Icon path = {mdiBasketball} size = {1}/>}
                        id = 'NBA' onClick = {(e) => handleSelection(e.target.id)}>
                    NBA</Button>

                    <Button colorScheme = 'gray' rightIcon = {<Icon path = {mdiFootball} size = {1}/>}
                        id = 'NFL' onClick = {(e) => handleSelection(e.target.id)}>
                    NFL</Button>

                    <Button colorScheme = 'gray' rightIcon = {<Icon path = {mdiHockeyPuck} size = {1}/>}
                        id = 'NHL' onClick = {(e) => handleSelection(e.target.id)}>
                    NHL</Button>

                    <Button colorScheme = 'gray' rightIcon = {<Icon path = {mdiBaseball} size = {1}/>}
                        id = 'MLB' onClick = {(e) => handleSelection(e.target.id)}>
                    MLB</Button>

                    <Button colorScheme = 'gray' rightIcon = {<Icon path = {mdiSoccer} size = {1}/>}
                        id = 'MLS' onClick = {(e) => handleSelection(e.target.id)}>
                    MLS</Button>

                    <Button colorScheme = 'gray' rightIcon = {<Icon path = {mdiMixedMartialArts} size = {1}/>}
                        id = 'MMA' onClick = {(e) => handleSelection(e.target.id)}>
                    MMA</Button>

                </ButtonGroup>

            </HStack>

            <hr style = {{backgroundColor: "#2d2d2d"}}/>

            <HStack style = {{margin: '1.5%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}} >

               
                <Box 
                    display = 'flex' flexDirection = 'row' flexWrap = 'wrap' borderRadius = 'md' 
                    bg = '#2d2d2d' w = '75%' p = {2}
                > 
                    

                    <ButtonGroup 
                        varient = 'outline' spacing = '6' size = 'sm'
                        style = {{display: 'flex', alignItems: 'center'}}
                    >

                        <Heading as = 'h1' size = 'xl' style = {{color: 'white'}}>The Board:</Heading>

                        <Button >How 2 Play</Button>
                        <Button>Scoring Chart</Button>
                        <Button>Prize Chart</Button>

                        <Divider orientation = "Horiztonal" style = {{backgroundColor: 'white'}}/>
                    </ButtonGroup>

                   

                    <ButtonGroup 
                        varient = 'outline' spacing = '3' size = 'sm'
                        style = {{display: 'flex', flexDirection: 'row',flexWrap: 'wrap', 
                        alignItems: 'center', justifyContent: 'flex-start', marginTop: '1.5%', width: '100%'}}
                    >
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Points</Button> 
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Rebounds</Button> 
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Assist</Button>
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Turnovers</Button>

                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Pts + Rebs + Asts</Button> 
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>3-PT Made</Button> 
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Pts + Rebs</Button> 
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Pts + Asts</Button> 
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Rebs + Ast</Button> 
                       <Button style = {{borderRadius: '10em', marginTop: '1.5%'}}>Blks + Stls</Button> 
                       
                    </ButtonGroup>
                    
                </Box>


            </HStack>
            
        </div>
    )
}

export default Parlay; 