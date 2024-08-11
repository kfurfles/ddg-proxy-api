import { env } from "@/config/env";
import { SearchApi, LastSearchesApi } from "@/types";
import { faker } from "@faker-js/faker";
import { subHours } from "date-fns";
const sleep = (timer = 2000) =>
	new Promise((res) => {
		setTimeout(() => {
			res(timer);
		}, timer);
	});
const now = new Date();

export async function mockLastSearches({
	offset,
}: LastSearchesApi["request"]): Promise<LastSearchesApi["response"]> {
	await sleep(2000);
	const TOTAL_PER_PAGE = 15;

	if (offset >= 100) {
		return {
			topics: [],
			meta: {
				offset: offset,
				next: false,
			},
		};
	}
	const lastTopics = new Array(TOTAL_PER_PAGE).fill(null).map((_, idx) => {
		return {
			id: `${subHours(now, offset + idx * 8).getTime()}`,
			title: `${faker.word.verb()} ${faker.lorem.lines(1)}`,
		};
	});

	return {
		topics: lastTopics,
		meta: {
			offset: TOTAL_PER_PAGE + offset,
			next: true,
		},
	};
}

export async function SearchApiService({
	text,
}: SearchApi["request"]): Promise<SearchApi["response"]> {
	return fetch(`${env.API}/search?text=${text}`).then((r) => r.json());
}

export async function LastSearchesApiService({ offset }: LastSearchesApi["request"]): Promise<LastSearchesApi["response"]> {
	return fetch(`${env.API}/search/history?offset=${offset}`).then((r) => r.json());
}