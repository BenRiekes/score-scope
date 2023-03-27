//Firebase:
const admin = require ("firebase-admin");
const functions = require ("firebase-functions");

//Func:
admin.initializeApp(); 
const db = admin.firestore();

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

        return statsRes[0]; 

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
                playerName: rosterRes[i].firstname + ' ' + rosterRes[i].lastname
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

    let retryAttempts = 1; 

    while (retryAttempts <= 3) {

        try {

            const response = await axios(teamStandingsOptions); 
            const standingsRes = response.data.response[0];
    
            let teamStandings = {
    
                conferenceRank: standingsRes.conference.rank,
                divisionRank: standingsRes.division.rank,
    
                wins: {
                  total: standingsRes.win.total,
                  home: standingsRes.win.home,
                  away: standingsRes.win.away,
                  percentage: standingsRes.win.percentage
                },
    
                losses: {
                  total: standingsRes.loss.total,
                  home: standingsRes.loss.home,
                  away: standingsRes.loss.away,
                  percentage: standingsRes.loss.percentage
                }
            }
     
            return teamStandings; 
             
        } catch (error) {

            retryAttempts += 1; 
        }
    }

    return {}; 
}

//--------------------------------------------------------------------------------------------

exports.createNBATeams = functions.runWith ({
    timeoutSeconds: 540, maxInstances: 100, memory: '1GB' 

}).https.onCall(async (data, context) => {

    const teamIds = [
        1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16,
        17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41
    ];
    

    const getTeamData = async (teamId) => {

        const teamOptions = {
            method: 'GET',
            url: 'https://v2.nba.api-sports.io/teams',

            params: {id: teamId, league: 'standard'},

            headers: { 'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
                'x-rapidapi-host': 'v2.nba.api-sports.io'
            } 
        }

        const response = await axios.request(teamOptions); 
        const teamRes = response.data.response[0];


        let results = []; 
        
        for (let j = 2015; j <= 2022; j++) {

            const season = j;  

            const [roster, games, stats, standings] = await Promise.all([
                getTeamRoster(teamId, season),
                getTeamGames(teamId, season),
                getTeamStats(teamId, season),
                getTeamStandings(
                    teamId, season, 
                    teamRes.leagues.standard.conference, 
                    teamRes.leagues.standard.division
                )
            ])

            const teamData = {
                code: teamRes.code,
                name: teamRes.name,

                nickname: teamRes.nickname,
                city: teamRes.city,

                conference: teamRes.leagues.standard.conference,
                division: teamRes.leagues.standard.division,

                roster,
                games,
                stats,
                standings
            }

            //Leagues => NBA => Seasons => Year (j) => Teams => teamID (i.id)
            const docRef = db
            .collection('Leagues')
            .doc('NBA')
            .collection('Seasons')
            .doc(season.toString())
            .collection('Teams')
            .doc(teamId.toString());
            
            results.push({docRef: docRef, teamData: teamData}); 
        }

        return results; 
    }

      
    const processTeam = async (index) => {
        const batch = admin.firestore().batch(); 

        if (index >= teamIds.length) {
            return; 
        }

        const teamId = teamIds[index]; 
        const currentTeamObjects = await getTeamData(teamId); 

        for (let i of currentTeamObjects) {
            console.log(i.teamData);
            batch.set(i.docRef, i.teamData); 
        }

        await batch.commit();
        await processTeam(index + 1); 
    }


    await processTeam(0); 
})

//--------------------------------------------------------------------------------------------


