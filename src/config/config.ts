// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//    ███╗   ███╗ █████╗ ██╗███╗   ██╗     ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
//    ████╗ ████║██╔══██╗██║████╗  ██║    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
//    ██╔████╔██║███████║██║██╔██╗ ██║    ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
//    ██║╚██╔╝██║██╔══██║██║██║╚██╗██║    ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
//    ██║ ╚═╝ ██║██║  ██║██║██║ ╚████║    ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝            
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



//                        -- -- IMPORTS -- --
import { ActivityType } from "discord.js"; // DON'T TOUCH




//                      -- -- MAIN ROLES -- --

export const role_Owner = ""; 
// Owner Role - Just any permissions and other

export const roles_MGRs = ["","","",];
// Managers roles - Like Owner but a little bit different

export const role_Curator = "";
// Curator role - Not a many permissions but 50% of functions of bot is locked

export const role_Moderator = "";
// Reguler role - has 20% functions of bot

export const roles_Staff = ["","","",];
// IDK why id added this - but i must be




//                   -- -- ROLES FOR MUTE/BAN -- --

export const role_LocalMute = "";
// Role which revoke access to write in text chat (to your role's permissions)

export const role_LocalBan = "";
// Role which revoke access to all channels (to your role's permissions)

export const role_EventBan = "";
// Role which temply don't using in bot



//                      -- -- VOICE ACTIVITY -- --

export const VoiceOn = false;
// Turn on bot join to voice channl? (true - Yes, false - No)

export const channel_voiceConnection = "";
// To Which voice channel bot can join




//                        -- -- BOT STATUS -- --
export const BotStatus = "online"; 
// Bot status in Guild members list - Allow only: "online", "dnd", "invisiable", "idle"

export const BotTextStatus = "Developed by Heysh1n"; 
// Bot status also in this list - You can write here anything

export const BotActivityType: ActivityType = ActivityType.Playing
// Bot status activity - What does bot doing... Allow only: Playing, Streaming, Watching, Listening, Competing
//   "Custom" - don't work

export const BotStatusURL = "https://github.com/Heysh1n"
// Bot status activity URL - Like Bot Streaming and URL to stream




//                        -- -- LOG CHANNELS -- --
export const channel_Moders = "";
// Channel for logging- Logging what doing moders (whitch command has been used)

export const channel_actionsLogging = "";
// Channel for logging - Regular log channel (Who has muted and who muted, reason and duration)

export const channel_Errors = "";
// Channel for Global Logging - This for sending to channel abot status of bot and crashes, warns...



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//     ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗     ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
//     ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
//     ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║    ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
//     ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║    ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
//     ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║    ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
//     ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝                                                                                                         
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


//                        -- -- HIDDEN ROLES -- --
export const hiddenRoles: string[] = [
  "",
  "",
  "",
];
// This roles don't show in action Embedв



//                        -- -- HIERARCHY ROLES -- --
export const hierarchyRoles = [
  role_Owner, // The highest of hierarchy roles
  ...roles_MGRs, 
  role_Curator,
  role_Moderator,
  ...roles_Staff// The lowest of hierarchy roles
];
// This hierarchy of roles for hierarchy system
