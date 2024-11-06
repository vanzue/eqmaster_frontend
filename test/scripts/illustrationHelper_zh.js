export function illustrationSrc(homepageData, store) {
	let returnObj = {
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
				animal_name: '鸵鸟',
				animal_icon: '/static/resulten/ostrich.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '感知力',
				characteristics: '感知力强的人对于自我他人的情绪变化都非常敏锐，鸵鸟可以帮助你复杂环境中保持冷静。',
				
				
			};
		} else if (maxScore === scores.dimension2_score) {
			returnObj = {
				animal_name: '猴子',
				animal_icon: '/static/resulten/monkey.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '掌控力',
				characteristics: '自我掌控力强的人常常陷入自我反思与约束，猴子可以帮助你更好地平衡整体能力。',
				
				
				
			};
		} else if (maxScore === scores.dimension3_score) {
			returnObj = {
				animal_name: '土狼',
				animal_icon: '/static/resulten/coyote.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '社交力',
				characteristics: '社交能力强的人有时会忽略独处反思的空间，土狼可以帮助你培养更沉稳的初始风格。',
			};
		} else if (maxScore === scores.dimension4_score) {
			returnObj = {
				animal_name: '刺猬',
				animal_icon: '/static/resulten/hedgehog.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '共情力',
				characteristics: `共情能力强的人容易受到他人情绪波动影响，刺猬可以教会你保护自己不受伤害。`,
				
				
			};
		} else if (maxScore === scores.dimension5_score) {
			returnObj = {
				animal_name: '卡皮巴拉',
				animal_icon: '/static/resulten/capybara.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: '驱动力',
				characteristics: '驱动力强的人会过于执着于目标导向，水豚可以应到你学会放轻松，适当从中抽离。',
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