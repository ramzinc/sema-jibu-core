/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import RNLanguages from 'react-native-languages';
import i18n from './i18n';
import React, {
	Component
} from 'react';

import {
	Provider
} from 'react-redux';
import store from './store';
import PosApp from '../components/PosApp';
import PosStorage from '../database/PosStorage';
import {
	isEmptyObj
} from '../services/Utilities';
export default class App extends Component {
	async componentWillMount() {
		bugsnag.notify(new Error("JUST TO SEE IF ONE CAN CUSTOMIZE THE OBJEC TO BE RETURNED THERE"));
		RNLanguages.addEventListener('change', this._onLanguagesChange);
		const savedSettings = await PosStorage.loadSettings();
		const uiLanguage = !isEmptyObj(savedSettings) && !isEmptyObj(savedSettings.uiLanguage) ?
			savedSettings.uiLanguage : {
				name: 'English',
				iso_code: 'en'
			}
		console.log(`Setting UI Language: ${JSON.stringify(uiLanguage)}`);
		i18n.locale = uiLanguage.iso_code;
	}

	componentWillUnmount() {
		RNLanguages.removeEventListener('change', this._onLanguagesChange);
	}

	_onLanguagesChange = ({
		language
	}) => {
		i18n.locale = language;
	};

	render() {
		return ( <
			Provider store = {
				store
			} >
			<PosApp / >
			</Provider>
		);
	}
}
