//import { PermissionsString } from "discord.js";

import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export type ApplicationCommandOptionChoice = {
    readonly name: string;
    readonly value: string | number;
}
  
export type ApplicationCommandOption = {
    readonly type: number;
    readonly name: string;
    readonly description: string;
    readonly required?: boolean;
    readonly choices?: Array<ApplicationCommandOptionChoice>;
    readonly options?: Array<ApplicationCommandOption>;
}

export interface JockbotCommand {
    // readonly name: string;
    // readonly description: string;
    // readonly options?: Array<ApplicationCommandOption>;
    // readonly default_permission?: boolean;
    // //readonly permissions: PermissionsString = 'SEND_MESSAGES';
    // readonly usage: string;
    // readonly devOnly?: boolean;
    callback(interaction: ChatInputCommandInteraction): Promise<void>;
    readonly getCommandBuilder: () => SlashCommandBuilder;
}
