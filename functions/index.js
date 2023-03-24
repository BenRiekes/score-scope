//Firebase:
const admin = require ("firebase-admin");
const functions = require ("firebase-functions");

//Func:
admin.initializeApp(); 
const db = admin.firestore();
const batch = admin.firestore().batch();

const axios = require("axios"); 
const Wallet = require('ethereumjs-wallet').default


exports.createUser = functions.https.onCall(async (data, context) => {

    return new Promise (async (resolve, reject) => {

        const createWallet = Wallet.generate(); 

        //User data from form:
        const uid = context.auth.uid;  
        const email = data.email; 
        const username = data.username; 
        const age = data.age; 
        const gender = data.gender;

        //------------------------------------------------------------------

        if (!uid) reject ({isValid: false, reason: "No UID present"});
       
        //------------------------------------------------------------------

        await admin.firestore().collection('users').doc(uid).set ({

            age: age,
            email: email,
            gender: gender,
            username: username,

            friends: {
                incoming: [],
                outgoing: [],
                mutual: [],
            },
            
            wallet: {
                address: createWallet.getAddressString(),
                privateKey: createWallet.getPrivateKeyString(),
            },

            bets: {
                parlays: {
                    activeParlays: [],
                    inactiveParlays: [],
                },

                versus: {
                    activeVersus: [],
                    inactiveversus: [],
                },
            }, 

        }).then (response => {
            resolve ({isValid: true, reason: "Account successfully created"}); 

        }).catch (error => {
            
            functions.logger.error(error); 
            reject ({isValid: false, reason: "An error occured while creating your account"});
        })

    })
}); 

//----------------------------------------------------------------------------------------------

const getTeamGames = async(teamId, season) => {

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
        functions.logger.error(error); 
    }
}

//--------------------------------------------------------------------------------------------

const getTeamStats = async(teamId, season) => {

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

        return statsRes; 

    } catch (error) {
        console.log('team stats');
        functions.logger.error(error); 
    }
}

//--------------------------------------------------------------------------------------------

const getTeamRoster = async(teamId, season) => {

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
                playerName: rosterRes[i].firstname + ' ' + rosterRes[i].lastName
            }); 
        }

        return teamRoster; 

    } catch (error) {
        console.log('team roster');
        functions.logger.error(error); 
    }
}

//--------------------------------------------------------------------------------------------

const getTeamStandings = async(teamId, season, conference, division) => {

    const teamStandingsOptions = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/players',

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
        functions.logger.error(error); 
    }
}



exports.NBATeamData = functions.runWith ({
    timeoutSeconds: 300, maxInstances: 100, memory: '1GB' 

}).https.onRequest(async (req, res) => {

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

        for (let i = 0; i < teamRes.length; i++) {

            if (teamRes[i].nbaFranchise && teamRes[i].id != 37) {

                //Basic Team Data: ------------------------------

                let teamData = {
                    code: teamRes[i].code,
                    name: teamRes[i].name,

                    nickname: teamRes[i].nickname,
                    city: teamRes[i].city,

                    conference: teamRes[i].leagues.standard.conference,
                    division: teamRes[i].leagues.standard.division,
                }

                
                for (let j = 2015; j <= 2022; j++) {

                    //Advanced Seasonal Team Data: ------------------------------

                    const teamId = teamRes[i].id;
                    const season = j;  

                    //Leagues => NBA => Seasons => Year (j) => Teams => teamID (i.id)
                    const docRef = db.collection('Leagues')
                    .doc('NBA').collection('Seasons').doc(j.toString())
                    .collection('Teams').doc(teamRes[i].id.toString());
                    
                    //Get Seasonal Data:
                    teamData['games'] = await getTeamGames(teamId, season); 
                    teamData['stats'] = await getTeamStats(teamId, season); 
                    teamData['roster'] = await getTeamRoster(teamId, season);
                    teamData['standings'] = await getTeamStandings(
                        teamId, season, 
                        teamRes[i].leagues.standard.conference, teamRes[i].leagues.standard.division
                    ); 

                    batch.set(docRef, teamData); 
                }
            }

            await batch.commit();
        }

        //----------------------------------------------------------

    } catch (error) {
        functions.logger.error(error)
    }
    
})

