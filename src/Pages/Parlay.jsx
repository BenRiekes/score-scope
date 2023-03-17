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
    const [teams, setTeams] = useState([]);

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

    useEffect(() => {
        console.log(teams);
        
    }, [teams])

    //--------------------------------------------------------------------

    // Function to get the players of a given team and season
    const getTeamPlayers = (team, season) => {

        return new Promise ((resolve, reject) => { 

            const options = {
                method: 'GET',
                url: 'https://api-nba-v1.p.rapidapi.com/players',
    
                params: {team: team, season: season},
                headers: {
                  'X-RapidAPI-Key': '01487261e9mshca9214823c98e4fp1c5658jsn894b41e1d37d',
                  'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
                }
            };

            axios.request(options).then(function (playerRes) {

                let players = []; 
                let playerData = playerRes.data.response;
                
                if (!(playerData)) {
                    players.push(null);
                    return resolve (players);  
                }
    
                for (let i = 0; i < playerData.length; i++) {
    
                    players.push({
                        playerID: playerData[i].id, 
                        playerName: playerData[i].firstname + ' ' + playerData[i].lastname
                    }); 
                }
    
                return resolve(players);
                
            }).catch(function (error) {
                return reject(error); 
            });
        })
   
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

            let teamsArr = teamRes.data.response;
            let teamsFinal = []; 
            let promises = [];

            for (let i = 0; i < teamsArr.length; i++) {

                if (teamsArr[i].nbaFranchise) {

                    let teamObj = {

                        teamID: teamsArr[i].id,
                        teamCode: teamsArr[i].code,
                        teamName: teamsArr[i].name,
                        teamNickname: teamsArr[i].nickname,
                        teamCity: teamsArr[i].city,
                        teamPlayers: {}
                    }

                    //Loop through each season from 2015 to 2022
                    for (let season = 2015; season <= 2022; season++) {

                        //Call getTeamPlayers, push the resulting Promise to the 'promises' array
                        promises.push(
                            getTeamPlayers(teamsArr[i].id, season).then((players) => {
                                teamObj.teamPlayers[season] = players; 
                            })
                        )
                    }

                    teamsFinal.push(teamObj); 
                }  
            };

            //Wait for all promises to resolve then set state
            Promise.all(promises).then(() => {
                setTeams(teamsFinal);
            });

        }).catch (function (error) {
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