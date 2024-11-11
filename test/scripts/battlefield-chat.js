// 定义常量URL
const BASE_URL =
	"https://nft-b2b2c-apim-azsc-eus-int.azure-api.net/eqmaster/chat/battlefield_agent";
const EVAL_URL =
	"https://nft-b2b2c-apim-azsc-eus-int.azure-api.net/eqmaster/eval/battlefield_agent";
const TOOLTIP_URL =
	"https://nft-b2b2c-apim-azsc-eus-int.azure-api.net/eqmaster/course_exists";
//return await sendRequest(chatHistory.person_id, chatHistory.course_id, body, EVAL_URL); battlefield_agent

import state from "../store/index.js";

function sendRequest(
	person_id,
	course_id,
	chat_content,
	outerBody,
	url = BASE_URL
) {
	return new Promise((resolve, reject) => {
		const formattedChatContent = formatChatContent(chat_content);
		console.log("formattedChatContent:", formattedChatContent);
		const body = outerBody || {
			person_id: state.getters.getUserId,
			course_id: parseInt(course_id) || 4,
			chat_content: JSON.stringify(formattedChatContent),
		};

		console.log("body:", body);

		uni.request({
			url: url,
			method: "POST",
			header: {
				"Content-Type": "application/json",
			},
			data: body,
			success: (res) => {
				resolve(res.data);
				
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}

function formatChatContent(chat_content) {
	const formattedChatContent = [];
	let assistantDialog = {
		role: "assistant",
		content: [{
			type: "text",
			text: {
				dialog: [],
			},
		}, ],
	};

	chat_content.forEach((chat) => {
		if (["Jason", "Sam", "Anna"].includes(chat.role)) {
			// If the role is one of the NPCs, add it to the assistant's dialog
			assistantDialog.content[0].text.dialog.push({
				role: chat.role,
				content: chat.content,
			});
		} else {
			// If the role is not an NPC and not 'tipping', it's a user turn
			if (chat.role !== "tipping") {
				// Push the current assistantDialog to formattedChatContent
				if (assistantDialog.content[0].text.dialog.length > 0) {
					// Convert dialog to a string
					assistantDialog.content[0].text = JSON.stringify(
						assistantDialog.content[0].text,
						null,
						4
					);
					formattedChatContent.push(assistantDialog);

					// Reset assistantDialog for the next batch of NPC dialogues
					assistantDialog = {
						role: "assistant",
						content: [{
							type: "text",
							text: {
								dialog: [],
							},
						}, ],
					};
				}

				// Add the user's dialogue to formattedChatContent
				const userDialog = {
					role: chat.role,
					content: Array.isArray(chat.content) ?
						chat.content.map((c) => ({
							type: c.type || "text",
							text: c.text || c,
						})) : [{
							type: "text",
							text: chat.content,
						}, ],
				};

				// Add the user's dialogue to formattedChatContent
				formattedChatContent.push(userDialog);
			}
		}
	});

	// Add any remaining assistant dialog to the formattedChatContent, but should
	// no way codes execute this block.
	if (assistantDialog.content[0].text.dialog.length > 0) {
		assistantDialog.content[0].text = JSON.stringify(
			assistantDialog.content[0].text,
			null,
			4
		);
		formattedChatContent.push(assistantDialog);
	}

	return formattedChatContent;
}

// 导出startField函数
export async function startField(person_id, courseId) {
	return await sendRequest(person_id, courseId, [{
		role: "user",
		content: [{
			type: "text",
			text: "StartDialog",
		}, ],
	}, ]);
}

// 导出reply函数
export async function reply(chatHistory, courseId) {
	console.log("reply:", chatHistory);
	return await sendRequest(chatHistory.person_id, courseId, chatHistory);
}

// 导出helpReply函数
export async function helpReply(chatHistory, courseId) {
	// 在 chat_content 中插入“帮我回答”
	chatHistory.push({
		role: "user",
		content: [{
			type: "text",
			text: "HelpReply",
		}, ],
	});
	const result = await sendRequest(
		chatHistory.person_id,
		courseId,
		chatHistory
	);
	chatHistory.pop();
	return result;
}

// 导出hint函数
export async function hint(chatHistory, courseId) {
	// 在 chat_content 中插入“给我提示”
	chatHistory.push({
		role: "user",
		content: [{
			type: "text",
			text: "GivemeHint",
		}, ],
	});
	console.log("send chathistory to backend!");
	const result = await sendRequest(
		chatHistory.person_id,
		courseId,
		chatHistory
	);
	console.log("get result from bk", result);
	chatHistory.pop();
	return result;
}

// 导出continueChat函数
export async function continueChat(chatHistory, courseId) {
	// 在 chat_content 中插入“继续”
	chatHistory.push({
		role: "user",
		content: [{
			type: "text",
			text: "ContinueNextRound",
		}, ],
	});
	const result = await sendRequest(
		chatHistory.person_id,
		courseId,
		chatHistory
	);
	chatHistory.pop();
	console.log("after pop:", chatHistory);
	return result;
}

// 请求后端是否显示工具提示
export async function checkShowToolTips(personId) {
	return new Promise((resolve, reject) => {
		// 构造完整的请求 URL
		const url = `${TOOLTIP_URL}/${personId}`; // 使用传入的 personId

		uni.request({
			url: url, // 使用构造的 URL
			method: "GET", // 使用 GET 请求
			success: (res) => {
				// 假设后端返回的是直接的 true/false
				if (typeof res.data === "boolean") {
					resolve(res.data); // 返回后端的 true/false
				} else {
					reject("Invalid response format");
				}
			},
			fail: (err) => {
				reject(err);
			},
		});
	});
}

// 导出evalBattlefield函数，发送到 /eval/battlefield
// export async function evalBattlefield(chatHistory) {
// 	return await sendRequest(chatHistory.person_id, chatHistory.course_id, chatHistory, EVAL_URL);
// }
export async function evalBattlefield(chatHistory, isPass, gemCount, diamonds) {
	// 在 body 中添加 isPass, gemCount, diamonds
	const body = {
		person_id: state.getters.getUserId,
		course_id: chatHistory.course_id || 4,
		chat_content: JSON.stringify(chatHistory),
		status: isPass ? "completed" : "incompleted", // 添加 isPass
		result: gemCount, // 添加 gemCount
		person_star: diamonds, // 添加 diamonds
	};
	console.log("evalBattlefield chatHistory: ", chatHistory);
	console.log("evalBattlefield body: ", body);

	// 发送请求
	return await sendRequest(
		chatHistory.person_id,
		chatHistory.course_id,
		chatHistory,
		body,
		EVAL_URL
	);
}

export function filterChatHistory(chatHistory) {
	const keywords = [
		"StartDialog",
		"ContinueNextRound",
		"HelpReply",
		"GivemeHint",
	];

	return chatHistory.filter((chat) => {
		for (let keyword of keywords) {
			if (chat.content.includes(keyword)) {
				return false;
			}
		}

		return true;
	});
}

export function getNpcIndex(role) {
	if (role == "Jason") {
		return 0;
	}
	if (role == "Sam") {
		return 1;
	}
	if (role == "Anna") {
		return 2;
	}

	return -1;
}