import * as api from './main.js'


//temp variables !!REMOVE BEFORE PUBLICATION!!
let schoolUUID = 'b6256752-bbcf-42e0-8c7c-9e4643f0e827';
let passwd = '';
let username = '4403';

let tokens = await api.Authenticate(schoolUUID, username, passwd);

let refresh = await api.GetStudentID(tokens.access_token);

console.log(refresh.items[0]);
console.log(refresh.items[0].links);

/*
//process response
let tokens = await Authenticate(schoolUUID, username, passwd);
console.log(tokens);
const date = new Date();
let rooster = await getSchedule(tokens.access_token, date, 1);
console.log(rooster);
*/
