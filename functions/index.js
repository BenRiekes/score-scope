//Firebase:
const admin = require ("firebase-admin");
const functions = require ("firebase-functions");

//Func:
admin.initializeApp(); 
const Wallet = require('ethereumjs-wallet');
const CreateValidation = require ("../src/Functions/CreateValidation");


exports.createUser = functions.https.onCall(async (data, context) => {

    const db = admin.firestore(); 

    

    return new Promise (async (resolve, reject) => {

        //User data from form:
        const uid = data.uid; 
        const email = data.email; 
        const username = data.username; 
        const age = data.age; 
        const gender = data.gender;

        
        //------------------------------------------------------------------

        try {   
            const dataCheck = await CreateValidation(data)

            if (dataCheck.isValid === false) {
                resolve(dataCheck.reason); 
            } 

            await admin.firestore().collection('users').doc(uid).set ({

                //Non nested data
                age: age,
                email: email,
                gender: gender,
                username: username,
                

            })


        } catch {

        }

        
        
        //------------------------------------------------------------------
        
        
    })
})





