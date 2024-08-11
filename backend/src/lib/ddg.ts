import axios from 'axios';

export function getDDGTopics(text: string) {
	return axios.get(`https://api.duckduckgo.com/?q=${text}&format=json`);
}
