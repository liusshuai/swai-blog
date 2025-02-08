import { AppDataSource } from '@/common/database';
import { MailSendRecord, MailSendState } from '@/entity/MailSendRecord';
import { MailerJob } from '@/job/MailerJob';
import { runtimeLogger } from '@/utils/Logger';
import { MailerWorkerOptions } from '@/worker/MailerWorker';
import { queue } from 'async';
import { cpus } from 'os';

export interface MailerTask {
    taskId: number;
    options: MailerWorkerOptions;
    job?: MailerJob;
}

export const mailerQueue = queue(async (task: MailerTask) => {
    const mailRecordRepo = AppDataSource.getRepository(MailSendRecord);
    const record = await mailRecordRepo.findOneBy({
        id: task.taskId,
    });
    try {
        const job = (task.job = new MailerJob(task.options));
        await job.run();
        if (record) {
            record.state = MailSendState.SUCCESS;
        }
    } catch (e) {
        if (record) {
            record.state = MailSendState.FAIL;
        }
    }

    record && (await mailRecordRepo.save(record));
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
