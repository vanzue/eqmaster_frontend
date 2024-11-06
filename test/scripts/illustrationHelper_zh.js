export function illustrationSrc(homepageData, store) {
	let returnObj = {
		animal: "",
		animal_name: '卡皮巴拉',
		animal_icon: '/static/resulten/monkey.png',
		animal_name_bg: '/static/resulten/animal-name-1.png',
		weakness: 'Weakness',
		characteristics: '',
	};

	if (homepageData && homepageData.response && homepageData.response.eq_scores) {
		const scores = homepageData.response.eq_scores;
		const maxScore = Math.max(
			scores.dimension1_score, scores.dimension2_score, scores.dimension3_score,
			scores.dimension4_score, scores.dimension5_score
		);
		console.log("max score is:", maxScore);
// 1-pereception；2-motivation/self regulation；3-socialskill；4-empathy；5-motivation/self regulation；
		if (maxScore === scores.dimension1_score) {
			returnObj = {
				animal: "ostrich",
				animal_name: '鸵鸟',
				animal_icon: '/static/resulten/ostrich.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '感知力',
				characteristics: '你像拥有第六感一样，总能敏锐地捕捉到细微的情绪变化和暗示。',
				
				
			};
		} else if (maxScore === scores.dimension2_score) {
			returnObj = {
				animal: "monkey",
				animal_name: '猴子',
				animal_icon: '/static/resulten/monkey.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '掌控力',
				characteristics: '即使在压力之下，你也能稳稳掌控情绪，保持冷静自若。',
				
				
				
			};
		} else if (maxScore === scores.dimension3_score) {
			returnObj = {
				animal: "hedgehog",
				animal_name: '刺猬',
				animal_icon: '/static/resulten/hedgehog.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '共情力',
				characteristics: `你总能轻松洞察并理解他人的情绪，仿佛读懂他们的心思一般。`,
				
				
			};
		} else if (maxScore === scores.dimension4_score) {
			returnObj = {
				animal: "coyote",
				animal_name: '土狼',
				animal_icon: '/static/resulten/coyote.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '社交力',
				characteristics: '你就像一座桥梁，轻松拉近彼此距离，激发大家携手合作，共同前行。',
			};
		} else if (maxScore === scores.dimension5_score) {
			returnObj = {
				animal: "capybara",
				animal_name: '卡皮巴拉',
				animal_icon: '/static/resulten/capybara.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '驱动力',
				characteristics: '你像一团火焰，燃烧着无穷的能量，始终专注于目标，不断点燃周围人的激情与动力。',
			};
		}

		// Update store if it's provided
		if (store) {
			store.commit('setWeakness', returnObj.weakness);
			store.commit('setCharateristics', returnObj.characteristics);
		}
	}

	return returnObj;
}