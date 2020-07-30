class EventEmitter {
	static events = {};
	
	/**
	*
	*/
	static addListener(event,listener,groupKey) {
		// console.log(listener + ' wants to listen to: ' + event);
		listener.groupKey = groupKey;
		if (!this.events[event]) {
			this.events[event] = {
				listeners: []
			}
		}
		this.events[event].listeners.push(listener);
	}
	/**
	*
	*/
	static getEventsInGroup(groupKey) {

	}
	/**
	*
	*/
	static removeListenersInGroup(groupKey) {
		for (var eventName in this.events) {
			for (var i=this.events[eventName].listeners.length - 1;i>=0;i--) {
				var listener = this.events[eventName].listeners[i];
				if (listener.groupKey === groupKey) {
					// console.log('Found10');
					// console.log(this.events[eventName].listeners[i]);
					this.events[eventName].listeners.splice(i,1);
				}
			}
		}
	}
	/**
	*
	*/
	static emit(name, ...payload) {
		if (this.events[name] && this.events[name].listeners) {
			for (const listener of this.events[name].listeners) {
				listener.apply(listener, payload)
			}
		}
	}
}
export default EventEmitter;