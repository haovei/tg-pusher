class Telegram {
    private token: string;
    private chatId: string;

    constructor(token: string, chatId: string) {
        this.token = token;
        this.chatId = chatId;
    }

    async sendMessage(message: string): Promise<void> {
        const url = `https://api.telegram.org/bot${this.token}/sendMessage`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: this.chatId,
                text: message,
                parse_mode: 'Markdown',
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Error sending message: ${response.statusText}`);
        }
    }
}

export default async function ({ token, chatId, message }: { token: string; chatId: string; message: string }) {
    if (!token || !chatId || !message) {
        return {
            ok: false,
            message: 'Missing required parameters',
        };
    }

    const telegram = new Telegram(token, chatId);

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
