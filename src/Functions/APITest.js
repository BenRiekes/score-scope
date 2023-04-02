import axios from "axios";

import 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { firestore } from "../firebase-config"; 
import { getFirestore, getDoc, doc, getDocs, collection } from "firebase/firestore";



//OPTIMIZED FUNCTIONS: ==================================================================

//Gets all player IDs from firestore: 1.9 seconds
export const getPlayerIds = async () => { 
    const db = getFirestore(); 
    const startTime = performance.now();

    const teamIds = [
        1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16,
        17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41
    ];

    //----------------------------------------------------

    const getDocRefs = () => { //Genertes as array of doc refs

        let docs = []; 

        for (let i = 2015; i <= 2022; i++) {

            const collectionRef = collection(
                db, 'Leagues', 'NBA', 'Seasons', i.toString(), 'Teams'
            );
    
            for (let j = 0; j < teamIds.length; j++) { 
    
                const docRef = doc(
                    collectionRef, teamIds[j].toString()
                );

                docs.push(docRef); 
            }
        }

        return docs; 
    }

    
    const docRefs = getDocRefs(); 
    const docRefPromises = docRefs.map(docRef => getDoc(docRef)); //Maps out all the doc refs

    try {
        //Makes all calls at once with Promise.all
        const docSnapshots = await Promise.all(docRefPromises); 

        //Get all player ids from the object roster field
        const playerIds = docSnapshots.map (
            docSnapshot => docSnapshot.data().roster

        ).flat().map(object => object.playerId); 

        const results = Array.from(new Set(playerIds)); //Takes out the duplicates
        const endTime = performance.now()

        console.log(results);
        console.log(`${results.length} players have been added in ${endTime - startTime} milliseconds`);
        return;  

    } catch (error) {
        console.log(error); 
    }
    
}

//Gets all players IDs and names from team for seasons 2015 => 2022 from API: 0.9 seconds
export const getTeamRoster = async (teamId) => { 
    const startTime = performance.now();

    const getAxiosRequests = () => {

        let requestObjects = []; 

        const requestObj = {
            method: 'GET',
            url: 'https://v2.nba.api-sports.io/players',
    
            params: {
                team: teamId, season: null
            },

            headers: {
                'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
                'x-rapidapi-host': 'v2.nba.api-sports.io'
            }
        }

        for (let i = 2015; i <= 2022; i++) {
            const objCopy = JSON.parse(JSON.stringify(requestObj)); 

            objCopy.params.season = i; 
            requestObjects.push(objCopy);
        }

        return requestObjects; 
    }

    //------------------------------------------------------------

    const requests = getAxiosRequests(); 
    const rosterPromises = requests.map(req => axios.request(req));

    try {
        const teamRosters = await Promise.all(rosterPromises);
        let results = {}; 

        for (let i = 0; i < teamRosters.length; i++) {

            const key = 2015 + i;
            const playersArr = []; 
            const playersRes = teamRosters[i].data.response; 

            for (let j = 0; j < playersRes.length; j++) {

                playersArr.push({
                    id: playersRes[j].id,
                    name: playersRes[j].firstname + ' ' + playersRes[j].lastname
                }); 
            }

            results[key] = playersArr; 
        }

        const endTime = performance.now()
        console.log(`Team (${teamId}) 2015 -> 2022 rosters fetch in ${endTime - startTime} milliseconds`);
        console.log(results);
        return;

    } catch (error) {
        console.log('An error occured: ' + error); 
    }
    
}

