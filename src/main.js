import fetch from 'node-fetch';

//this should be built in
Date.prototype.AddDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

//convert JSON to encoded URL
function JsonToUrl(object) {
    var formBody = [];
    for (let property in object) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(object[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join('&');
    return formBody;
}

//fetch scholen
async function GetSchools() {
    const response = await fetch('https://servers.somtoday.nl/organisaties.json');
    const data = await response.json();
    const scholen = data[0].instellingen;
    if (!scholen) {
        console.error('Scholen ophalen mislukt');
    }

    //format scholen
    let scholenLijst = [];

    scholen.forEach(element => {
        scholenLijst.push(element.naam + ' - ' + element.plaats); //format: [number] [school name] - [school location]
    });
    scholenLijst.sort() //sort A-Z
    for (let i=0 ; i < scholenLijst.length; i++) {
        scholenLijst[i] = i + ': ' + scholenLijst[i]; //add number prefixes
    }

    return await scholenLijst;
}

//get an access token
async function Authenticate(schoolUUID, username, password) {

    const body = {
        grant_type: 'password',
        username: `${schoolUUID}\\${username}`,
        password: password,
        scope: 'openid',
        client_id: 'D50E0C06-32D1-4B41-A137-A9A850C892C2'
    };

    const formBody = JsonToUrl(body);

    //send authentication request
    const response = await fetch('https://somtoday.nl/oauth2/token', {
    	method: 'POST',
    	body: formBody,
    	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });

    const data = await response.json();
    return await data;
}

//gets 'days' days of schedule starting from 'beginDate'
async function GetSchedule(access_token, beginDate, days) {
    const endDate = beginDate.AddDays(days); 
    let response;
    try {
        response = await fetch(`https://api.somtoday.nl/rest/v1/afspraken?begindatum=${beginDate.toISOString().split('T')[0]}&einddatum=${endDate.toISOString().split('T')[0]}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Accept': "application/json"
            }
        });
    } catch (error) {
        console.error(error);
    }
    const data = await response.json();
    return await data;
}

async function GetStudentInfo(access_token) {
    let response;
    try {
        response = await fetch(`https://api.somtoday.nl/rest/v1/leerlingen`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Accept': "application/json"
            }
        });
    } catch (error) {
        console.error(error);
    }
    const data = await response.json();
    return await data;
}

//refresh access token
async function RefreshToken(refresh_token) {

    const body = {
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
        client_id: 'D50E0C06-32D1-4B41-A137-A9A850C892C2'
    };
    
    const formBody = JsonToUrl(body);
    
    //send authentication request
    const response = await fetch('https://somtoday.nl/oauth2/token', {
        method: 'POST',
        body: formBody,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
    
    const data = await response.json();
    return await data;
}

export { GetSchools, Authenticate, GetSchedule, RefreshToken, GetStudentInfo}