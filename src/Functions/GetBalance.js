import { Network, Alchemy } from "alchemy-sdk"; 


const GetUserBalance = async (address) => {

    if (!address) return; 

    const settings = {
        apiKey: "-j_EMb6mI2xbZMkcSOgXF-R34u_RpYv-",
        network: Network.GOERLI_TESTNET
    }; 

    const alchemy = new Alchemy(settings); 

    let userBalance; 

    alchemy.core.getBalance(address.toString(), "latest").then (response => {

        userBalance = parseInt(response._hex); 
        return userBalance; 

    }).catch (error => {
        console.log("An error occured " + error); 
    })
}

export default GetUserBalance; 