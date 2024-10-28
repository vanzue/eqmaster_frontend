<script lang="uts">
	let firstBackTime = 0
	export default {
		onLaunch: function () {
			console.log('App Launch')
			const userId = uni.getStorageSync('userId');
			console.log('userId', userId)
			if (userId) {
				this.$store.commit('setUserId', userId);
				// this.$store.dispatch('fetchHomepageData');
				this.$store.dispatch('fetchHomepageData').then(() => {
					const homepageData = this.$store.getters.getHomepageData;
					// console.log(homepageData);
					if (homepageData.response && homepageData.response.eq_scores) {
						const currentPages = getCurrentPages();
						const currentRoute = currentPages.length > 0 ? currentPages[currentPages.length - 1].route : '';
						// console.log(currentRoute);
						if (currentRoute === 'pages/landing/landing' || currentRoute === '') {
							uni.navigateTo({
								url: `/pages/dashboard/dashboard_en?currentView=dashboard`
							});
						}
					}
				}).catch((error) => {
					console.error('Error fetching homepage data:', error);
				});
			}
			const username = uni.getStorageSync('username');
			if (username) {
				this.$store.commit('setUsername', username);
			}
			const jobId = uni.getStorageSync('jobId');
			if (jobId) {
				this.$store.commit('setJobId', jobId);
			}
		},
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		},
		// #ifdef APP-ANDROID
		onLastPageBackPress: function () {
			console.log('App LastPageBackPress')
			if (firstBackTime == 0) {
				uni.showToast({
					title: '再按一次退出应用',
					position: 'bottom',
				})
				firstBackTime = Date.now()
				setTimeout(() => {
					firstBackTime = 0
				}, 2000)
			} else if (Date.now() - firstBackTime < 2000) {
				firstBackTime = Date.now()
				uni.exit()
			}
		},
		// #endif
		onExit: function () {
			console.log('App Exit')
		},
	}
</script>

<style>
	/*每个页面公共css */
	.uni-row {
		flex-direction: row;
	}

	.uni-column {
		flex-direction: column;
	}

	body {
		margin: 0;
	}

	text,
	view {
		/* font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif; */
	}
</style>