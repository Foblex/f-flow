import { Injectable } from '@nestjs/common';
import { AnswerPack } from '../../rag/schemas.js';
import { Markup } from 'telegraf';

@Injectable()
export class TelegramUiService {
  packToMessage(pack: AnswerPack): string {
    const lines = [
      `*${pack.source.title ?? 'Draft response'}*`,
      `${pack.source.url}`,
      '',
      ...pack.drafts.map((d) => `*${d.id} (${d.tone})*: ${d.text}`),
      '',
      `Confidence: ${pack.confidence}`,
    ];
    return lines.join('\n');
  }

  packKeyboard(pack: AnswerPack) {
    return Markup.inlineKeyboard([
      pack.drafts.map((d) => Markup.button.callback(`Approve ${d.id}`, `approve:${d.id}`)),
      [Markup.button.callback('Regenerate', 'regenerate'), Markup.button.callback('Clarify', 'clarify')],
    ]).reply_markup;
  }
}
