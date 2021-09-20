import * as api from './main.js'
import promp from 'prompt-sync'

const prompt = promp()

//temp variables !!REMOVE BEFORE PUBLICATION!!
const schoolUUID = 'b6256752-bbcf-42e0-8c7c-9e4643f0e827';
const _pwd = Buffer.from('QTFiMmMzZDQh', 'base64');
const _usr = '4403';

const username = prompt('user: ', _usr);
const passwd = prompt.hide('pass: ');

let tokens = await api.Authenticate(schoolUUID, username, passwd);

const curDate = new Date(2021,9,19);
let result = await api.GetSchedule(tokens.access_token,curDate,1);

//filters and formats output
function RoosterCLI(rawRooster) {
    let ret = '';
    rawRooster = rawRooster.items;
    rawRooster.forEach(element => {
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
