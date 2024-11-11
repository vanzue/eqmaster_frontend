const API_ENDPOINT = 'https://nft-b2b2c-apim-azsc-eus-int.azure-api.net/eqmaster';
// const API_ENDPOINT = 'https://eqmaster-gfh8gvfsfwgyb7cb.eastus-01.azurewebsites.net/';

export default {
	baseURL: API_ENDPOINT, // 将 baseURL 添加到导出的对象中

	async getHomepageData(userId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_homepage/${userId}`,
				method: 'POST'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				console.error('Failed to fetch homepage data:', response.statusCode);
				// Return mock data in case of failure
				return {
					"response": {
						"personal_info": {
							"name": "John Doe",
							"tag": "Engineer",
							"tag_description": "A detail-oriented engineer with a passion for problem-solving.",
							"job_id": "12345"
						},
						"eq_scores": {
							"score": 46,
							"dimension1_score": 54,
							"dimension1_detail": "Shows excellent emotional regulation in stressful situations.",
							"dimension2_score": 26,
							"dimension2_detail": "Displays strong empathy towards others' feelings.",
							"dimension3_score": 42,
							"dimension3_detail": "Able to make decisions without letting emotions interfere.",
							"dimension4_score": 50,
							"dimension4_detail": "Communicates emotions clearly and effectively.",
							"dimension5_score": 44,
							"dimension5_detail": "Manages interpersonal relationships with ease.",
							"summary": "Overall, emotionally intelligent and adaptive.",
							"detail": "John demonstrates balanced emotional intelligence across all areas.",
							"overall_suggestion": "Continue to enhance emotional regulation and interpersonal communication.",
							"detail_summary": "A well-rounded emotional intelligence profile with strong interpersonal skills."
						},
					}
				};
			}
		} catch (error) {
			console.error('Error fetching homepage data:', error);
			throw error;
		}
	},

	async getAnalysisList(userId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/${userId}/analysisList`,
				method: 'GET',
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get analysis list: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting analysis list:', error);
			throw error;
		}
	},
	async updateDiamonds(userId, count) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/update/diamond`,
				method: 'POST',
				data: {
					person_id: userId,
					num_diamond: count,
				}
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`update diamonds failed: ${response.statusCode}`);
			}
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	async uploadChatHistory(filePath, userId) {
		try {
			const response = await uni.uploadFile({
				url: `${API_ENDPOINT}/analyze/history`,
				filePath: filePath,
				name: 'file',
				formData: {
					user_id: userId
				}
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`upload chat history failed: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('upload chat history failed', error);
			throw error;
		}
	},

	async deleteMoment(chatId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/delete_chats/${chatId}`,
				method: 'DELETE',
			});

			if (response.statusCode === 200) {
				return response;
			} else {
				throw new Error(`Failed to create contact profile: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error creating contact profile:', error);
			throw error;
		}
	},

	async createContactProfile(data) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/create_contact_profile`,
				method: 'POST',
				data: data
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to create contact profile: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error creating contact profile:', error);
			throw error;
		}
	},

	async getResult(jobId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_result/${jobId}`,
				method: 'GET'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get result: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting result:', error);
			throw error;
		}
	},

	async getBattlefield(userId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_battlefield/${userId}`,
				method: 'GET'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get result: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting result:', error);
			throw error;
		}
	},

	async getVoice(wording, voice, style, rate) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/ttsaz`,
				method: 'POST',
				data: {
					text: wording,
					voice: voice,
					style: style,
					rate: rate
				},
			});
			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get result: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting result:', error);
			throw error;
		}
	},

	async getContactProfile(contactId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_contact_profile/${contactId}`,
				method: 'GET'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				console.error('Failed to fetch contact profile:', response.statusCode);
				throw new Error(`Failed to fetch contact profile: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error fetching contact profile:', error);
			throw error;
		}
	},

	async uploadImage(filePath) {
		try {
			const uploadFileRes = await uni.uploadFile({
				url: `${API_ENDPOINT}/upload_image`,
				filePath: filePath,
				name: 'file'
			});

			if (uploadFileRes.statusCode === 200) {
				return JSON.parse(uploadFileRes.data);
			} else {
				throw new Error(`Upload failed: ${uploadFileRes.statusCode}`);
			}
		} catch (error) {
			console.error('Upload failed', error);
			throw error;
		}
	},

	async createProfile(profileData) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/create_profile`,
				method: 'POST',
				data: profileData
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to create profile: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error creating profile:', error);
			throw error;
		}
	},

	async startScenario(jobId) {
		console.log('startScenario called with jobId:', jobId);
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/start_scenario/${jobId}?locale=en`,
				method: 'POST'
			});

			if (response.statusCode === 200) {
				console.log('response:', response);
				return response.data;
			} else {
				throw new Error(`Failed to start scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error starting scenario:', error);
			throw error;
		}
	},

	async startScenarioWithId(jobId, scenarioId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/start_scenario_by_scenario_id/${jobId}/${scenarioId}`,
				method: 'POST'
			});

			if (response.statusCode === 200) {
				console.error('response:', response);
				return response.data;
			} else {
				throw new Error(`Failed to start scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error starting scenario:', error);
			throw error;
		}
	},

	async getCurrentScenario(jobId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/get_current_scenario/${jobId}?locale=en`,
				method: 'POST'
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to get current scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error getting current scenario:', error);
			throw error;
		}
	},
	
	async initializeScenario() {
		// console.log('startScenario called with jobId:', jobId);
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/initialize_scenario?locale=en`,
				method: 'POST',
			});
	
			if (response.statusCode === 200) {
				console.log('response:', response);
				return response.data;
			} else {
				throw new Error(`Failed to initialize_scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error initialize_scenario:', error);
			throw error;
		}
	},
	
	async retrieveScenario(scenarioId,num) {
		// console.log('startScenario called with jobId:', jobId);
		console.log("#####retrieveScenarioResponse data:", scenarioId);
		console.log("#####retrieveScenarioResponse data:", num);
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/retrieve_scene`,
				method: 'POST',
				data: {
					scenario_id: parseInt(scenarioId),
					choices: String(num),
					locale: "en"
				}
			});
	
			if (response.statusCode === 200) {
				console.log('response:', response);
				return response.data;
			} else {
				throw new Error(`Failed to initialize_scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error initialize_scenario:', error);
			throw error;
		}
	},
	
	async finalizeScenario(scores,job_id,dialogue_history) {
		// console.log('startScenario called with jobId:', jobId);
		console.log("#####finalizeScenarioResponse data:", scores);
		console.log("#####finalizeScenarioResponse data:", job_id);
		console.log("#####finalizeScenarioResponse data:", dialogue_history);
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/finalize_scenario`,
				method: 'POST',
				data: {
					scores: scores,
					job_id: job_id,
					dialogue_history: dialogue_history,
					locale: "en"
				}
			});
	
			if (response.statusCode === 200) {
				console.log('response:', response);
				return response.data;
			} else {
				throw new Error(`Failed to finalizeScenarioResponse: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error finalizeScenarioResponse:', error);
			throw error;
		}
	},

	async chooseScenario(choice, jobId) {
		try {
			const response = await uni.request({
				url: `${API_ENDPOINT}/choose_scenario?locale=en`,
				method: 'POST',
				data: {
					choice: choice,
					job_id: jobId
				}
			});

			if (response.statusCode === 200) {
				return response.data;
			} else {
				throw new Error(`Failed to choose scenario: ${response.statusCode}`);
			}
		} catch (error) {
			console.error('Error choosing scenario:', error);
			throw error;
		}
	},

	async getNpcsByCourseId(courseId) {
		try {
			// const response = await uni.request({
            //     url: `${API_ENDPOINT}/get_npcs_by_course/${courseId}`,
            //     method: 'GET'
            // });

			// if (response.statusCode === 200) {
			// 	return response.data;
			// } else {
			// 	throw new Error(`Failed to fetch NPCs by course ID: ${response.statusCode}`);
			// }
			const response = await this.getNpcMock(courseId);
			return response.data;

		} catch (error) {
			console.error('Error fetching NPCs by course ID:', error);
			throw error;
		}
	},
	async getNpcMock(courseId) {
		return new Promise((resolve) => {
			const mockNpcs = {
				4: [
					{
						characterName: "Jason",
						health: 10,
						avatar: "/static/battlefield/boss11.png",
						voice: "en-US-DavisNeural",
						style: "chat",
						rate: "-10%",
					},
					{
						characterName: "Sam",
						health: 10,
						avatar: "/static/battlefield/xiaoA1.png",
						voice: "en-US-JasonNeural",
						style: "friendly",
						rate: "0%",
					},
					{
						characterName: "Anna",
						health: 10,
						avatar: "/static/battlefield/xiaoB1.png",
						voice: "en-US-JennyNeural",
						style: "chat",
						rate: "0%",
					},
				],
				1: [
					{
						characterName: "领导",
						health: 10,
						avatar: "/static/battlefield/boss.png",
						voice: "en-US-DavisNeural",
						style: "chat",
						rate: "-10%",
					},
					{
						characterName: "同事A",
						health: 10,
						avatar: "/static/battlefield/xiaoA.png",
						voice: "en-US-JasonNeural",
						style: "friendly",
						rate: "0%",
					},
					{
						characterName: "同事B",
						health: 10,
						avatar: "/static/battlefield/xiaoB.png",
						voice: "en-US-JennyNeural",
						style: "chat",
						rate: "0%",
					},
				],
			};
			resolve({ data: mockNpcs[courseId] || [] });
		});
	},

	// Add more API methods here as needed
};