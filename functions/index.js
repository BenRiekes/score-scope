//Firebase:
import admin from "firebase-admin";
import functions from "firebase-functions";
admin.initializeApp(); 

exports.createUser = functions.https.onCall(async (data, context) => {

    const db = admin.firestore()

    return new Promise (async (resolve, reject) => {

        //User data from form:
        const email = data.email; 
        const username = data.username; 
        const password = data.password;
        const age = data.age; 
        const gender = data.gender;

        //------------------------------------------------------------------

        const validUsername = async() => {

            const q = query(collection(db, 'users'), where('username', '==', username)); 
            const querySnapshot = await getDocs(q); 
            
            if (querySnapshot.length === 0) {

                const regex = /^[a-zA-Z0-9._]+$/;

                if (regex.test(username) === false) {

                    return ({
                        isValid: false,
                        reason: "Usernames must consist of only letters, numbers, periods, and underscores"
                    })

                } else if (username.length > 20) {

                    return ({
                        isValid: false,
                        reason: "Usernames can not exceed 20 characters"
                    });
                }

                return ({isValid: true, reason: ""}); 
            }

            return ({isValid: false, reason: "Username is already taken"}); 
        }

        //------------------------------------------------------------------

        const validEmail = async() => {

            const q = query(collection(db, 'users'), where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.length === 0) {

                return ({isValid: true, reason: ""}); 
            }

            return ({isValid: false, reason: ""}); 
        }

        //------------------------------------------------------------------
        
        if (age < 18) resolve ("Must be at least 18 to create an account");
        if (password[0] != password[1]) resolve ("Passwords do not match"); 
        if (password[0].length != 6) resolve ("Password must be 6 alphanumeric characters"); 

        if (validEmail().isValid === false) resolve (validEmail().reason); 
        if (validUsername().isValid === false) resolve (validUsername().reason);
         
        
    })
})





