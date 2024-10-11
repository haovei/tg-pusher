class Telegram {
    private token: string;
    private chatId: string | number;
    private topicId?: number;

    constructor(token: string, chatId: string | number, topicId?: number) {
        this.token = token;
        this.chatId = chatId;
        this.topicId = topicId;
    }

    async sendMessage(message: string): Promise<void> {
        const url = `https://api.telegram.org/bot${this.token}/sendMessage`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

        const params: { chat_id: string | number; text: string; parse_mode: string; message_thread_id?: number } = {
            chat_id: this.chatId,
            text: message,
            parse_mode: 'Markdown',
        };
        if (this.topicId) {
            params.message_thread_id = this.topicId;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Error sending message: ${response.statusText}`);
        }
    }
}

export default async function ({
    token,
    chatId,
    topicId,
    message,
}: {
    token: string;
    chatId: string;
    topicId?: number;
    message: string;
}) {
    if (!token || !chatId || !message) {
        return {
            ok: false,
            message: 'Missing required parameters',
        };
    }

    const telegram = new Telegram(token, chatId, topicId);

    try {
        await telegram.sendMessage(message);
        return {
            ok: true,
            message: 'Message sent successfully',
        };
    } catch (error: any) {
        console.error(error);
        return {
            ok: false,
            message: error.message,
        };
    }
}
