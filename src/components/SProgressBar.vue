<template>
	<view class="container-sprogress">
		<canvas :id="canvasId" :canvas-id="canvasId" class="progress-canvas" @tap="handleCanvasTap"></canvas>
	</view>
</template>


<script>
	import { getImg } from '../scripts/constants';
	export default {
		props: {
			finishComponents: {
				type: Number,
				default: 2
			},
			totalComponents: {
				type: Number,
				default: 4
			},
			circleRadius: {
				type: Number,
				default: 90
			},
			circleDistance: {
				type: Number,
				default: 130
			},
			verticalOffset: {
				type: Number,
				default: 5
			},
			userId: {
				type: [String, Number],
				required: true
			},
			username: {
				type: String,
				required: true
			},
			homepageData: {
				type: Object,
				default: () => ({})
			},
			starRatings: {
				type: Array,
				default: () => [2, 2, 1, ]
			},
			levelNames: {
				type: Array,
			}, 
			isCompleteTask: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				canvasId: 'sProgress' + Math.random().toString(36).substr(2, 9),
				bezierPoints: [],
				endPoints: [],
				hexagons: [],
				canvasWidth: 0,
				canvasHeight: 0,
				yOffset: 10, // 新增：Y轴偏移量
				isFromMap: true,
				downImgNum:0,
				imgDic: {},
				getImg
			};
		},
		computed: {
			localLevelNames() {
				return this.levelNames || [
					this.$t('components.SProgressBar.unit1.name'),
					this.$t('components.SProgressBar.unit2.name'),
					this.$t('components.SProgressBar.unit3.name'),
				];
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: (res) => {
					this.canvasWidth = res.windowWidth; // 将Canvas宽度设置为窗口宽度
					this.canvasHeight = (this.circleRadius * 4 * (this.totalComponents + 1)) + this
						.verticalOffset * 2;
					this.calculateBezierPoints();
					this.loadimg();
				},
			});
		},
		updated() {
			this.drawSProgress();
		},
		methods: {
			loadimg(){
				const completedImages = [
					'/static/web/level1completed1.webp',
					'/static/web/level2completed.webp',
					'/static/web/level3completed.webp',
					//'/static/web/level4completed.webp',
					//'/static/web/level5completed.webp'
				];
				const incompleteImages = [
					'/static/web/level1incomplete.webp',
					'/static/web/level2incomplete1.webp',
					'/static/web/level3incomplete1.webp',
					//'/static/web/level4incomplete.webp',
					//'/static/web/level5incomplete.webp'
				];
				for(let i=0; i<completedImages.length; i++){
				  this.loadAndDrawImageWx(completedImages[i])
				}
				for(let i=0; i<incompleteImages.length; i++){
				  this.loadAndDrawImageWx(incompleteImages[i])
				  }
			},
			loadAndDrawImageWx(src) {
				const filePath = getImg(src);

				if (filePath.endsWith('.webp') || filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.gif')) {
					this.imgDic[src] = filePath;
					this.downImgNum++;
					if (this.downImgNum >= 6) {
					this.drawSProgress();
					}
				} else {
					uni.downloadFile({
				        url: getImg(src),
				        success: (res) => {
				          if (res.statusCode === 200) {
				            const imgPath = res.tempFilePath;
							// console.log(`index=${index} src=${src}`)
							  this.imgDic[src] = imgPath
							  this.downImgNum++
							  if (this.downImgNum >=6) {
								this.drawSProgress()
							  }
							// ctx.drawImage(imgPath,x, y, size, size);
							// this.drawPath(ctx,index,x, y,size,isCompleted)
							// ctx.draw();
				          } else {
				            console.error('Failed to download image '+src);
				          }
				        },
				        fail: (err) => {
				          console.error('Download image error: ', err);
				        }
				      });
				}
				
			},
			calculateBezierPoints() {
				const width = this.canvasWidth;
				const radius = this.circleRadius;
				const offset = this.verticalOffset;
				const steps = 100;

				this.bezierPoints = [];
				this.endPoints = [];

				// 初始化计算逻辑
				const initialPoints = [];
				const initX = width / 2;
				const initY = offset;
				initialPoints.push({
					x: initX,
					y: initY
				});
				for (let i = 0; i <= steps / 2; i++) {
					const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
					const x = initX + radius * Math.cos(angle) + this.circleDistance / 2;
					const y = radius + radius * Math.sin(angle) + offset;
					initialPoints.push({
						x,
						y
					});
				}
				this.bezierPoints.push(initialPoints);
				this.endPoints.push(initialPoints[initialPoints.length - 1]);

				for (let component = 0; component < this.totalComponents; component++) {
					const componentPoints = [];
					const baseY = component * 2 * radius;

					let endPoint;

					if (component % 2 === 0) {
						for (let i = steps / 2; i <= steps; i++) {
							const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
							const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
							const y = baseY + radius + radius * Math.sin(angle) + offset;
							componentPoints.push({
								x,
								y
							});
						}
						for (let i = 0; i <= steps / 2; i++) {
							const angle = Math.PI / 2 + (Math.PI * i) / steps;
							const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
							const y = baseY + 4 * radius - (radius + radius * Math.sin(angle)) + offset;
							componentPoints.push({
								x,
								y
							});
						}
						endPoint = componentPoints[componentPoints.length - 1];
					} else {
						for (let i = steps / 2; i <= steps; i++) {
							const angle = Math.PI / 2 + (Math.PI * i) / steps;
							const x = width / 2 + radius * Math.cos(angle) - this.circleDistance / 2;
							const y = baseY + 2 * radius - (radius + radius * Math.sin(angle)) + offset;
							componentPoints.push({
								x,
								y
							});
						}
						for (let i = 0; i <= steps / 2; i++) {
							const angle = (-Math.PI / 2) + (Math.PI * i) / steps;
							const x = width / 2 + radius * Math.cos(angle) + this.circleDistance / 2;
							const y = baseY + 2 * radius + radius + radius * Math.sin(angle) + offset;
							componentPoints.push({
								x,
								y
							});
						}
						endPoint = componentPoints[componentPoints.length - 1];
					}
					this.bezierPoints.push(componentPoints);
					this.endPoints.push(endPoint);
				}
			},
			numberToChineseCharacter(num) {
				const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
				if (num <= 10) {
					return chineseNumbers[num - 1];
				} else if (num < 20) {
					return '十' + (num % 10 === 0 ? '' : chineseNumbers[num % 10 - 1]);
				} else {
					return chineseNumbers[Math.floor(num / 10) - 1] + '十' + (num % 10 === 0 ? '' : chineseNumbers[num %
						10 - 1]);
				}
			},
			drawSProgress() {
				const ctx = uni.createCanvasContext(this.canvasId, this);
				const width = this.canvasWidth;
				const height = this.canvasHeight;
				const yOffset = this.yOffset;

				ctx.clearRect(0, 0, width, height);
				ctx.save();
				// Adjust the translate position if needed
				ctx.translate(0, 8); // Move the entire drawing down by 10 pixels

				// 绘制所有路径
				for (let i = 0; i < this.totalComponents; i++) {
					const points = this.bezierPoints[i];
					ctx.beginPath();
					ctx.lineCap = 'round'; // 设置线条端点为圆形

					// 调整起始点和结束点，使其略微缩短，以显示圆角效果
					const startPoint = points[0];
					const endPoint = points[points.length - 1];

					ctx.moveTo(startPoint.x, startPoint.y + yOffset);

					// 使用二次贝塞尔曲线来平滑连接点
					for (let j = 1; j < points.length - 1; j++) {
						const currentPoint = points[j];
						const nextPoint = points[j + 1];
						const midX = (currentPoint.x + nextPoint.x) / 2;
						const midY = (currentPoint.y + nextPoint.y) / 2;
						ctx.quadraticCurveTo(currentPoint.x, currentPoint.y + yOffset, midX, midY + yOffset);
					}

					ctx.lineTo(endPoint.x, endPoint.y + yOffset);

					// 修改这里：为完成和未完成的路径设置不同的线宽
					if (i < this.finishComponents) {
						ctx.lineWidth = 10; // 完成的路径保持 10 的宽度
						ctx.strokeStyle = '#EDFB8B';
						ctx.setLineDash([]); // 设置虚线样式
					} else {
						ctx.lineWidth = 8; // 未完成的路径设置为 6 的宽度
						ctx.strokeStyle = '#3B413B';
						const dashLength = 20; // 虚线的实线部分长度
						const gapLength = 20; // 虚线的空白部分长度
						ctx.setLineDash([dashLength, gapLength]); // 设置虚线样式
					}

					ctx.stroke();
					ctx.setLineDash([]); // 重置为实线，避免影响其他绘制

					// 在初始线的右边添加绿色线段
					if (i === 0) {
						const lineStartX = points[0].x - 20; // 文字右侧起始点
						const lineY = points[0].y + yOffset;

						// 绘制 "LEVEL 1" 文字
						ctx.font = 'bold 20px Arial';
						ctx.fillStyle = 'white';
						ctx.textAlign = 'right';
						ctx.textBaseline = 'middle';
						ctx.fillText('LEVEL', lineStartX - 20, lineY);
						
						ctx.font = 'bold 40px Arial';
						ctx.fillStyle = 'white';
						ctx.textAlign = 'right';
						ctx.textBaseline = 'middle';
						ctx.fillText('1', lineStartX + 8, lineY-5);

						// 绘制绿色线段
						ctx.beginPath();
						ctx.moveTo(lineStartX - 120, lineY);
						ctx.lineTo(lineStartX - 2600, lineY);
						ctx.lineWidth = 10;
						ctx.strokeStyle = '#EDFB8B'; // 绿色
						ctx.stroke();
					}

					// 恢复 LEVEL 2 的特殊标记
					if (i === 3) {
						const lineStartX = points[points.length / 2].x + 20; // Text left starting point
						const lineY = points[points.length / 2].y + yOffset;

						// Draw green line segment
						ctx.beginPath();
						ctx.moveTo(lineStartX - 10, lineY);
						ctx.lineTo(lineStartX + 100, lineY);
						ctx.lineWidth = 10;
						ctx.strokeStyle = '#2F2F38';
						ctx.stroke();

						// Draw logo
						const logoSize = 30; // Adjust size as needed
						const logoPath = getImg('/static/web/lock.webp'); // Replace with your logo path
						ctx.drawImage(logoPath, lineStartX - 15, lineY - logoSize / 1.7, logoSize, logoSize);

						// Draw "LEVEL 2" text
						ctx.font = 'bold 20px Arial';
						ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
						ctx.textAlign = 'left';
						ctx.textBaseline = 'middle';
						ctx.fillText('LEVEL 2', lineStartX + 20, lineY); // Adjust text position
					}
				}

				// 定义完成和未完成的图片路径数组
				const completedImages = [
					'/static/web/level1completed1.webp',
					'/static/web/level2completed.webp',
					'/static/web/level3completed.webp',
					//'/static/web/level4completed.webp',
					//'/static/web/level5completed.webp'
				];
				const incompleteImages = [
					'/static/web/level1incomplete.webp',
					'/static/web/level2incomplete1.webp',
					'/static/web/level3incomplete1.webp',
					//'/static/web/level4incomplete.webp',
					//'/static/web/level5incomplete.webp'
				];

				// 绘制所有端点、线段和图片
				for (let i = 0; i < this.totalComponents; i++) {
					const endPoint = this.endPoints[i];
					const isCompleted = i < this.finishComponents;

					// 绘制端点圆圈
					ctx.beginPath();
					ctx.arc(endPoint.x, endPoint.y + yOffset, 12, 0, 2 * Math.PI);
					ctx.fillStyle = isCompleted ? 'rgba(158, 228, 77, 1)' : 'rgba(158, 228, 77, 0.2)';
					// ctx.fillStyle = isCompleted ? 'rgba(16, 16, 16, 0.4)' : 'rgba(16, 16, 16, 0.4)';
					ctx.fill();
					ctx.lineWidth = 4;
					ctx.strokeStyle = isCompleted ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.2)';
					ctx.stroke();

					// 绘制短线段
					const lineLength1 = 32;
					ctx.beginPath();
					ctx.moveTo(endPoint.x, endPoint.y + yOffset);
					if (i % 2 === 0) {
						ctx.moveTo(endPoint.x - 0.3 * lineLength1, endPoint.y + yOffset);
					} else {
						ctx.moveTo(endPoint.x + 0.3 * lineLength1, endPoint.y + yOffset);
					}

					if (i % 2 === 0) {
						ctx.lineTo(endPoint.x - lineLength1, endPoint.y + yOffset);
					} else {
						ctx.lineTo(endPoint.x + lineLength1, endPoint.y + yOffset);
					}
					ctx.lineWidth = 4;
					ctx.strokeStyle = isCompleted ? '#9EE44D' : 'rgba(221, 221, 221, 0)';
					ctx.stroke();

					// 选择适当的图片路径
					const imagePath = isCompleted ?
						(completedImages[i] || '/static/default_completed.png') :
						(incompleteImages[i] || '/static/default_incomplete.png');

					const imageSize = 160;
					const lineLength = 100;
					const imageX = i % 2 === 0 ? endPoint.x - lineLength - imageSize / 2 : endPoint.x + lineLength -
						imageSize / 2;
					const imageY = endPoint.y - imageSize / 2 + yOffset;

					try {
						ctx.drawImage(this.imgDic[imagePath], imageX, imageY, imageSize, imageSize);
						// 只在激活（已完成）的关卡上添加红色实体六边形
						if (isCompleted) {
							this.hexagons[i] = {
								centerX: imageX + imageSize / 2,
								centerY: imageY + imageSize / 2,
								size: imageSize / 2
							};
						}
					} catch (error) {
						console.error(`Error drawing image for level ${i + 1}:`, error);
					}

					// 计算文本容器的宽度和位置
					const textContainerWidth = 140; // 调整此值以适应您的需求
					const textContainerX = i % 2 === 0 ?
						imageX + imageSize / 2 - textContainerWidth - 80 :
						imageX + imageSize / 2 + 80;
					const textContainerY = imageY + imageSize / 2.5;

					// 添加关卡文本背景
					ctx.save(); // 保存当前的绘图状态

					const padding = 10; // 文本周围的内边距
					const cornerRadius = 10; // 圆角半径

					// 计算背景的尺寸
					const textMetrics = ctx.measureText(`Unit${this.numberToChineseCharacter(i + 1)}`);
					const bgWidth = textMetrics.width + padding * 2;
					const bgHeight = 24; // 根据需要调整高度

					// 计算背景的位置
					const bgX = textContainerX + textContainerWidth / 2 - bgWidth / 2;
					const bgY = textContainerY - 15 - bgHeight / 1.5;

					// 绘制圆角矩形背景
					ctx.beginPath();
					ctx.moveTo(bgX + cornerRadius, bgY);
					ctx.lineTo(bgX + bgWidth - cornerRadius, bgY);
					ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + cornerRadius);
					ctx.lineTo(bgX + bgWidth, bgY + bgHeight - cornerRadius);
					ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - cornerRadius, bgY + bgHeight);
					ctx.lineTo(bgX + cornerRadius, bgY + bgHeight);
					ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - cornerRadius);
					ctx.lineTo(bgX, bgY + cornerRadius);
					ctx.quadraticCurveTo(bgX, bgY, bgX + cornerRadius, bgY);
					ctx.closePath();
					
					// ctx.strokeStyle = 'rgba(0, 0, 0)'; // 将 'your-border-color' 替换为你想要的颜色，例如 '#FF0000' 表示红色
					ctx.lineWidth = 0.001; // 可选：设置边线宽度
					ctx.stroke(); // 绘制边线

					// ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // 半透明黑色
					ctx.fillStyle = isCompleted ? '#232329' : '#2B2B34'; // 半透明黑色
					ctx.fill();

					// 添加关卡文本
					ctx.fill();
					ctx.font = '12px Arial';
					ctx.fillStyle = isCompleted ? 'white' : 'rgba(255, 255, 255, 0.3)'; // 未完成时设置30%透明度的白色
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle'; // 确保文本垂直居中
					// const levelText = `Unit${this.numberToChineseCharacter(i + 1)}`;
					const levelText = `${this.$t('components.SProgressBar.unit')} ${i + 1}`;
					ctx.fillText(levelText, textContainerX + textContainerWidth / 2, textContainerY - 18);

					ctx.restore(); // 恢复之前保存的绘图状态

					// 添加关卡名称
					ctx.font = 'bold 14px Arial';
					ctx.fillStyle = isCompleted ? 'white' : 'rgba(255, 255, 255, 0.3)'; // 或者您想要的其他颜色
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					const levelName = this.localLevelNames[i] || `Level ${i + 1}`;

					// 添加文本换行逻辑
					const maxWidth = textContainerWidth*1.1; // 留一些边距
					const words = levelName.split(' ');
					let line = '';
					const lines = [];

					for (let n = 0; n < words.length; n++) {
						const testLine = line + words[n] + ' ';
						const metrics = ctx.measureText(testLine);
						const testWidth = metrics.width;
						if (testWidth > maxWidth - 10 && n > 0) {
							lines.push(line);
							line = words[n] + ' ';
						} else {
							line = testLine;
						}
					}
					if (line.trim()) {
						lines.push(line.trim());
					}

					// 如果只有一行且超过最大宽度，强制分成两行
					if (lines.length === 1) {
						const words = lines[0].split(' ');
						const midPoint = Math.ceil(words.length / 2);
						lines[0] = words.slice(0, midPoint).join(' ');
						lines.push(words.slice(midPoint).join(' '));
					}

					// 绘制多行文本
					const lineHeight = 18;
					const totalHeight = lines.length * lineHeight;
					// let startY = textContainerY + 15 - (totalHeight / 2) + (lineHeight / 2);
					let startY = textContainerY + 10;

					lines.forEach((line, index) => {
						ctx.fillText(line.trim(), textContainerX + textContainerWidth / 2, startY + (index *
							lineHeight), maxWidth);
					});

					// 添加星级评分（为已完成的关卡显示，且星星数量大于0）
					if (isCompleted && this.starRatings[i] > 0) {
						const starSize = 30;
						const starSpacing = 5;
						const starContainerWidth = (starSize * 3) + (starSpacing * 2);
						const starContainerX = textContainerX + (textContainerWidth - starContainerWidth) / 2;
						const starContainerY = textContainerY + 45; // 调整这个值来控制星星与关卡名称的距离

						for (let j = 0; j < 3; j++) {
							const starX = starContainerX + (j * (starSize + starSpacing));
							const starY = starContainerY;
							const starPath = j < this.starRatings[i] ? '/static/dashboard2/star.png' :
								'/static/dashboard2/star-end.png';
							ctx.drawImage(starPath, starX, starY, starSize, starSize);
						}
					}
				}

				ctx.restore(); // Restore the original state
				ctx.draw(false, () => {
					console.log('Canvas drawing completed');
				});
			},
			navigateToBattlefieldIntro() {
				const jobId = this.homepageData?.response?.personal_info?.job_id;
				console.log('okok');
				uni.reLaunch({
					// url: `/pages/battlefield/battlefield-intro`
					url: this.isCompleteTask ?
						`/pages/battlefield/battlefield-summary?isFromMap=${this.isFromMap}` :
						`/pages/battlefield/battlefield-intro`
				});
			},
			// 新增方法：绘制六边形
			drawHexagon(ctx, centerX, centerY, size, rotationAngle = 0) {
				ctx.beginPath();
				for (let i = 0; i < 6; i++) {
					const angle = rotationAngle + (i * Math.PI) / 3;
					const x = centerX + size * Math.cos(angle);
					const y = centerY + size * Math.sin(angle);
					if (i === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
				}
				ctx.closePath();
				ctx.stroke();
			},
			handleCanvasTap(event) {
				const {
					x,
					y
				} = event.detail;

				uni.createSelectorQuery()
					.in(this)
					.select('#' + this.canvasId)
					.boundingClientRect((rect) => {
						// 调整点击坐标，考虑Canvas的位置和缩放
						const canvasX = x - rect.left;
						const canvasY = y - rect.top;

						// 考虑绘制时的平移（这里没有移）
						const adjustedX = canvasX; // 如果有ctx.translate，需要减去对应的值
						const adjustedY = canvasY; // 如果有ctx.translate，需要减去对应的值

						for (let i = 0; i < this.hexagons.length; i++) {
							const hexagon = this.hexagons[i];
							if (this.isPointInHexagon(adjustedX, adjustedY, hexagon.centerX, hexagon.centerY, hexagon
									.size)) {
								this.navigateToBattlefieldIntro();
								break;
							}
						}
					})
					.exec();
			},
			isPointInHexagon(x, y, centerX, centerY, size) {
				// 将坐标转换为相对于六边形中心的坐标
				const dx = x - centerX;
				const dy = y - centerY;
				// 计算六边形的外接圆半径
				const radius = size;
				// 判断点是否在六边形的外接圆内
				if (Math.sqrt(dx * dx + dy * dy) > radius) {
					return false;
				}
				// 进步判断点是否在六边形内
				const angle = Math.atan2(dy, dx);
				const sector = Math.floor((angle + Math.PI) / (Math.PI / 3));
				const distance = Math.abs(dx * Math.sin(sector * Math.PI / 3) - dy * Math.cos(sector * Math.PI / 3));
				return distance < radius * Math.sqrt(3) / 2;
			},
		}
	};
</script>



<style scoped>
	.container-sprogress {
		width: 100%;
		overflow-x: hidden;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-direction: column;
		background-color: #2F2F38;
		margin-right: 3rpx;
	}

	.progress-canvas {
		width: 100%;
		/* 将宽度设置为100% */
		height: 1100rpx;
		/* margin-top: 45rpx; */
		/* 移除transform属性 */
	}
</style>