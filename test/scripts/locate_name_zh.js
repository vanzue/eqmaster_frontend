export function findLastName(str) {
	const regex = /(Sam|Anna)(?!.*(Sam|Anna))/;
	const match = str.match(regex);

	return match ? match[0] : 'Jason';
}

// export function getAvatar(name) {
// 	if (name == '小李') {
// 		return '/static/npc1.png'
// 	}
// 	if (name == '小王') {
// 		return '/static/npc2.png'
// 	}

// 	return '/static/npc3.png'
// }

export function getAvatar(name, sceneNumber) {
    if (!name || !sceneNumber) return '/static/npc3.png';
    
    const avatarPath = `/static/npc/${sceneNumber}${name}.png`;
	// const avatarPath = `/static/npc/444.png`;
    return avatarPath;
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
