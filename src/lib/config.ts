import fs from 'fs';
import yaml from 'js-yaml';

let config: any = null;

export function getConfig() {
    if (!config) {
        try {
            config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
        } catch (e) {
            console.error('Failed to load config:', e);
        }
    }
    return config;
}