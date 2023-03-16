//React Imports:
import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from 'axios'

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

import { useToast } from '@chakra-ui/react'

import { 
    mdiBasketball, mdiFootball, mdiHockeyPuck, 
    mdiSoccer, mdiBaseball, mdiMixedMartialArts 
} from '@mdi/js';


const myReq = new XMLHttpRequest();

// myReq.onload = function() {
//     const data= JSON.parse(this.responseText);
//     console.log(data);
// };
// myReq.onerror = function(err) {
//     console.log('ERROR!', err)
// }
// myReq.open('get', 'https://www.balldontlie.io/api/v1/players', true )
// myReq.setRequestHeader('Accept', ' application/json');
// myReq.send();
  



const Parlay = () => {
    const toast = useToast()

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


    

    return (

        <div className = "parlay-wrapper">

            <HStack style = {{margin: '1.5%'}}>


                <ButtonGroup varient = 'outline' spacing = '6' size = 'lg'>

                    <Heading style = {{color: 'white'}}>Leagues:</Heading>

                    {leagueButtons.map((button) => {

                        return (

                            <Button
                                key = {button.name}
                                colorScheme = {button.colorScheme}
                                rightIcon = {<Icon path = {button.icon} size = {1} />}
                                name = {button.name} onClick = {() => {

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

            <hr style = {{backgroundColor: "#2d2d2d"}}/>

        </div>
    )
}

export default Parlay; 