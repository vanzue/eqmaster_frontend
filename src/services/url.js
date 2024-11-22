// #ifdef MP-WEIXIN
export const API_ENDPOINT = 'https://eqmaster.aipowernft.com';
// #endif

// #ifndef MP-WEIXIN
export const API_ENDPOINT = 'https://nft-b2b2c-apim-azsc-eus-int.azure-api.net/eqmaster';
// #endif

export default {
    getUrl(path) {
        const locale = uni.getLocale();
        return `${API_ENDPOINT}${path}?locale=${locale}`;
    }
}