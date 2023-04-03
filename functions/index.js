//Firebase:
const admin = require ("firebase-admin");
const functions = require ("firebase-functions");

//Func:
admin.initializeApp(); 
const db = admin.firestore();

const axios = require("axios"); 
const Bottleneck = require("bottleneck"); 
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

// ------------------------------------------------------------------------------------

const limiter = new Bottleneck({
    minTime: 200,
}); 

//Get Teams Helper Functions: ----------------------------------------------------------

const getBasicData = async (teamId) => {

    try {

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
    
        return teamRes; 

    } catch (error) {
        functions.logger.error(error);
    }
    
}

//Gets all players IDs and names from team for seasons 2015 => 2022 from API: 0.9 seconds
const getTeamRoster = async (teamId) => { 

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
    const rosterPromises = requests.map((req) => limiter.schedule(() => axios.request(req)));

    try {
        const teamRosters = await Promise.all(rosterPromises);
        let results = {}; 

        for (let i = 0; i < teamRosters.length; i++) {

            const key = 2015 + i;
            const playersArr = []; 
            let playersRes = teamRosters[i].data.response; 

            for (let j = 0; j < playersRes.length; j++) {

                playersArr.push({
                    id: playersRes[j].id,
                    name: playersRes[j].firstname + ' ' + playersRes[j].lastname
                }); 
            }

            results[key] = playersArr; 
        }
        
        return results; 

    } catch (error) {
        console.log('An error occured: ' + error); 
    }
    
}


//Gets all player IDs: team x, season x, firestore query:
const getTeamRosterBySeason = async (season) => {

    const teamIds = [ 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16,
        17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41
    ];

    const getDocRefs = () => {

        let docRefs = []; 

        for (let i = 0; i < teamIds.length; i++) {

            const docRef = db
            .collection('Leagues').doc('NBA')
            .collection('Seasons').doc(season.toString())
            .collection('Teams').doc(teamIds[i].toString()); 

            docRefs.push(docRef); 
        }

        return docRefs; 
    }

    const docRefs = getDocRefs(); 
    const docRefPromises = docRefs.map(docRef => getDoc(docRef));

    try {

        let results = []; 
        const docSnapshots = await Promise.all(docRefPromises);

        for (const doc of docSnapshots) {

            const roster = doc.data().roster; 
            const playerIds = roster.map(object => object.playerId); 

            results.push({teamId: doc.id, teamRoster: playerIds});  
        }

        return results; 

    } catch (error) {
        functions.logger.error(error); 
    }

}

//Gets all gameIDs and some basic info for seasons 2015 => 2022 from API: 1.14 seconds 
const getTeamGames = async (teamId) => {

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
    const gamePromises = requests.map((req) => limiter.schedule(() => axios.request(req)));

    try {

        let results = {}; 
        const teamGames = await Promise.all(gamePromises); 
 
        for (let i = 0; i < teamGames.length; i++) {

            let games = []; 

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

                games.push({gameId: gameId, opponentId: opponentId, wonGame: wonGame, homeGame: isHomeGame}); 
            }

           results[key] = games; 
        }
        
        return results;

    } catch (error) {
        console.log('An error occured: ' + error); 
    }
}


//Gets all seasons stats from seasons 2015 => 2022 from API: 0.8 seconds
const getTeamStats = async (teamId) => {

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
    const statsPromises = requests.map((req) => limiter.schedule(() => axios.request(req)));

    try {   
        const teamStats = await Promise.all(statsPromises); 
        let results = {}; 
      
        for (let i = 0; i < teamStats.length; i++) {
            const key = 2015 + i; 
            const stats = teamStats[i].data.response[0]; 
            
            if (stats === undefined) { 
                results[key] = 'An error occured while fetching'
                continue; 
            }
            
            results[key] = stats;
        }

        return results;

    } catch (error) {
        console.log('An error occured ' + error);
    }

}


