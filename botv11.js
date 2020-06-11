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
  let shouldNotHavePremium = [];

  client.guilds
    .get(config.server1ID)
    .roles.find(role => role.name === `${config.roleNameHasPremium}`)
    .members.map(m => needsPremiumUsers.push(m.id));

  client.guilds
    .get(config.server2ID)
    .roles.find(role => role.name === `${config.roleNameNeedsPremium}`)
    .members.forEach(member => {
      if (needsPremiumUsers.includes(member.id)) {
        return;
      }
      shouldNotHavePremium.push(member.id);
      shouldNotHavePremium.forEach(id => {
        client.guilds
          .get(config.server2ID)
          .members.get(id)
          .removeRole(
            client.guilds
              .get(config.server2ID)
              .roles.find(
                role => role.name === `${config.roleNameNeedsPremium}`
              ).id
          );
      });
    });
  console.log(needsPremiumUsers);

  needsPremiumUsers.forEach(id => {
    client.guilds
      .get(config.server2ID)
      .members.get(id)
      .addRole(
        client.guilds
          .get(config.server2ID)
          .roles.find(role => role.name === `${config.roleNameNeedsPremium}`).id
      );
  });
});

client.login(config.token1);
myEmitter.emit("event");
