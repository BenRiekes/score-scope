import { Network, Alchemy } from "alchemy-sdk"; 
import {query, where, doc, getDoc, collection, getFirestore } from "firebase/firestore";

export const getUserAddress = async (uid) => {

    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef); 

    if (userDoc.exists()) {
        console.log(userDoc.data());
    }
}

export const getUserBalance = async (uid) => {

    if (!uid) return; 

    const address = getUserAddress(uid);

    const settings = {
        apiKey: "-j_EMb6mI2xbZMkcSOgXF-R34u_RpYv-",
        network: Network.GOERLI_TESTNET
    }; 

    const alchemy = new Alchemy(settings); 

    let userBalance; 

    alchemy.core.getBalance(address, "latest").then (response => {

        userBalance = parseInt(response._hex); 
        return userBalance; 

    }).catch (error => {
        console.log("An error occured " + error); 
    })
}

