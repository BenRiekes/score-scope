import { ethers } from "ethers";
import { Network, Alchemy } from "alchemy-sdk"; 


const GetUSDBalance = async (userBalance) => {

    const symbol = "ETH";
    const convert = "USD"; 
    const cmcKey = "ee5d418f-b6bf-4be2-8754-7d7765b79959"; 
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${convert}`;

    fetch (url, {
        headers: {
            'X-CMC_BASIC_API_KEY': cmcKey
        }
    }).then(response => response.json()).then(data => {

        let usdVal =  userBalance * data.data[symbol].quote[convert].price; 
        return usdVal.toString(); 

    }).catch (error => {
        console.log("An error occured " + error); 
    })
}

const GetUserBalance = async (address, toUSD) => {

    if (!address) return ("?"); 

    const settings = {
        apiKey: "-j_EMb6mI2xbZMkcSOgXF-R34u_RpYv-",
        network: Network.GOERLI_TESTNET
    }; 

    const alchemy = new Alchemy(settings); 

    let userBalance; 

    alchemy.core.getBalance(address.toString(), "latest").then (response => {

        userBalance = parseInt(response._hex); 

        console.log(userBalance);

        if (toUSD) {
            return ({ETH: userBalance, USD: GetUSDBalance(userBalance)}); 
        }

        return userBalance; 

    }).catch (error => {
        console.log("An error occured " + error); 
    })
}

export default GetUserBalance; 