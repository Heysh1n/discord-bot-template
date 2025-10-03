import { Client, Events } from "discord.js";
import { EventStructure } from "@structures/event.structure";
import { EventReadyService } from "./services/ready.service";
export class Ready extends EventStructure {
  name: string = Events.ClientReady;
  once: boolean = true;

  
  public async execute(client: Client) {
    const ready = new EventReadyService(client);
    await Promise.all([await ready.allGuilds(), await ready.commandActions()]);
  }
}
