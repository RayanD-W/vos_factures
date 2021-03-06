import axios from "axios";
let isConnected = false
let testMode = false
const axiosInstance = axios.create({
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

const addInterceptor = (baseURL: string, tokenAPI: string): void => {
    if (isConnected) return;
    isConnected = true;
    axiosInstance.interceptors.request.use(config => {
        const newConfig = {
            ...config,
        };
        if (!config || !config.url || config.url.indexOf(baseURL) === -1) {
            newConfig.url = baseURL + (config.url && config.url[0] === "/" ? "" : "/") + config.url;
        }
        if (config.method === "get" || config.method === "delete") {
            const indexOfParamsIndicator = newConfig?.url?.indexOf("?");
            if (indexOfParamsIndicator === -1) {
                newConfig.url = newConfig?.url?.concat("?");
            }
            newConfig.url = newConfig?.url?.concat(`${indexOfParamsIndicator === -1 ? "" : "&"}api_token=${tokenAPI}`);
            if (testMode) {
                newConfig.url = newConfig?.url?.concat(`&test=true`);
            }
        } else {
            if (!config.data) {
                newConfig.data = {};
            }
            // eslint-disable-next-line @typescript-eslint/camelcase
            newConfig.data.api_token = tokenAPI;
            if (testMode) {
                for (let key in newConfig.data) {
                    if (typeof newConfig.data[key] === "object" && newConfig.data[key].hasOwnProperty("test")) {
                        newConfig.data[key].test = true;
                    }
                }
                newConfig.data.test = true;
            }
        }
        return newConfig;
    });
};

const enableTest = (): void => {
    testMode = true;
};

const disableTest = (): void => {
    testMode = false;
};

export { axiosInstance as instance, addInterceptor, isConnected, enableTest, disableTest };
