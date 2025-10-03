import { Event } from "../../../base";
import { Client, Collection } from "discord.js";
import * as path from "path";
import * as fs from "fs";
import kleur = require("kleur");

export default class EventCollector extends Collection<string, Event> {
  readonly client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
    this.collect();
  }

  private async collect() {
    const pathToEventDir = path.join(__dirname, "..", "..");

    fs.readdirSync(pathToEventDir).forEach((dir) => {
      fs.readdirSync(pathToEventDir + "/" + dir)
        .filter((file) => file.includes("event"))
        .forEach((file) => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const EventClass = require(`${pathToEventDir}/${dir}/${file}`);
          const event = new EventClass[Object.keys(EventClass)[0]]();
          if (event.once) {
            try {
              this.client.once(
                event.name,
                async (...args) => await event.execute(...args)
              );
            } catch (err) {
              console.log(err);
            }
          } else {
            try {
              this.client.on(
                event.name,
                async (...args) => await event.execute(...args)
              );
            } catch (err) {
              console.log(err);
            }
          }
          const date = new Date();
          console.log(
            kleur.green(`[${process.env.INSCRIPTION}] -`),
            kleur.yellow(
              `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            ),
            kleur.green(`-`),
            kleur.green(`[${event.name.toUpperCase()}]`),
            `успешно отработал (once: ${event.once})`
          );
        });
    });
  }
}
