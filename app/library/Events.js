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
		
		for (var i=this.events[event].listeners.length - 1;i>=0;i--) {
			if (this.events[event].listeners[i].groupKey == groupKey) {
				console.log('A listener already exist for this event with the same groupkey: ' + groupKey + ' in event listener. This is usually because you use Events.addListener in the constructor instead of componentWillMount');
				console.log(this.events[event].listeners[i]);
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