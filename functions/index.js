//Firebase:
const admin = require ("firebase-admin");
const functions = require ("firebase-functions");

//Func:
admin.initializeApp(); 
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
})





