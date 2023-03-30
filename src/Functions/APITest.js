import axios from "axios";

import 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { firestore } from "../firebase-config"; 
import { getFirestore, getDoc, doc, getDocs, collection } from "firebase/firestore";


export const getNBATeamData = async () => {

    //Axios request to get team ids
    const teamOptions = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/teams',

        headers: {
            'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
    }


    try {

        const response = await axios.request(teamOptions); 
        const teamRes = response.data.response; 

        let teams = []; 

        for (let i = 0; i < teamRes.length; i++) {

            if (teamRes[i].nbaFranchise && teamRes[i].id != 37) {

                //Basic Team Data: ------------------------------

                let teamData = {
                    id: teamRes[i].id,
                    code: teamRes[i].code,
                    name: teamRes[i].name,

                    nickname: teamRes[i].nickname,
                    city: teamRes[i].city,

                    conference: teamRes[i].leagues.standard.conference,
                    division: teamRes[i].leagues.standard.division,
                }

                teams.push(teamData);

            }
           
        }

        return teams; 

    } catch (error) {
        console.log(error);
    }
} 

//-----------------------------------------------------------------

export const getTeamGames = async(teamId, season) => {

    const teamGameOptions = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/games',

        params: {
            league: 'standard', season: season, team: teamId,
        },

        headers: {
            'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
    }

    try {

        let games = {
            homeWins: [], homeLosses: [],
            awayWins: [], awayLosses: [],
        }; 

        const response = await axios(teamGameOptions);
        const gameRes = response.data.response;

        //--------------------------------------------------

        for (let i = 0; i < gameRes.length; i++) {

            const gameId = gameRes[i].id; 
            const homeScore = gameRes[i].scores.home.points; 
            const visitorScore = gameRes[i].scores.visitors.points;
            const isHomeGame = gameRes[i].teams.home.id === teamId ? true : false; 
            
            let opponentId; 
            
            if (isHomeGame) {
                opponentId = gameRes[i].teams.visitors.id;

                homeScore > visitorScore 
                ? games.homeWins.push({gameId: gameId, opponentId: opponentId}) 
                : games.homeLosses.push({gameId: gameId, oponentId: opponentId})

            } else if (!(isHomeGame)) {
                opponentId = gameRes[i].teams.home.id; 

                homeScore < visitorScore 
                ? games.awayWins.push({gameId: gameId, opponentId: opponentId}) 
                : games.awayLosses.push({gameId: gameId, opponentId: opponentId})
            }
        }

        return games; 

    } catch (error) {
        console.log('team games');
    }
}

//-----------------------------------------------------------------

export const getTeamStats = async(teamId, season) => {

    const teamStatsOptions = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/teams/statistics',

        params: { id: teamId, season: season},
        headers: {
            'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
    }

    try {
        const response = await axios(teamStatsOptions); 
        const statsRes = response.data.response; 

        return statsRes[0]; 

    } catch (error) {
        console.log('team stats');
    }
}

//-----------------------------------------------------------------

export const getTeamRoster = async(teamId, season) => {

    const teamRosterOptions = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/players',

        params: { team: teamId, season: season},
        headers: {
            'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
    }

    try {

        let teamRoster = []; 
        const response = await axios(teamRosterOptions); 
        const rosterRes = response.data.response;

        for (let i = 0; i < rosterRes.length; i++) {

            teamRoster.push({ 
                playerId: rosterRes[i].id, 
                playerName: rosterRes[i].firstname + ' ' + rosterRes[i].lastname
            }); 
        }

        return teamRoster; 

    } catch (error) {
        console.log('team roster');
    }
}

//-----------------------------------------------------------------

export const getTeamStandings = async(teamId, season, conference, division) => {

    const teamStandingsOptions = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/standings',

        params: { 
            league: 'standard', season: season, team: teamId,
            conference: conference, division: division
        },

        headers: {
            'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
    }

    try {

        let standings = {
            conferenceRank: null, divisionRank: null,
            wins: null, losses: null
        }

        const response = await axios(teamStandingsOptions); 
        const standingsRes = response.data.response;

       
        standings.conferenceRank = standingsRes[0].conference.rank; 
        standings.divisionRank = standingsRes[0].division.rank; 

        standings.wins = {
            total: standingsRes[0].win.total,
            home: standingsRes[0].win.home,
            away: standingsRes[0].win.away,
            percentage: standingsRes[0].win.percentage
        }; 

        standings.losses = {
            total: standingsRes[0].loss.total,
            home: standingsRes[0].loss.home,
            away: standingsRes[0].loss.away,
            percentage: standingsRes[0].win.percentage
        }

        return standings; 

    } catch (error) {
        console.log('team standings');
    }
}

//-------------------------------------------------------------------------------

const getGameDetails = async(gameId) => {

    const teamGameOptions = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/games',

        params: {id: gameId},

        headers: {
            'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
    }

    const response = await axios(teamGameOptions);
    const gameRes = response.data.response[0];

    const homeId = gameRes.teams.home.id
    const visitorId = gameRes.teams.visitors.id

    if (gameId !==  homeId || gameId !== visitorId) { 
        return; 
    } 

    if (gameId === homeId) {
        return ({home: true, opponent: visitorId}) 

    } else { return ({home: false, opponent: homeId}) }

}

export const getPlayersFB = async () => {
    const db = getFirestore(); 
    const startTime = performance.now();

    const teamIds = [
        1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16,
        17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41
    ];

    //----------------------------------------------------

    const getDocRefs = () => {

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

    const getPlayerIds = async () =>  {

        const docRefs = getDocRefs(); 
        const docRefPromises = docRefs.map(docRef => getDoc(docRef));

        try {
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

    await getPlayerIds(); 
}
