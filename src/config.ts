const CONFIGURATION_KEYS = ['REACT_APP_API_BASE_URL'] as const;
type Config = Record<typeof CONFIGURATION_KEYS[number], string>;

const configuration: Config =
    process.env.NODE_ENV === 'production'
        ? (((window as unknown) as { appConfig: Config }).appConfig as Config)
        : ((process.env as unknown) as Config);

export default configuration;
