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

    const maticSettings = {
        apiKey: "-j_EMb6mI2xbZMkcSOgXF-R34u_RpYv-",
        network: Network.GOERLI_TESTNET
    }; 

    const alchemy = new Alchemy(maticSettings); 
    const address = await getUserAddress(uid);
    
    if (address) {

        //Matic:
        const maticResponse = await alchemy.core.getBalance(address, 'latest')
        const maticBalance = parseInt(maticResponse._hex, 16);

        //USD: 
        const usdResponse = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd&precision=2'
        ); 
        const usdPrice = usdResponse.data['matic-network'].usd 

        const usdBalance = maticBalance * usdPrice; 
        const userBalance = ({matic: maticBalance.toString(), usd: usdBalance.toString()}); 
    
        return userBalance;
    } 

    return ({matic: '?', usd: '?'}); 
}

