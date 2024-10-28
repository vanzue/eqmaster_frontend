export function illustrationSrc(homepageData, store) {
	let returnObj = {
		animal_name: 'Capypara',
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

		if (maxScore === scores.dimension1_score) {
			returnObj = {
				animal_name: 'Capypara',
				animal_icon: '/static/resulten/capybara.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: 'Motivation',
				characteristics: 'is your EQ superpower—you bring energy and stay focused on your goals.',
			};
		} else if (maxScore === scores.dimension2_score) {
			returnObj = {
				animal_name: 'hedgehog',
				animal_icon: '/static/resulten/hedgehog.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: 'Empathy',
				characteristics: `is your EQ superpower—you easily notice and understand others' emotions.`,
			};
		} else if (maxScore === scores.dimension3_score) {
			returnObj = {
				animal_name: 'Coyote',
				animal_icon: '/static/resulten/coyote.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: 'Social Skill',
				characteristics: 'is your EQ superpower—you build connections and encourage collaboration.',
			};
		} else if (maxScore === scores.dimension4_score) {
			returnObj = {
				animal_name: 'Ostrich',
				animal_icon: '/static/resulten/ostrich.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: 'Perception',
				characteristics: 'is your EQ superpower—you’re great at sensing subtle cues and moods.',
			};
		} else if (maxScore === scores.dimension5_score) {
			returnObj = {
				animal_name: 'Monkey',
				animal_icon: '/static/resulten/monkey.png',
				animal_name_bg: '/static/resulten/animal-name-1.png',
				weakness: 'Self-regulation',
				characteristics: 'is your EQ superpower—you control emotions well, even under stress.',
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