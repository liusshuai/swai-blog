import { omit } from 'lodash';
import { SendMailOptions, SendMailType, sendEmailVerify } from '../utils/Mailer';
import { runtimeLogger } from '@/utils/Logger';

export interface MailerWorkerOptions extends SendMailOptions {
    type: SendMailType;
}

class MailerWorker {
    readonly errors: Error[] = [];

    constructor(readonly options: MailerWorkerOptions) {
        runtimeLogger.info('start mailer worker');
        runtimeLogger.info('type: ', options.type);
        runtimeLogger.info('email: ', JSON.stringify(options.toList));
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
                        runtimeLogger.error(err.toString());

                        if (err.stack) {
                            runtimeLogger.debug(err.stack);
                        }
                    }
                }

                runtimeLogger.info('mailer worker ended, got % errors', worker.errors.length);
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
