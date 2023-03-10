//Firebase:
const admin = require ("firebase-admin");
const functions = require ("firebase-functions");

//Func:
admin.initializeApp(); 
const Wallet = require('ethereumjs-wallet');
const CreateValidation = require ("../src/Functions/CreateValidation");


exports.createUser = functions.https.onCall(async (data, context) => {

    const db = admin.firestore(); 
    const createWallet = Wallet.generate(); 

    
    return new Promise (async (resolve, reject) => {

        //User data from form:
        const uid = data.uid; 
        const email = data.email; 
        const username = data.username; 
        const age = data.age; 
        const gender = data.gender;

        
        //------------------------------------------------------------------

        try {   
            const dataCheck = await CreateValidation(data);

            if (dataCheck.isValid === false) {
                resolve(dataCheck.reason); 
            } 

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
            })


        } catch {

        }
  
    })
})