//Get seasons standings for team | 2018 => 2022 from API: 1.2 seconds
const getTeamStandings = async (teamId) => {

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
    const standingsPromises = requests.map((req) => limiter.schedule(() => axios.request(req))); 


    try {
        const teamStandings = await Promise.all(standingsPromises); 
        
        let results = {
            2015: '2015 Data N/A',
            2016: '2016 Data N/A',
            2017: '2017 Data N/A',
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

        return results; 

    } catch (error) {
        console.log('An error occured ' + error); 
    }
}

//Get Players Helper Functions ------------------------------------------------------------------------------------

//Get the opponent of a game:
const getGameOpponents = async (season, teamId) => {

    let results = {};  

    const requestObj = {

        method: 'GET',
        url: 'https://v2.nba.api-sports.io/games',

        params: { 
            league: 'standard', season: season, team: teamId
        },

        headers: {
            'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
    }

    const gamesRequests = await axios.request(requestObj); 
    const gamesRes = gamesRequests.data.response; 
    
    for (const game of gamesRes) { 

        const visitorId = game.teams.visitors.id; 
        const homeId = game.teams.home.id; 

        const opponentId = homeId === teamId ? homeId : visitorId; 

        results[game.id] = opponentId; 
    }

    return results; 
}

//Get Play averges for season and against each team
const getPlayerStats = async (playerIds, teamId, season) => {

    const getAxiosRequests = () => {

        let requestObjects = []; 

        const requestObj = {
            method: 'GET',
            url: 'https://v2.nba.api-sports.io/players/statistics',
    
            params: { 
               id: null, season: season, team: teamId
            },

            headers: {
                'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
                'x-rapidapi-host': 'v2.nba.api-sports.io'
            }
        }

        for (let i = 0; i < playerIds.length; i++) {

            const objCopy = JSON.parse(JSON.stringify(requestObj)); 

            objCopy.params.id = playerIds[i]; 
            requestObjects.push(objCopy);
        }

        return requestObjects; 
    }

    
    const requests = getAxiosRequests(); 
    const playerStatsPromises = requests.map((req) => limiter.schedule(() => axios.request(req)));
     
    try {       
        const playerStats = await Promise.all(playerStatsPromises);

        let playerGames = {}; 
        
        for (let i = 0; i < playerStats.length; i++) {  //All of the responses for the playerIds array

            //Single response with the returned promises
            const playerStatsRes = playerStats[i].data.response;
            const playerId = playerStats[i].data.response[0].player.id;  

            let playerGameStats = [];
            
            //For each game handle stats 
            playerStatsRes.forEach(game => { 
                
                playerGameStats.push(
                    { 
                        gameId: game.game.id,

                        stats: {
                            min: game.min, points: game.points, fgm: game.fgm, 
                            fga: game.fga, fgp: game.fgp, ftm: game.ftm, 
                            fta: game.fta, ftp: game.ftp, tpm: game.tpm,
                            tpa: game.tpa, tpp: game.tpp, offReb: game.offReb,
                            defReb: game.defReb, totReb: game.totReb, assists: game.assist,
                            pFouls: game.pFouls, steals: game.steals, turnovers: game.turnovers,
                            blocks: game.blocks, plusMinus: game.plusMinus,
                            comment: game.comment == null ? 'No Comment' : game.comment
                        }
                    }
                ); 
            }); 
 
            playerGames[playerId] = playerGameStats; //{playerId: [{}, {}]}
        }

        //--------------------------------------------------------------------------------

        for (let i = 0; i < playerIds.length; i++) {

            
        }
        

    } catch (error) {
        functions.logger.error(error); 
    }
}

//--------------------------------------------------------------------------------------------

exports.createNBATeams = functions.runWith ({
    timeoutSeconds: 540, maxInstances: 100, memory: '1GB' 

}).https.onCall(async (data, context) => {
    const startTime = performance.now(); 

    //-------------------------------------------------------------------------

    const getTeamData = async (teamId) => {

        try {

            let results = []; 

            const [basic, roster, games, stats, standings] = await Promise.all([
                getBasicData(teamId),
                getTeamRoster(teamId),
                getTeamGames(teamId),
                getTeamStats(teamId),
                getTeamStandings(teamId)
            ]); 

    
            for (let season = 2015; season <= 2022; season++) {
    
                const teamData = {
                    code: basic.code,
                    name: basic.name,
                    nickname: basic.nickname,
                    city: basic.city,
    
                    conference: basic.leagues.standard.conference,
                    division: basic.leagues.standard.division,
    
                    roster: roster[season],
                    games: games[season],
                    stats: stats[season],
                    standings: standings[season]
                }
    
                const docRef = db.collection('Leagues')
                .doc('NBA').collection('Seasons').doc(season.toString())
                .collection('Teams').doc(teamId.toString());
    
                results.push({docRef: docRef, teamData: teamData}); 
            }
            
            return results; 

        } catch (error) { functions.logger.error(error) }

    }

    //---------------------------------------------------------------

    const teamIds = [ 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 16,
        17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 38, 40, 41
    ];
   
   
    try {  const batch = admin.firestore().batch(); 

        for (let i = 0; i < teamIds.length; i++) {
            const teamObjects = await getTeamData(teamIds[i]);
            console.log(`Currently fetching team (${teamIds[i]})...`); 

            for (let j of teamObjects) { 
                batch.set(j.docRef, j.teamData); 
                console.log(`The ${j.teamData.city + ' ' + j.teamData.nickname}'s data has been set!`);               
            }
        }

        await batch.commit(); const endTime = performance.now();  const time = endTime - startTime / 1000
        console.log(`Creating NBA Teams Took ${time} Seconds`);

    } catch (error) { functions.logger.error(error); }
    
})

//--------------------------------------------------------------------------------------------

exports.createNBAPlayers = functions.runWith ({
    timeoutSeconds: 540, maxInstances: 100, memory: '1GB' 

}).https.onCall(async (data, context) => { 

    const getPlayerData = async (playerIds, teamId, season) => {

        let results = []; 

        try {

            for (let i = 0; i < playerIds.length; i++) {

                const playerData = {
                    firstName: '',
                    lastName: '', 

                    birth: {
                        date: '',
                        country: ''
                    }, 

                    physical: {

                        height: {
                            feet: '',
                            inches: '',
                            meters: ''
                        }, 

                        weight: {
                            pounds: '',
                            kilograms: ''
                        },
                    }, 

                    career: {

                        college: {
                            school: '',
                            affiliation: ''
                        },

                        nba: {
                            start: '',
                            pro: '',
                            position: ''
                        }
                    },    
                }

                const docRef = db.collection('Leagues')
                .doc('NBA').collection('Seasons').doc(season.toString())
                .collection('Players').doc(playerIds[i].toString());

                results.push({docRef: docRef, playerData: playerData}); 
            }


        } catch (error) {
            functions.logger.error(error); 
        }
    }

    //---------------------------------------------------------------------

    
    const processPlayer = async (season) => {

        try { const batch = admin.firestore().batch(); 

            //Hashmap of teamIds: teamPlayers[id, id , id]
            const players = await getTeamRosterBySeason(season); 



        } catch (error) {
            functions.logger.error(error); 
        }
    }

    await processPlayer(2015); 
})            