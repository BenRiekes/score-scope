//Firebase:
const admin = require ("firebase-admin");
const functions = require ("firebase-functions");

//Func:
admin.initializeApp(); 
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
            reject ({isValid: true, reason: "An error occured while creating your account"});
        })

    })
}); 

//------------------------------------------------------

exports.getNBAData = functions.https.onRequest(async (data, context) => {

    const apiHost = 'api-nba-v1.p.rapidapi.com';
    const apiKey = '01487261e9mshca9214823c98e4fp1c5658jsn894b41e1d37d';

    const nbaTeams = [
        'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets', 
        'Chicago Bulls','Cleveland Cavaliers', 'Dallas Mavericks','Denver Nuggets',
        'Detroit Pistons', 'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers',
        'LA Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies', 'Miami Heat', 'Milwaukee Bucks',
        'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks', 'Oklahoma City Thunder',
        'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns', 'Portland Trail Blazers','Sacramento Kings',
        'San Antonio Spurs', 'Toronto Raptors', 'Utah Jazz','Washington Wizards'
    ];

})