//Gets all gameIDs and some basic info for seasons 2015 => 2022 from API: 1.14 seconds 
export const getTeamGames = async (teamId) => {
    const startTime = performance.now();

    const getAxiosRequests = () => {

        let requestObjects = []; 

        const requestObj = {
            method: 'GET',
            url: 'https://v2.nba.api-sports.io/games',
    
            params: {
                league: 'standard',  team: teamId, season: null,
            },
    
            headers: {
                'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
                'x-rapidapi-host': 'v2.nba.api-sports.io'
            }
        }

        for (let i = 2015; i <= 2022; i++) {
            const objCopy = JSON.parse(JSON.stringify(requestObj)); 

            objCopy.params.season = i; 
            requestObjects.push(objCopy);
        }

        return requestObjects; 
    }

    //------------------------------------------------------------

    const requests = getAxiosRequests(); 
    const gamePromises = requests.map(req => axios.request(req)); 

    try {

        let results = {}; 
        const teamGames = await Promise.all(gamePromises); 
 
        for (let i = 0; i < teamGames.length; i++) {

            let gamesObj = {
                games: [] 
            }; 

            const key = 2015 + i; 
            const teamGamesRes = teamGames[i].data.response; 
            
            for (let j = 0; j < teamGamesRes.length; j++) {
                const game = teamGamesRes[j];  
                const gameId = game.id; 

                let wonGame = true; 
                let isHomeGame = true; 
                let opponentId = game.teams.visitors.id; 
                
                const homeScore = game.scores.home.points; 
                const visitorScore = game.scores.visitors.points;

                if (game.teams.home.id !== teamId) { isHomeGame = false };
                if (!isHomeGame) { opponentId = game.teams.home.id };

                if ( homeScore < visitorScore && isHomeGame) {
                    wonGame = false;

                }  else if (homeScore > visitorScore && !isHomeGame) {
                    wonGame = false
                }; 

                gamesObj.games.push({gameId: gameId, opponentId: opponentId, wonGame: wonGame, homeGame: isHomeGame}); 
            }

           results[key] = gamesObj; 
        }

        const endTime = performance.now(); 
        console.log(`Fetch games for team ${teamId} for seasons 2015 => 2022 in ${endTime - startTime} milliseconds`);
        console.log(results);
        
        return;

    } catch (error) {
        console.log('An error occured: ' + error); 
    }
}

//Gets all seasons stats from seasons 2015 => 2022 from API: 0.8 seconds
export const getTeamStats = async (teamId) => {
    const startTime = performance.now();

    const getAxiosRequests = () => {

        let requestObjects = []; 

        const requestObj = {
            method: 'GET',
            url: 'https://v2.nba.api-sports.io/teams/statistics',
    
            params: { 
                id: teamId, season: null
            },

            headers: {
                'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
                'x-rapidapi-host': 'v2.nba.api-sports.io'
            }
        }
       
        for (let i = 2015; i <= 2022; i++) {

            const objCopy = JSON.parse(JSON.stringify(requestObj)); 

            objCopy.params.season = i; 
            requestObjects.push(objCopy);
        }

        return requestObjects;
    }

    //-----------------------------------------------------------------

    const requests = getAxiosRequests(); 
    const statsPromises = requests.map(req => axios.request(req)); 

    try {  

        let results = {}; 
        const teamStats = await Promise.all (statsPromises); 
        
      
        for (let i = 0; i < teamStats.length; i++) {
            const key = 2015 + i; 
            results[key] = teamStats[i].data.response[0]; 
        }

        const endTime = performance.now(); 
        console.log(`Fetched Team ${teamId} stats from seasons 2015 => 2022 in ${endTime - startTime} milliseconds`); 
        console.log(results);
        
        return;

    } catch (error) {

        console.log('An error occured ' + error);
    }

}

//Get seasons standings for team | 2018 => 2022 from API: 1.2 seconds
export const getTeamStandings = async (teamId) => {

    const getAxiosRequests = () => {

        let requestObjects = []; 

        const requestObj = {
            method: 'GET',
            url: 'https://v2.nba.api-sports.io/standings',
    
            params: { 
                league: 'standard', season: null, team: teamId
            },

            headers: {
                'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
                'x-rapidapi-host': 'v2.nba.api-sports.io'
            }
        }
       
        for (let i = 2018; i <= 2022; i++) { //API Starts at 2018 for standings

            const objCopy = JSON.parse(JSON.stringify(requestObj)); 

            objCopy.params.season = i; 
            requestObjects.push(objCopy);
        }

        return requestObjects;
    }

    const requests = getAxiosRequests(); 
    const standingsPromises = requests.map(req => axios.request(req));  


    try {
        const teamStandings = await Promise.all(standingsPromises); 
        
        let results = {
            2015: {},
            2016: {},
            2017: {},
        };

        for (let i = 0; i < teamStandings.length; i++) {

            const key = 2018 + i; 
            const standingsRes = teamStandings[i].data.response[0]; 

            const invalidKeys = {
                'league': true, 'team': true, 'season': true, 'tieBreakerPoints': true
            }

            results[key] = {}

            for (let j in standingsRes) {

                if (invalidKeys[j] === undefined) {
                    results[key][j] = standingsRes[j]
                }
            }
        }

        console.log(results);
        return; 

    } catch (error) {
        console.log('An error occured ' + error); 
    }
}

