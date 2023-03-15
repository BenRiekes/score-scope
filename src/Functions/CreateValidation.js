
//Firebase:
import {query, where, getDocs, collection, getFirestore } from "firebase/firestore";

//Validators: --------------------------------------------------------------

export const valueExist = async(field, value) => {

    const db = getFirestore();
    const q = query(collection(db, 'users'), where(field, '==', value)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs) return true; 

    return false; 
}

// --------------------------------------------------------------

export const checkEmail = (email) => { 
 
    switch (true) {
        case email === '' :
            return ({error: true, message: 'email is required'}); 
        
        default:
            return ({error: false, message: ''});   
    }  
}

// --------------------------------------------------------------

export const checkUsername = (username) => {

    const regex = /^[a-zA-Z0-9._]+$/;
    
    switch (true) {
        case username === '' :
            return ({error: true, message: 'email is required'}); 
            
        case username.length < 3 :
            return ({error: true, message: 'Usernames must be > 3 characters'});

        case regex.test(username) === false :
            return ({error: true, message: 'Usernames must consist of only letters, numbers, periods, and underscores'}); 

        case valueExist('username', username) === true :
            return ({error: true, message: 'Username already exist'}); 

        default: 
            return ({error: false, message: ''}); 

    }
}

// --------------------------------------------------------------

export const checkPassword = (password) => {

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!^&#])[a-zA-Z0-9!^&#]*$/;

    switch (true) {

        case password.length < 7 :
            return ({error: true, message: 'Password must be at least 7 characters long'});

        case regex.test(password) === false :
            return ({
                error: true, 
                message: 'Must consist of numbers, one uppercase, one lowercase, and one special character (^ & # !)'
            }); 

        default : 
            return ({error: false, message: ''}); 
    }
}

//--------------------------------------------------------------

export const checkSetPassword = (setPassword, password) => {

    switch (true) {

        case setPassword !== password :
            return ({error: true, message: 'passwords do not match'});
        
        default :
            return ({error: false, message: ''}); 
    }
}

//--------------------------------------------------------------

export const checkAge = (age) => {

    const regexAge = /^(1[8-9]|[2-9]\d|100)$/;
    const regexInput = /^\d+$/;

    switch (true) {
        case regexInput.test(age) === false :
            return ({error: true, message: 'Numbers only'});

        case regexAge.test(age) === false :
            return ({error: true, message: 'Must be between 18 and 100 to create an account'});

        default :
            return ({error: false, message: ''}); 
    }
}

//--------------------------------------------------------------

export const checkGender = (gender, genderBox) => {

    // //FIX ME: UNDEFINED SOMEHOW GETTING PASSED IN FROM HANDLECHECKBOX
    // const keys = ['Male', 'Female', 'Other']; 

    // const genderExist = () => {

    //     for (let i = 0; i < keys.length; i++) {
    //         if (gender === keys[i]) {
    //             return true; 
    //         }
    //     }
    //     return false; 
    // }

    // const boxState = () => {

    //     console.log(genderBox[keys['Male']]);

    //     for (let i = 0; i < keys.length; i++) {
    
    //         if (genderBox[keys[i]] === true) {
    //             return true; 
    //         }
    //     }
    //     return false; 
    // }

    // switch (true) {

    //     case genderExist() != true :
    //         return ({error: true, message: 'Invalid gender selection'}); 

    //     case boxState() != true :
    //         return ({error: true, message: 'Gender selection required'}); 

    //     default :
    //         return ({error: false, message: ''}); 
    // }   
}

//--------------------------------------------------------------

export const checkAll = (formObject) => {
    
    const repsonseObj = ({
        0: formObject.email,
        1: formObject.username,
        2: formObject.password,
        3: formObject.setPassword,
        4: formObject.age,
        5: formObject.gender
    });

    for (let i = 0; i <= 5; i++) {

        if (repsonseObj[i].error === true) {
            return true; 
        }
    }

    return false; 
}

//--------------------------------------------------------------

export const checkSpecific = (field, val) => {

    switch (field) {
        case 'email' :
            return checkEmail(val); 
        case 'username' :
            return checkUsername(val); 
        case 'password' :
            return checkPassword(val); 
        case 'setPassword' :
            return checkSetPassword(val); 
        case 'age' :
            return checkAge(val); 
        // case 'gender' :
        //     return checkGender(val); 
        default :
            return; 
    }
}

//--------------------------------------------------------------

