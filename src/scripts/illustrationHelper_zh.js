import { getImg } from "./constants";
export function illustrationSrc(homepageData, store, t) {
	let returnObj = {
		animal: "",
		animal_name: t('illustration.animal.capybara.name'),
		animal_icon: getImg('/static/web/resulten/monkey.webp'),
		animal_name_bg: getImg('/static/web/resulten/animal-name-1.webp'),
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
				animal_name: t('illustration.animal.ostrich.name'),
				animal_icon: getImg('/static/web/dashboard/en/ostrich.webp'),
				animal_name_bg: getImg('/static/web/resulten/animal-name-1.webp'),
				weakness: t('illustration.animal.ostrich.weakness'),
				characteristics: t('illustration.animal.ostrich.characteristics'),


			};
		} else if (maxScore === scores.dimension2_score) {
			returnObj = {
				animal: "monkey",
				animal_name: t('illustration.animal.monkey.name'),
				animal_icon: getImg('/static/web/dashboard/en/monkey.webp'),
				animal_name_bg: getImg('/static/web/resulten/animal-name-1.webp'),
				weakness: t('illustration.animal.monkey.weakness'),
				characteristics: t('illustration.animal.monkey.characteristics'),

			};
		} else if (maxScore === scores.dimension3_score) {
			returnObj = {
				animal: "hedgehog",
				animal_name: t('illustration.animal.hedgehog.name'),
				animal_icon: getImg('/static/web/dashboard/en/hedgehog.webp'),
				animal_name_bg: getImg('/static/web/resulten/animal-name-1.webp'),
				weakness: t('illustration.animal.hedgehog.weakness'),
				characteristics: t('illustration.animal.hedgehog.characteristics'),


			};
		} else if (maxScore === scores.dimension4_score) {
			returnObj = {
				animal: "coyote",
				animal_name: t('illustration.animal.coyote.name'),
				animal_icon: getImg('/static/web/dashboard/en/coyote.webp'),
				animal_name_bg: getImg('/static/web/resulten/animal-name-1.webp'),
				weakness: t('illustration.animal.coyote.weakness'),
				characteristics: t('illustration.animal.coyote.characteristics'),
			};
		} else if (maxScore === scores.dimension5_score) {
			returnObj = {
				animal: "capybara",
				animal_name: t('illustration.animal.capybara.name'),
				animal_icon: getImg('/static/web/dashboard/en/capybara.webp'),
				animal_name_bg: getImg('/static/web/resulten/animal-name-1.webp'),
				weakness: t('illustration.animal.capybara.weakness'),
				characteristics: t('illustration.animal.capybara.characteristics'),
			};
		}

		// Update store if it's provided
		if (store) {
			store.commit('setWeakness', returnObj.weakness);
			store.commit('setChar~ateristics', returnObj.characteristics);
		}
	}

	return returnObj;
}