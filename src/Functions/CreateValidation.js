
//Firebase:
import {query, where, getDocs, collection, getFirestore } from "firebase/firestore";


const validUsername = async(username) => {

    const db = getFirestore();

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

        return ({isValid: true, reason: undefined}); 
    }

    return ({isValid: false, reason: undefined}); 
}


const CreateValidation = async(formParams) => {

   
    switch (formParams) {

        case formParams.password[0] != formParams.password[1] :
            return ({isValid: false, reason: "Passwords do not match"});

        case formParams.password[0].length != 6 || formParams.password[1] != 6 :
            return ({isValid: false, reason: "Passwords mus be 6 alphanumeric characters"}); 

        case validUsername(formParams.username).isValid === false :
            return ({isValid: false, reason: validUsername(formParams.username).reason}); 
        
        case formParams.gender != "Male" || formParams.gender != "Female" || formParams.gender != "Other" :
            return ({isValid: false, reason: "Gender must be either Male, Female, or Other"}); 
        
        case formParams.age < 18 : 
            return ({isValid: false, reason: "You must be older than 18 to create an account"});
            
        default :
            return ({isValid: true, reason: undefined});     
    }
}

export default CreateValidation;