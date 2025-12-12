import { Injectable, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { RagService } from '../../rag/rag.service.js';
import { TelegramUiService } from './telegram-ui.service.js';
import { GithubDiscussionsService } from '../github/github-discussions.service.js';
import { AnswerPack } from '../../rag/schemas.js';

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);
  private readonly adminChatId: string;

  constructor(
    private readonly ragService: RagService,
    private readonly ui: TelegramUiService,
    private readonly githubService: GithubDiscussionsService,
    configService: ConfigService,
  ) {
    const token = configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.adminChatId = configService.get<string>('TELEGRAM_ADMIN_CHAT_ID') ?? '';
    this.bot = new Telegraf(token ?? '');
    this.registerHandlers();
  }

  launch() {
    this.bot.launch();
    this.logger.log('Telegram bot started');
  }

  async sendDraftPack(pack: AnswerPack) {
    const message = this.ui.packToMessage(pack);
    await this.bot.telegram.sendMessage(this.adminChatId, message, {
      parse_mode: 'Markdown',
      reply_markup: this.ui.packKeyboard(pack),
    });
  }

  private registerHandlers() {
    this.bot.command('draft', async (ctx) => {
      if (!this.isAdmin(ctx.chat?.id)) return;
      const url = ctx.message.text.split(' ')[1];
      if (!url) {
        return ctx.reply('Usage: /draft <issue_url>');
      }
      const pack = await this.ragService.answerFromUrl(url);
      await this.sendDraftPack(pack);
    });

    this.bot.on('callback_query', async (ctx) => {
      if (!this.isAdmin(ctx.chat?.id)) return;
      const data = ctx.callbackQuery.data ?? '';
      if (data.startsWith('approve:')) {
        const draftId = data.split(':')[1];
        await ctx.reply(`Approved draft ${draftId}`);
        // In MVP we assume last sent pack context is known externally
      }
      if (data.startsWith('clarify')) {
        await ctx.reply('Using clarifying draft.');
      }
    });
  }

  private isAdmin(chatId?: number | string): boolean {
    return chatId?.toString() === this.adminChatId;
  }
}
