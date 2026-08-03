
export function applyDefaultConfig(config: any, defaultConfig: any): any {
    var config = JSON.parse(JSON.stringify(config));
    for (let key in defaultConfig) {
        if (config[key] === undefined || config[key] === null || config[key] === '') {
            config[key] = defaultConfig[key];
        } else if (typeof config[key] === 'object') {
            config[key] = applyDefaultConfig(config[key], defaultConfig[key]);
        }
    }
    return config;
}
