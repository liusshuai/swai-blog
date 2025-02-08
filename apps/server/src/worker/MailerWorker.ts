import { omit } from 'lodash';
import { SendMailOptions, SendMailType, sendEmailVerify } from '../utils/Mailer';

export interface MailerWorkerOptions extends SendMailOptions {
    type: SendMailType;
}

class MailerWorker {
    readonly errors: Error[] = [];

    constructor(readonly options: MailerWorkerOptions) {
        console.info('type: ', options.type);
        console.info('emails: ', JSON.stringify(options.toList));
    }

    get hasError(): boolean {
        return this.errors.length > 0;
    }

    static async run() {
        process.on('message', async (message: MailerWorkerOptions) => {
            const worker = new this(message);

            try {
                await worker.execute();
            } catch (e) {
                worker.errors.push(e);
            } finally {
                if (worker.hasError) {
                    process.exitCode = 1;

                    for (const err of worker.errors) {
                        console.error('send mail failed: ', err.toString());

                        if (err.stack) {
                            console.debug(err.stack);
                        }
                    }
                }

                process.exit();
            }
        });
    }

    async execute() {
        try {
            switch (this.options.type) {
                case 'emailverify':
                    await sendEmailVerify(omit(this.options, 'type'));
                    break;
                default:
                    break;
            }
        } catch (e) {
            this.errors.push(e);
        }
    }
}

MailerWorker.run();
