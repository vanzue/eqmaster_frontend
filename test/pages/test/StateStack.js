export default class StateStack {
	constructor() {
		this.history = []; // 存储历史状态
		this.forwardStack = []; // 存储前进状态
	}

	// 推入新的状态
	push(state) {
		this.history.push(state);
		this.forwardStack = []; // 清空前进栈
	}

	// 回退到上一个状态
	back() {
		if (this.history.length > 1) {
			const state = this.history.pop();
			this.forwardStack.push(state); // 将当前状态推入前进栈
			return this.history[this.history.length - 1]; // 返回新的当前状态
		}
		return null; // 如果没有更多的状态可回退
	}

	// 前进到下一个状态
	forward() {
		if (this.forwardStack.length > 0) {
			const state = this.forwardStack.pop();
			this.history.push(state); // 将状态推入历史栈
			return state; // 返回新的当前状态
		}
		return null; // 如果没有更多的状态可前进
	}

	// 获取当前状态
	current() {
		return this.history[this.history.length - 1];
	}
}