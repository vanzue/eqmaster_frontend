import { getImg } from "./constants";
export function findLastName(str) {
	const regex = /(Sam|Anna)(?!.*(Sam|Anna))/;
	const match = str.match(regex);

	return match ? match[0] : 'Jason';
}

export function getAvatar(name) {
	if (name == '小李') {
		return getImg('/static/web/npc1.webp')
	}
	if (name == '小王') {
		return getImg('/static/web/npc2.webp')
	}
	if (name == "Emma") {
		return getImg('/static/web/Emma.webp')
	}
	if (name == "Bob") {
		return getImg('/static/web/Bob.webp')
	}
	if (name == "Ryan") {
		return getImg('/static/web/Ryan.webp')
	}
	if (name == "Colleague") {
		return getImg('/static/web/Colleague.webp')
	}
	if (name == "Monica") {
		return getImg('/static/web/Monica.webp')
	}
	if (name == "Alex") {
		return getImg('/static/web/Alex.webp')
	}


	return getImg('/static/web/npc3.webp')
}

export function getBattlefieldAvatar(name) {
	if (name == "领导") {
		return getImg("/static/web/battlefield/boss.webp");
	}
	if (name == "同事A") {
		return getImg('/static/web/battlefield/xiaoA.webp');
	}
	return getImg("/static/web/battlefield/xiaoB.webp");
}