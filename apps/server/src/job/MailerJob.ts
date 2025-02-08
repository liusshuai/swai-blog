import { runtimeLogger } from '@/utils/Logger';
import { MailerWorkerOptions } from '@/worker/MailerWorker';
import { ChildProcess, fork } from 'child_process';
import { reject } from 'lodash';

export class MailerJob {
    protected workerPath: string = require.resolve('../worker/MailerWorker');
    protected worker: null | ChildProcess = null;

    constructor(readonly options: MailerWorkerOptions) {}

    async run() {
        const line = '-'.repeat(10);
        runtimeLogger.info(line, 'start mailer worker', line);

        const worker = await this.createWorker();

        await new Promise((resolve, reject) => {
            worker.on('exit', async (code, signal) => {
                let err: string = '';
                if (signal) {
                    err = 'Mail send worker process terminated due to receipt of signal ' + signal;
                } else if (code !== 0) {
                    err = 'Mail send worker process process exited with code ' + code;
                }

                if (err) {
                    runtimeLogger.error('Mail send failed: ', err);
                }

                runtimeLogger.info(line, 'Mailer worker ended', line);

                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(0);
                }
            });
        });

        this.worker = null;
    }

    abort = (signal: NodeJS.Signals = 'SIGINT'): void => {
        if (this.worker === null) {
            return;
        }

        this.worker.kill(signal);
    };

    protected async createWorker() {
        if (this.worker === null) {
            this.worker = fork(this.workerPath, [], {
                env: {
                    ...process.env,
                    FORCE_COLOR: '1',
                },
                silent: true,
            });

            this.worker.stdout?.on('data', (data) => {
                runtimeLogger.info(data.toString().trim());
            });

            this.worker.stderr?.on('data', (data) => {
                runtimeLogger.error(data.toString().trim());
            });

            this.worker.send({ ...this.options });
        }

        return this.worker;
    }
}
