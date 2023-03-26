import axios from "axios";


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
            stats: { wins: null, losses: null }
        }

        const response = await axios(teamStandingsOptions); 
        const standingsRes = response.data.response;

       
        standings.conferenceRank = standingsRes[0].conference.rank; 
        standings.divisionRank = standingsRes[0].division.rank; 

        standings.stats.wins = {
            total: standingsRes[0].win.total,
            home: standingsRes[0].win.home,
            away: standingsRes[0].win.away,
            percentage: standingsRes[0].win.percentage
        }; 

        standings.stats.losses = {
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