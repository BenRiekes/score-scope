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




const Parlay = () => {

    //Style State: 
    const toast = useToast();

    //Functional State:
    const [teamsPerSzn, setTeamsPerSzn] = useState([]);

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

    //--------------------------------------------------------------------

    const getTeamPlayers = async (teamsArr) => {

        const requestPlayers = async (options) => {

            axios.request(options).then(function (playerRes) {
                console.log(playerRes.data.response);

            }).catch(function (error) {
                console.error(error);
            });
        } 

        
        for (let i = 0; i < teamsArr.length; i++) {

            let options = {
                method: 'GET',
                url: 'https://api-nba-v1.p.rapidapi.com/players',
    
                params: {team: teamsArr[i].teamID, season: 2015},
                headers: {
                  'X-RapidAPI-Key': '01487261e9mshca9214823c98e4fp1c5658jsn894b41e1d37d',
                  'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
                }
            };

            // for (let j = 2015; j < 2023; j++) {
            //     teamsArr[i].teamPlayers[2015] = await 
            // }

            
        }
       
    }

    const getTeams = () => {

        const options = {
            method: 'GET',
            url: 'https://api-nba-v1.p.rapidapi.com/teams',

            headers: {
                'X-RapidAPI-Key': '01487261e9mshca9214823c98e4fp1c5658jsn894b41e1d37d',
                'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
            }
        }

        axios.request(options).then(function (teamRes) {
            let teamsArr = [];
            let teams = teamRes.data.response;

            for (let i = 0; i < teams.length; i++) {

                if(teams[i].nbaFranchise) {

                    let teamObj = {
                        teamID: teams[i].id, 
                        teamName: teams[i].name,

                        teamPlayers: {
                            2015: [], 2016: [], 2017: [], 2018: [],
                            2019: [], 2020: [], 2021: [], 2022: []
                        }
                    }

                    teamsArr.push(teamObj); 
                }
            }

            getTeamPlayers(teamObj);

        }).catch(function (error) {
            console.error(error);
        });
    }


    return (

        <div className = "parlay-wrapper">

            <HStack style = {{margin: '1.5%'}}>


                <ButtonGroup varient = 'outline' spacing = '6' size = 'lg'>

                    <Heading style = {{color: 'white'}}>Leagues:</Heading>

                    <Button 
                        onClick = {getTeams}
                    >
                        Test API
                    </Button>

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