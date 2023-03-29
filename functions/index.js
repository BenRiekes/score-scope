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

            let players = await getTeamRoster(teamIds[teamIndex])
            .map((returnObj) => returnObj['playerId']);

            for (let j = 0; j <= players.length; j++) {

                if (hasBeenAdded[players[j]] !== true) {
                    results.push(players[j]);
                    hasBeenAdded[players[j]] = true;  
                }
            }
        }   

        if (teamIndex === 41) { return results; } else { getPlayers(teamIndex + 1); } 
    }
   
    getPlayers(0); 
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
        
        for (let season = 2015; season <= 2022; j++) {  

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

exports.createNBAPlayers = functions.runWith({
    timeoutSeconds: 540, maxInstances: 100, memory: '1GB'

}).https.onCall(async (data, context) => {

   

})

/*
    Players (1 doc per season | 7 docs total) |: 

        - Where do you pull?: 

            - Firebase Teams docs (name, id)
        - 

        - Fields to track: 

            - Basic: 

                - id (doc id); 
                - first name 
                - last name 
                - team 

                - games played that season
            - 

            - Advanced: 

                - Season averages:
                    -points
                    -pos
                    -min
                    -fgm
                    -fga
                    -fgp
                    -ftm
                    -fta
                    -ftp
                    -tpm
                    -tpa
                    -tpp
                    -offReb
                    -defReb
                    -totReb
                    -assists
                    -pFouls
                    -steals
                    -turnovers
                    -blocks
                    -plusMinus
                - 

                - Seaons averages against each team:
                    - [Above, per team id]
                    - win %
                - 

                - Season avergas on the road 
                - Season average at home 

                - games played: 
                    - [Array of doc id s]
                - 
            - 
        - 
    - 
*/


/*
    Games: 

        - Home Team:
            docId: name
        - 
        - Visitor Team

        - Line Score: 
            1st qtr => 4th qtr
        - 

        - Final score 

        - Players played in game: 
            
            - home:
                - player id: stats 
            - 

            - visitor:
                - player id: stats 
            - 
        - 
    - 
*/