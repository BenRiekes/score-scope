
//Firebase:
import { getAuth } from "firebase/auth"
import {query, where, getDocs, collection, getFirestore } from "firebase/firestore";

//Fetch calls: --------------------------------------------------------------

export const valueExist = async(field, val) => {

    const db = getFirestore();
    const q = query(collection(db, 'users'), where(field, '==', val)); 
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
        return ({error: true, message: `${field} already in use`});
    } 

    return ({error: false, message: ''});
}

       
//If validation: -----------------------------------------------

export const checkEmail = (email) => {

    if (email === '') {
        return ({error: true, message: 'Required field'}); 
    } 

    return ({error: false, message: ''});   
}

// --------------------------------------------------------------

export const checkUsername = (username) => {
    const regex = /^[a-zA-Z0-9._]+$/;

    if (username === '') {
        return ({error: true, message: 'Required Field'});
    }    

    if (username.length < 3) {
        return ({error: true, message: 'Usernames must be greater than 3 characters'});
    }

    if (!(regex.test(username))) {
        return ({error: true, message: 'Usernames must consist of only letters, numbers, periods, and underscores'});
    }

    return ({error: false, message: ''}); 
}

// --------------------------------------------------------------

export const checkPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!^&#])[a-zA-Z0-9!^&#]*$/;

    if (password === '') {
        return ({error: true, message: 'Required Field'})
    }    

    if (password.length < 7) {
        return ({error: true, message: 'Password must be at least 7 characters long'});
    }

    if (!(regex.test(password))) {
        return ({
            error: true, 
            message: 'Must consist of numbers, one uppercase, one lowercase, and one special character (^ & # !)'
        }); 
    } 

    return ({error: false, message: ''}); 
}

//--------------------------------------------------------------

export const checkSetPassword = (setPassword, password) => {

    if (setPassword === '') {
        return ({error: true, message: 'Required field'}); 
    }

    if (setPassword !== password) {
        return ({error: true, message: 'passwords do not match'});
    } 
        
    return ({error: false, message: ''}); 
}

//--------------------------------------------------------------

export const checkAge = (age) => {

    const regexAge = /^(1[8-9]|[2-9]\d|100)$/;
    const regexInput = /^\d+$/;

    if (age === undefined) {
        return ({error: true, message: 'Required field'})   
    }; 

    if (!(regexInput.test(age))) {
        return ({error: true, message: 'Numbers only'});
    } 

    if (!regexAge.test(age)) {
        return ({error: true, message: 'Must be between 18 and 100 to create an account'});
    } 

    return ({error: false, message: ''}); 
}

//--------------------------------------------------------------

export const checkGender = (gender) => {

    const genderIsValid = () => {
        const validGenders = ['Male', 'Female', 'Other']; 

        for (let i = 0; i < validGenders.length; i++) {
            if (validGenders[i] === gender && gender != '') {
                return true; 
            }  
        }

        return false; 
    }

    if (gender === '') {
        return ({error: true, message: 'Required Field'});
    } 

    if (!(genderIsValid())) {
        return ({error: true, message: 'Invalid gender selection'})
    } 

    return ({error: false, message: ''});
}

//--------------------------------------------------------------

export const checkGenderBox = (genderBox, val) => {

    let selectedGender; 
    let newBox = { ...genderBox }  

    const getTrueKeys = () => {

        let trueKeys = []; 
        const keys = ['Male', 'Female', 'Other']; 
        
        for (let i = 0; i < keys.length; i++) {

            if (newBox[keys[i]] === true) {
                trueKeys.push(keys[i]); 
            }
        }

        return trueKeys; 
    }

    const trueKeys = getTrueKeys();
    const prevKey= trueKeys[0]; 

    if (!trueKeys) {  //All boxes unchecked
        newBox[val] = true; 
        selectedGender = val;
    }

    if (trueKeys && prevKey !== val) { //All boxes unchecked
        newBox[val] = true;
        newBox[prevKey] = false; 
        selectedGender = val; 
    }

    if (trueKeys && prevKey === val) { //Uncheck Box
        newBox[val] = false; 
        selectedGender = ''; 
    }
 
    return {
        genderBox: newBox,
        selectedGender: selectedGender,
        invalid: checkGender(selectedGender), 
    }
}

//--------------------------------------------------------------

export const checkAllErrors = async (formObject) => {

    /*
        Condition to limit writes to firebase query: 

        If the email and username fields do not have
        any errors occur, check if their values are taken.

        This effectively limit firebase queries becuase they 
        only get called when the create user button is clicked 
    */

    let emailObj = checkEmail(formObject.email); 
    let usernameObj = checkUsername(formObject.username);

    if (!(emailObj.error)) {
        emailObj = await valueExist('email', formObject.email); 
    }

    if (!(usernameObj.error)) {
        usernameObj = await valueExist('username', formObject.username); 
    }

    //-----------------------------------------------------

    let errorObject = ({
        email: emailObj,
        username: usernameObj,
        password: checkPassword(formObject.password),
        setPassword: checkSetPassword(formObject.setPassword, formObject.password), 
        age: checkAge(formObject.age),
        gender: checkGender(formObject.gender)
    })

    for (let key in errorObject) {

        if (errorObject[key].error == true) {
            return {passedCheck: false, invalid: errorObject}; 
        }
    }

    return {passedCheck: true, invalid: errorObject}; 
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
        case 'age' :
            return checkAge(val);
        case'gender' :
            checkGender(val)
        default :
            return; 
    }
}

//--------------------------------------------------------------

