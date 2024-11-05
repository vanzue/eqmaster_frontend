export function findLastName(str) {
	const regex = /(Sam|Anna)(?!.*(Sam|Anna))/;
	const match = str.match(regex);

	return match ? match[0] : 'Jason';
}

export function getAvatar(name) {
	if (name == '小李') {
		return '/static/npc1.png'
	}
	if (name == '小王') {
		return '/static/npc2.png'
	}
	if (name == "Emma") {
		return '/static/Emma.png'
	}
	if (name == "Bob") {
		return '/static/Bob.png'
	}
	if (name == "Ryan") {
		return '/static/Ryan.png'
	}
	if (name == "Colleague") {
		return '/static/Colleague.png'
	}
	if (name == "Monica") {
		return '/static/Monica.png'
	}
	if (name == "Alex") {
		return '/static/Alex.png'
	}


	return '/static/npc3.png'
}

export function getBattlefieldAvatar(name) {
	if (name == "领导") {
		return "/static/battlefield/boss.png";
	}
	if (name == "同事A") {
		return '/static/battlefield/xiaoA.png';
	}
	return "/static/battlefield/xiaoB.png";
}