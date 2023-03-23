import axios from 'axios'

//Old Key: 01487261e9mshca9214823c98e4fp1c5658jsn894b41e1d37d

// Function to get the players of a given team and season
export const getTeamPlayers = (team, season) => {

    return new Promise ((resolve, reject) => { 

        const options = {
            method: 'GET',
            url: 'https://v2.nba.api-sports.io/players',

            params: {team: team, season: season},
            headers: {
                'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
                'x-rapidapi-host': 'v2.nba.api-sports.io'
            }
        };

        axios.request(options).then((playerRes) => {

            console.log(playerRes.data.response);

            let players = []; 
            let playerData = playerRes.data.response;
            
            if (!(playerData)) {
                players.push(null);
                resolve (players);  
            }

            for (let i = 0; i < playerData.length; i++) {

                players.push({
                    playerID: playerData[i].id, 
                    playerName: playerData[i].firstname + ' ' + playerData[i].lastname
                }); 
            }

            resolve(players);
            
        }).catch((error) => {
            console.log(error);
            reject(error); 
        });
    })

}

//Gets all teams and their rosters from 2015 => 2022
export const getTeams = () => {


    const options = {
        method: 'GET',
        url: 'https://v2.nba.api-sports.io/teams',

        headers: {
            'x-rapidapi-key': '44811944fb9e22b829652e29b0ebf621',
            'x-rapidapi-host': 'v2.nba.api-sports.io'
        }
    }

    axios.request(options).then((teamRes) => {

        let teamsArr = teamRes.data.response;
        let teamsFinal = []; 
        let promises = [];

        for (let i = 0; i < teamsArr.length; i++) {

            if (teamsArr[i].nbaFranchise) {

                let teamObj = {

                    teamID: teamsArr[i].id,
                    teamCode: teamsArr[i].code,
                    teamName: teamsArr[i].name,
                    teamNickname: teamsArr[i].nickname,
                    teamCity: teamsArr[i].city,
                    teamConference: teamsArr[i].leagues.standard.conference, //Test this
                    teamDivision: teamsArr[i].leagues.standard.division,
                    teamPlayers: {}
                }

                //Loop through each season from 2015 to 2022
                for (let season = 2015; season <= 2022; season++) {

                    //Call getTeamPlayers, push the resulting Promise to the 'promises' array
                    promises.push(
                        getTeamPlayers(teamsArr[i].id, season).then((players) => {
                            teamObj.teamPlayers[season] = players; 
                        })
                    )
                }

                teamsFinal.push(teamObj);
            }  
        };

        //Wait for all promises to resolve then set state
        Promise.all(promises).then(() => {
            return teamsFinal;

        }).catch ((error) => {
            console.log(error);
        })

    }).catch ((error) => {
        console.error(error);
    });

}
