import { MailerJob } from '@/job/MailerJob';
import { runtimeLogger } from '@/utils/Logger';
import { MailerWorkerOptions } from '@/worker/MailerWorker';
import { queue } from 'async';
import { cpus } from 'os';

export interface MailerTask {
    options: MailerWorkerOptions;
    job?: MailerJob;
}

export const mailerQueue = queue(async (task: MailerTask) => {
    try {
        const job = (task.job = new MailerJob(task.options));
        await job.run();
    } catch (e) {
        runtimeLogger.error(e.message);
    }
}, cpus().length - 1);

export function terminateMailerQueue() {
    return new Promise((resolve) => {
        if (mailerQueue.idle()) resolve(null);

        mailerQueue.pause();

        mailerQueue.drain(() => {
            mailerQueue.kill();

            resolve(null);
        });

        for (const worker of mailerQueue.workersList()) {
            const { job } = worker.data;

            if (job) {
                job.abort('SIGKILL');
            }
        }
    });
}
