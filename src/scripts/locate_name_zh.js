import { getImg } from "./constants";

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
    if (!name || !sceneNumber) return getImg('/static/web/npc3.webp');
	var imageName = "";
	if (name == "小李") {
		imageName = "xiaoli";
	}
	if (name == "小王") {
		imageName = "xiaowang";
	}
	if (name == "小张") {
		imageName = "xiaozhang";
	}
	if (name == "张经理") {
		imageName = "managerZhang";
	}
	if (name == "老板") {
		imageName = "boss";
	}
	if (name == "同事") {
		imageName = "colleague";
	}
	if (name == "主管") {
		imageName = "zhuguan";
	}
	if (name == "HR") {
		imageName = "HR";
	}
    
    const avatarPath = getImg(`/static/web/npc/${sceneNumber}${imageName}.webp`);
	// const avatarPath = `/static/npc/444.png`;
    return avatarPath;
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
