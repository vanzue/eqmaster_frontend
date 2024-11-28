import en from './en.json'
import zhHans from './zh-Hans.json'
import zhHant from './zh-Hant.json'

export const DEFAULT_LOCALE = 'en'; // en, zh-Hans

export const messages = {
	en,
	'en-US': en,
	'zh': zhHans,
	'zh-Hans': zhHans,
	'zh-Hant': zhHant
}

export default {

	getLocale() {
		return uni.getStorageSync('locale') || DEFAULT_LOCALE;
	},

	getShortLocale() {
        let locale = uni.getStorageSync('locale') || DEFAULT_LOCALE;

        console.log(`uni.getStorageSync('locale'): ${locale}`);

        if (locale.startsWith('zh')) {
            locale = 'zh';
        } else {
            locale = 'en'
        }
        return locale;
    }
}