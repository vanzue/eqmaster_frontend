import { getImg } from "./constants";
export function findLastName(str) {
	const regex = /(Sam|Anna)(?!.*(Sam|Anna))/;
	const match = str.match(regex);

	return match ? match[0] : 'Jason';
}

export function getAvatar(name) {
	if (name == '小李') {
		return getImg('/static/npc1.png')
	}
	if (name == '小王') {
		return getImg('/static/npc2.png')
	}
	if (name == "Emma") {
		return getImg('/static/Emma.png')
	}
	if (name == "Bob") {
		return getImg('/static/Bob.png')
	}
	if (name == "Ryan") {
		return getImg('/static/Ryan.png')
	}
	if (name == "Colleague") {
		return getImg('/static/Colleague.png')
	}
	if (name == "Monica") {
		return getImg('/static/Monica.png')
	}
	if (name == "Alex") {
		return getImg('/static/Alex.png')
	}


	return getImg('/static/npc3.png')
}

export function getBattlefieldAvatar(name) {
	if (name == "领导") {
		return getImg("/static/battlefield/boss.png");
	}
	if (name == "同事A") {
		return getImg('/static/battlefield/xiaoA.png');
	}
	return getImg("/static/battlefield/xiaoB.png");
}