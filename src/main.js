import fetch from 'node-fetch';
import prompt from 'prompt-sync';

/*
TODO: 

*/

//prepare arguments
var args = process.argv.slice(2); //'process' and 'path' are redundant

/*

//fetch scholen
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

//choose school
console.log(scholenLijst);
const promptc = prompt({sigint: true});
const number = promptc('school number: ');
console.log(scholenLijst[number]); //Augustinianum = 9
*/

//temp variables !!REMOVE BEFORE PUBLICATION!!
let schoolUUID = 'b6256752-bbcf-42e0-8c7c-9e4643f0e827';
let passwd = 'A1b2c3d4!';
let username = '4403';

//returns response object
async function Authenticate(schoolUUID, username, password) {

const body = {
    grant_type: 'password',
    username: `${schoolUUID}\\${username}`,
    password: password,
    scope: 'openid',
    client_id: 'D50E0C06-32D1-4B41-A137-A9A850C892C2'
};

//convert JSON to encoded URL
var formBody = [];
for (let property in body) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(body[property]);
    formBody.push(encodedKey + "=" + encodedValue);
}
formBody = formBody.join('&');

//send authentication request
const response = await fetch('https://somtoday.nl/oauth2/token', {
	method: 'POST',
	body: formBody,
	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});
const data = await response.json();

return await data;
}

//process response
let tokens = await Authenticate(schoolUUID, username, passwd);
console.log(tokens);

