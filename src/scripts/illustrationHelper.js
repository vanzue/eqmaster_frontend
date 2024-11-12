import { getImg } from "./constants";
export function illustrationSrc(homepageData, store) {
	let returnObj = {
		animal_name: '水豚',
		animal_icon: getImg('/static/resulten/monkey.png'),
		animal_name_bg: getImg('/static/resulten/animal-name-1.png'),
		// weakness指的是superPower
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
				animal_icon: getImg('/static/resulten/ostrich.png'),
				animal_name_bg: getImg('/static/resulten/animal-name-1.png'),
				weakness: '感知力',
				characteristics: '你的情商超能力在于你能敏锐地察觉细微的线索和情绪。',
			};
		} else if (maxScore === scores.dimension2_score) {
			returnObj = {
				animal_name: '猴子',
				animal_icon: getImg('/static/resulten/monkey.png'),
				animal_name_bg: getImg('/static/resulten/animal-name-1.png'),
				weakness: '掌控力',
				characteristics: '你的情商超能力在于你能很好地控制情绪，即使在压力下。',
			};
		} else if (maxScore === scores.dimension3_score) {
			returnObj = {
				animal_name: '刺猬',
				animal_icon: getImg('/static/resulten/hedgehog.png'),
				animal_name_bg: getImg('/static/resulten/animal-name-1.png'),
				weakness: '共情力',
				characteristics: '你的情商超能力在于你能轻易察觉和理解他人的情绪。',
			};
		} else if (maxScore === scores.dimension4_score) {
			returnObj = {
				animal_name: '狼',
				animal_icon: getImg('/static/resulten/coyote.png'),
				animal_name_bg: getImg('/static/resulten/animal-name-1.png'),
				weakness: '社交力',
				characteristics: '你的情商超能力在于你能建立联系并鼓励合作。',
			};
		} else if (maxScore === scores.dimension5_score) {
			returnObj = {
				animal_name: '水豚',
				animal_icon: getImg('/static/resulten/capybara.png'),
				animal_name_bg: getImg('/static/resulten/animal-name-1.png'),
				weakness: '驱动力',
				characteristics: '是你的情商超能力——你带来活力并专注于你的目标。',
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