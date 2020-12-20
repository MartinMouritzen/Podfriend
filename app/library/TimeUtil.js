class TimeUtil {
	/**
	*
	*/
	static secondsToHms(d) {
		d = Number(d);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		
		return [h,m,s];
	}
	/**
	*
	*/
	static HmsToSeconds(hms) {
		var p = hms.split(':'),
        s = 0, m = 1;

		while (p.length > 0) {
			s += m * parseInt(p.pop(), 10);
			m *= 60;
		}

		return s;
	}
	/**
	*
	*/
	static formatPrettyDurationText(duration) {
		let [h,m,s] = TimeUtil.secondsToHms(duration);
		
		if (isNaN(h)) {
			h = 0;
		}
		if (isNaN(m)) {
			m = 0;
		}
		if (isNaN(s)) {
			s = 0;
		}
		
		var timeUnits = [];
		/*
		if (h > 0) {
			timeUnits.push(h + 'h');
		}
		if (m > 0) {
			timeUnits.push(m + 'm');
		}
		if (h <= 0 && m <= 0) {
			timeUnits.push(s + 's');
		}
		*/
		if (h > 0) {
			timeUnits.push(('' + h).padStart(2,'0'));
		}
		if (h > 0 || m > 0) {
			
		}
		timeUnits.push(('' + m).padStart(2,'0'));
		timeUnits.push(('' + s).padStart(2,'0'));
		return timeUnits.join(':');
	}
}
module.exports = TimeUtil;