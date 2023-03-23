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

//------------------------------------------------------

exports.createNBATeams = functions.runWith({
    timeoutSeconds: 300,
    maxInstances: 100,
    memory: '1GB' 

}).https.onRequest(async (req, res) => {

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

            if (teamRes[i].nbaFranchise && teamRes[i].id != 37) { //weird result on that one id

                const teamData = {
                    code: teamRes[i].code,
                    name: teamRes[i].name,
                    nickname: teamRes[i].nickname,
                    city: teamRes[i].city,
                    conference: teamRes[i].leagues.standard.conference,
                    division: teamRes[i].leagues.standard.division,
                }
                
                const docRef = db.collection('Leagues').doc('NBA')
                .collection('Teams').doc(teamRes[i].id.toString());
                
                batch.set(docRef, teamData)
            }
        }

        await batch.commit();

    } catch (error) {
        functions.logger.error(error); 
    }

});



/*

    - Leagues: {

        - NBA: {

            - Active Parlays:

            - Active Versus

            - Seasons: {

                - 2015: {

                    - Teams: 

                    - Standings: {

                        conference: []
                        division: []
                    } 

                    - Players: {
                        games played: []
                        averages: 
                        averages against team: 
                    }
                }  
            }

        }
    }
*/

