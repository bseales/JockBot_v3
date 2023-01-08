import { CommandInteraction } from 'discord.js'

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
    execute(interaction: CommandInteraction): Promise<void>;
}
