import { runtimeLogger } from '@/utils/Logger';
import { MailerWorkerOptions } from '@/worker/MailerWorker';
import { ChildProcess, fork } from 'child_process';

export class MailerJob {
    protected workerPath: string = require.resolve('../worker/MailerWorker');
    protected worker: null | ChildProcess = null;

    constructor(readonly options: MailerWorkerOptions) {}

    async run() {
        const worker = await this.createWorker();

        await new Promise((resolve) => {
            worker.on('exit', async (code, signal) => {
                if (signal) {
                    runtimeLogger.error('Worker process terminated due to receipt of signal %s', signal);
                }

                if (code !== 0) {
                    runtimeLogger.error('Worker process exited with code %s', code);
                }

                resolve(0);
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

            this.worker.send({ ...this.options });
        }

        return this.worker;
    }
}
