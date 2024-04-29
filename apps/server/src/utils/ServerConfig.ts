import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { defaults } from 'lodash';

export class ServerConfig<T extends object> {
    private configs: T;

    constructor(readonly defaultConfigs: T) {
        this.configs = defaultConfigs;

        this.load();
    }

    get<K extends keyof T>(key: K): Readonly<T[K]> {
        return this.configs[key];
    }

    private load() {
        const env = process.env.NODE_ENV === 'production' ? 'prod' : 'local';
        const ymlFile: string = path.join(process.cwd(), `./config/${env}.yml`);

        if (fs.existsSync(ymlFile)) {
            try {
                const configs = yaml.load(fs.readFileSync(ymlFile, 'utf-8'));

                this.configs = defaults(configs, this.configs);
            } catch (e) {
                console.error(e.message);
            }
        }
    }
}
