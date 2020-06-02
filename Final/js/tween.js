var tween = function (speed) {
	this.speed = speed;
	this.running = false;

	this.init = function (begin, end) {
		this.begin = begin;
		this.end = end;
		this.speed = speed;
		this.current = null
		this.time = 0;
		this.running = true

	}

	this.update = function (dt) {
		if (!this.running) return
		this.time += dt
		var begin = this.begin.clone()
		var end = this.end.clone()
		var ratio = this.time / (end.clone().sub(begin).length() / this.speed)
		this.current = begin.add(end.clone().sub(begin).multiplyScalar(ratio))

		if (ratio >= 1) {
			this.running = false;
			this.time = 0
		}
	}
}
export { tween }