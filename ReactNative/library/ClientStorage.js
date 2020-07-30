import localForage from "localforage";
import { driverWithDefaultSerialization } from '@aveq-research/localforage-asyncstorage-driver';

class ClientStorage {
	/**
	*
	*/
	constructor() {
		this.__init();
		this.initialized = false;
	}
	/**
	*
	*/
	async __init() {
		const driver = driverWithDefaultSerialization();
		await localForage.defineDriver(driver);
		await localForage.setDriver(driver._driver);
		this.initialized = true;
	}
	/**
	*
	*/
	async setItem(key,value) {
		if (!this.initialized) { await this.__init(); }
		return localForage.setItem(key,value);
	}
	/**
	*
	*/
	async getItem(key) {
		if (!this.initialized) { await this.__init(); }
		return localForage.getItem(key);
	}
	/**
	*
	*/
	async removeItem(key) {
		if (!this.initialized) { await this.__init(); }
		return localForage.removeItem(key);
	}
	/**
	*
	*/
	async clear() {
		if (!this.initialized) { await this.__init(); }
		return localForage.clear();
	}
}

export default ClientStorage;