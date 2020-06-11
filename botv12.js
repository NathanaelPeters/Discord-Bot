const Discord = require("discord.js");
const client = new Discord.Client();
let config = require("./config");
const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(30);

client.on("ready", () => {
    client.user.setActivity("with Javascript");
    

    let needsPremiumUsers = [];
    let EveryoneWhoDoesNotHaveRole = []
    let EveryoneinServer2 = []
    let shouldNotHavePremium = [];

    g1 = client.guilds.cache
        .get(config.server1ID)

    let arr1 = g1.members.cache.array();
    let len1 = arr1.length;
    for (var i=0; i<len1; i++) {
        test = arr1[i].roles.cache.some(role => role.name === `${config.roleNameHasPremium}`);
        if (test) {
            needsPremiumUsers.push(arr1[i].user.id)
        }
    }

    g2 = client.guilds.cache.get(config.server2ID)
    let arr2 = g2.members.cache.array();
    let len2 = arr2.length;
    for (var i=0; i<len2; i++) {
        EveryoneWhoDoesNotHaveRole[i] = arr2[i].user.id     
    }
    for (var i=0; i<len2; i++) {
        test = arr2[i].roles.cache.some(role => role.name === `${config.roleNameNeedsPremium}`);
        if (test) {
            EveryoneinServer2.push(arr2[i].user.id)
        }
    }

    EveryoneinServer2.forEach( 
        member => {
            if (needsPremiumUsers.includes(member)) {
                return;
            }
            shouldNotHavePremium.push(member);
            })
    shouldNotHavePremium.forEach(id => { 
        if (g2.members.cache.get(id)) {
            member = g2.members.cache.get(id)
            role = g2.roles.cache.find(role => role.name === `${config.roleNameNeedsPremium}`)
            member.roles.remove(role).catch(console.error);
        }
    })
    console.log(EveryoneWhoDoesNotHaveRole)
    role = g2.roles.cache.find(role => role.name === `${config.roleNameNeedsPremium}`)
    EveryoneWhoDoesNotHaveRole.forEach( 
        id => {
            member = g2.members.cache.get(id)
            console.log(member.roles.cache.has(role)) 
            if(!member.roles.cache.has(role) && needsPremiumUsers.includes(id)) {
                member.roles.add(role).catch(console.error);
            }
        })
})



client.login(config.token1);
myEmitter.emit("event");
