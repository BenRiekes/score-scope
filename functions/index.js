//Firebase:
const admin = require ("firebase-admin");
const functions = require ("firebase-functions");

//Func:
admin.initializeApp(); 
const db = admin.firestore();

const axios = require("axios"); 
const Wallet = require('ethereumjs-wallet').default


exports.createUser = functions.https.onCall(async (data, context) => {

    const profilePics = [
        'https://firebasestorage.googleapis.com/v0/b/score-scope.appspot.com/o/imageAssets%2FmalePFP.png?alt=media&token=8c1854e0-f51e-472f-b503-b8ccd6f21304',
        'https://firebasestorage.googleapis.com/v0/b/score-scope.appspot.com/o/imageAssets%2FfemalePFP.png?alt=media&token=dde802d1-9d76-4c89-b377-693965d3bae6',
        'https://firebasestorage.googleapis.com/v0/b/score-scope.appspot.com/o/imageAssets%2FnbPFP.png?alt=media&token=f9eb28a4-7359-418c-b0f3-18986c45d266'
    ]

    return new Promise (async (resolve, reject) => {

        const createWallet = Wallet.generate();

        const getPFP = (genderVal) => {

            switch (genderVal) {
                case 'Male' :
                    return profilePics[0];

                case 'Female' :
                    return profilePics[1]; 
                
                case 'Other' :
                    return profilePics[2]; 

                default: 
                    return ''; 
            }
        }

        //------------------------------------------------------------------
 
        //User data from form:
        const uid = context.auth.uid;  
        const email = data.email; 
        const username = data.username; 
        const age = data.age; 
        const gender = data.gender;
        const pfp = getPFP(gender); 

        if (uid === undefined) reject ({isValid: false, reason: "No UID present"});

        //------------------------------------------------------------------

        await admin.firestore().collection('users').doc(uid).set ({

            age: age,
            email: email,
            gender: gender,
            username: username,
            pfp: pfp,

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
        const gameRes = response.data.response[0];

        //--------------------------------------------------

        const gameId = gameRes.id; 
        const homeScore = gameRes.scores.home.points; 
        const visitorScore = gameRes.scores.visitors.points;
        const isHomeGame = gameRes.teams.home.id === teamId ? true : false; 
        
        let opponentId; 
        
        if (isHomeGame) {
            opponentId = gameRes.teams.visitors.id;

            homeScore > visitorScore 
            ? games.homeWins.push({gameId: gameId, opponentId: opponentId}) 
            : games.homeLosses.push({gameId: gameId, oponentId: opponentId})

        } else if (!(isHomeGame)) {
            opponentId = gameRes.teams.home.id; 

            homeScore < visitorScore 
            ? games.awayWins.push({gameId: gameId, opponentId: opponentId}) 
            : games.awayLosses.push({gameId: gameId, opponentId: opponentId})
        }
    

        return games; 

    } catch (error) {
        console.log('team games');
        functions.logger.error(error); 
    }
}

//--------------------------------------------------------------------------------------------

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

    while (retryAttempts <= 5) {

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

const getPlayerIds = async () => {

    const teamIds = [
        1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16,
        17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41
    ];

    let results = [];
    let hasBeenAdded = {};
    
    const getPlayers = async (teamIndex) => {

        for (let seasons = 2015; seasons <= 2022; seasons++) {

            //Extracting playerIds out of objects return from func
            let players = await getTeamRoster(teamIds[teamIndex]); 
            
            for (let j = 0; j < players.length; j++) {

                const currentPlayer = players[j]; 

                if (hasBeenAdded[currentPlayer.playerId] !== true) {
                    
                    results.push(currentPlayer.playerId);
                    hasBeenAdded[currentPlayer.playerId] = true;  
                }
            }
        }   

        if (teamIds[teamIndex] === 41) { return results; } else { await getPlayers(teamIndex + 1); } 
    }
   
    getPlayers(0); 
}

//--------------------------------------------------------------------------------------------

const getPlayerStats = async (playerId, season) => {

    const playerStatsOptions = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/teams/statistics',

        params: {id: playerId, season: season},

        headers: { 'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        } 
    }

    //-----------------------------------------------------------


    const handleTypeCast = (val) => {

        if (typeof val === 'number') {
            val = val + 0.0; 

        } else if (val.includes(':')) {
            val = val.replace(':', '.');
        } 

        return parseFloat(val); 
    }

    //-----------------------------------------------------------

    let results = {};
    let teamTotals = {};  
    let homeCount = 0; 
    let awayCount = 0; 

    const playerStats = await axios.get(playerStatsOptions); 
    const playerStatsRes = playerStats.data.response; 

    playerStatsRes.forEach(async (object) => {

        const currentGame = object.game.id;
        const gameDetails = await getGameDetails(currentGame);

        const isHomeGame = gameDetails.home; 
        const opponentId = gameDetails.opponent;
        let dynamicKey; 

        if (isHomeGame) {
            dynamicKey = 'homeAvg'; homeCount += 1; 

        } else { 
            dynamicKey = 'awayAvg'; awayCount += 1; 
        }

        for (let key in object) {

            const dontCast = { 'player': true, 'comment': true,
             'team': true, 'game': true,
            }

            if (dontCast[key] === true) {
                continue; 
            }

            const currentVal = handleTypeCast(object[key]); 

            //Set if 0th index
            if (playerStatsRes[0].game.id === currentGame) {
                results['seasonAvg'][key] = currentVal;
                results[dynamicKey][key] = currentVal; 
                results['vsTeam'][opponentId][key] = currentVal; 
                
            } else { //add sum otherwise
                results['seasonAvg'][key] += currentVal;
                results[dynamicKey][key] += currentVal; 
                results['vsTeam'][opponentId][key] += currentVal; 
            }
            
            teamTotals[opponentId] += 1; 
        }
    
    });

    //-----------------------------------------------------------

    const resultKeys = ['seasonAvg', 'homeAvg', 'awayAvg', 'vsTeam']; 

    for (let i = 0; i < resultKeys.length; i++) {

        for (let key in results[resultKeys[i]]) {

            const current = results[resultKeys[i]][key]; 

            switch (resultKeys[i]) {

                case 'seasonAvg' :
                    results[resultKeys[i]][key] = current / homeCount + awayCount; 
                    break; 
                
                case 'homeAvg' :
                    results[resultKeys[i]][key] = current / homeCount; 
                    break; 

                case 'awayAvg' :
                    results[resultKeys[i]][key] = current / awayCount;
                    break; 

                case 'vsTeam' : //Key is opponent id in this case
                    results[resultKeys[i]][key] = results[resultKeys[i]][key] / teamTotals[key];
                    break; 

                default: 
                    break; 
            }   
            
        }
    }

    return results; 
}
//--------------------------------------------------------------------------------------------

exports.createNBATeams = functions.runWith ({
    timeoutSeconds: 540, maxInstances: 100, memory: '1GB' 

}).https.onCall(async (data, context) => {

    const teamIds = [
        1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16,
        17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41
    ];
    
    //--------------------------------------

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
        
        for (let season = 2015; season <= 2022; season++) {  

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

    //--------------------------------------
      
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

exports.createNBAPlayers = functions.runWith({
    timeoutSeconds: 540, maxInstances: 100, memory: '1GB'

}).https.onCall(async (data, context) => {

    const playerIds = await getPlayerIds();
    
    const getPlayerData = async(playerId) => {

        const playerOptions = {
            method: 'GET',
            url: 'https://v2.nba.api-sports.io/players',

            params: {id: playerId},

            headers: { 'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
                'x-rapidapi-host': 'v2.nba.api-sports.io'
            } 
        }
        
        //name, weight, college, ect..
        const player = await axios.request(playerOptions);
        const playerRes = player.data.response[0];

        let results = []; 

        for (let season = 2015; season <= 2022; season++) {

            const playerStats = await getPlayerStats(playerId, season); 

            const playerData = {

                //Basic Data: ----------------------------------------
                firstName: playerRes.firsname,
                lastName: playerRes.lastName,
                birth: playerRes.birth,

                height: playerRes.height,
                weight: playerRes.weight,

                college: playerRes.college + ' ' + playerRes.affiliation,
                position: playerRes.leagues.standard.pos,
                //------------------------------------------------------

                seasonAvg: playerStats.seasonAvg,
                homeAvg: playerStats.homeAvg,
                awayAvg: playerStats.awayAvg,

                vsTeam: playerStats.vsTeam
            }

            const docRef = db
            .collection('Leagues')
            .doc('NBA')
            .collection('Seasons')
            .doc(season.toString())
            .collection('Players')
            .doc(playerId.toString());
            
            results.push({docRef: docRef, teamData: playerData});
        }

        return results; 
    }

    const processPlayer = async(playerIndex) => {
        const batch = admin.firestore().batch(); 

        if (playerIndex >= playerIds.length) {
            return; 
        } 

        const playerId = playerIds[playerIndex];
        const currentPlayerObjects = await getPlayerData(playerId); 
        
        for (let i of currentPlayerObjects) {
            console.log(i.playerData);
            batch.set(i.docRef, i.playerData); 
        }

        await batch.commit(); 
        await processPlayer(playerIndex + 1); 
    }

    await processPlayer(0); 
})

