import axios from "axios";
import { Network, Alchemy } from "alchemy-sdk"; 
import {query, where, doc, getDoc, collection, getFirestore } from "firebase/firestore";

export const getUserAddress = async (uid) => {

    const db = getFirestore();
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef); 

    if (userDoc.exists()) {
        return userDoc.data().wallet.address;
    }

    return; 
}


export const getUserBalance = async (uid) => {

    const settings = {
        apiKey: "-j_EMb6mI2xbZMkcSOgXF-R34u_RpYv-",
        network: Network.GOERLI_TESTNET
    }; 

    const alchemy = new Alchemy(settings); 
    const address = await getUserAddress(uid);
    
    if (address) {
        const balanceRes = await alchemy.core.getBalance(address, 'latest')

        let maticBalance = parseInt(balanceRes._hex, 16);
        let userBalance = ({matic: maticBalance.toString(), usd: '?'}); 
    
        return userBalance;
    } 

    return ({matic: '?', usd: '?'}); 
}

