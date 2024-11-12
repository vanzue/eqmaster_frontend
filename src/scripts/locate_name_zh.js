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
    if (!name || !sceneNumber) return getImg('/static/npc3.png');
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
    
    const avatarPath = getImg(`/static/npc/${sceneNumber}${imageName}.png`);
	// const avatarPath = `/static/npc/444.png`;
    return avatarPath;
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
