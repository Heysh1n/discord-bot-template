import {role_Owner, roles_MGRs, role_Curator, role_Moderator, roles_Staff} from "./config";

export type CommandPermissionType = {
  channels: string[];
  roles: string[];
  users: string[];
  categories: string[];
  strict: boolean
};
// IF YOU UNDERSTAND WHO TO CREATE CUSOTM PREMISIONS - YOU CAN TOUCH - IF NOT - DON'T TOUCH!
export const OwnerAccess: CommandPermissionType = {
  channels: ["*"],
  roles: [role_Owner],
  users: ["*"],
  categories: ["*"],
  strict: false
};
export const MGRAccess: CommandPermissionType = {
  channels: ["*"],
  roles: [role_Owner, ...roles_MGRs],
  users: ["*"],
  categories: ["*"],
  strict: false
};
export const CuratorAccess: CommandPermissionType = {
  channels: ["*"],
  roles: [role_Owner, ...roles_MGRs, role_Curator],
  users: ["*"],
  categories: ["*"],
  strict: false
};
export const ModerMainAccsess: CommandPermissionType = {
  channels: ["*"],
  roles: [role_Owner, ...roles_MGRs, ...role_Curator, ...role_Moderator],
  users: ["*"],
  categories: ["*"],
  strict: false
};

export const OtherStaffAccess: CommandPermissionType = {
  channels: ["*"],
  roles: [role_Owner, ...roles_MGRs, ...role_Curator, ...role_Moderator, ...roles_Staff],
  users: ["*"],
  categories: ["*"],
  strict: false
};