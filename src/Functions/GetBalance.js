import { ethers } from "ethers";

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

    const network = "goerli";
    const alchemyKey = "-j_EMb6mI2xbZMkcSOgXF-R34u_RpYv-"; 
    const provider = new ethers.provider.AlchemyProvider(network, alchemyKey); 

    let userBalance; 

    if (address) {

        provider.getBalance(address).then((balance) => {

            let balanceInEth = ethers.utils.formatEther(balance);
            userBalance = balanceInEth.toString().substring(0, 4);

        }).catch (error => {
            console.log("An error occured " + error); 
        });
        
        if (toUSD) {
            return {ETH: userBalance, USD: GetUSDBalance(parseInt(userBalance))}
        } 

    } else {
        userBalance = '?'
    }

    return userBalance; 
}

export default GetUserBalance; 