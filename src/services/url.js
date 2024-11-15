export const API_ENDPOINT = 'https://nft-b2b2c-apim-azsc-eus-int.azure-api.net/eqmaster';
// const API_ENDPOINT = 'https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/';


export default {
    getUrl(path) {
        const locale = uni.getLocale();
        return `${API_ENDPOINT}${path}?locale=${locale}`;
    }
}