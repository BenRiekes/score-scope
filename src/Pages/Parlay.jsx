//React Imports:
import React from "react";
import { useState, useRef, useEffect } from "react";

//Styling:
import Icon from '@mdi/react';
import "./PageStyles/ParlayStyles.css";

import { HStack, Button, ButtonGroup, Heading } from '@chakra-ui/react'; 

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
            
        </div>
    )
}

export default Parlay; 