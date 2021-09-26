import * as api from './main.js'
import promp from 'prompt-sync'
import fs from 'fs'

const prompt = promp()

//temp variables
const schoolUUID = 'b6256752-bbcf-42e0-8c7c-9e4643f0e827';

//check for stored login
var creds;
if (fs.existsSync('creds.txt')) {
    creds = JSON.parse(fs.readFileSync('creds.txt','utf8'));
    console.log('login loaded');
}else{
    console.log('no login stored');
}

//login prompt (if no login is stored)
var username;
var passwd;
if (!creds) {
    username = prompt('user: ');
    passwd = prompt.hide('pass: ');

    const save = prompt('remember login? [y/n]');
    if (save == 'y') {
        fs.writeFile('creds.txt', JSON.stringify({'user' : username, 'pass' : passwd}), (err) => {console.log(err);})
        console.log('login saved');
    } else if (save == 'n'){
        console.log('not saving login');
    } else {
        console.log('invalid character, not saving login');
    }
} else {
    username = creds.user;
    passwd = creds.pass;
}

let tokens = await api.Authenticate(schoolUUID, username, passwd);

const curDate = new Date();
let result = await api.GetSchedule(tokens.access_token,curDate,2);

//filters and formats output
function RoosterCLI(rawRooster) {
    rawRooster.items.sort((a, b) => {return a.beginLesuur - b.beginLesuur})
    let ret = '';
    rawRooster.items.forEach(element => {
        const vak = element.titel.split(' - ')[1].split('.')[1];
        const body = `
        lesuur = ${element.beginLesuur}
        lokaal = ${element.locatie}
        vak = ${vak} \n
        `;
        ret += body;
    });
    return ret
}

console.log(RoosterCLI(result));
