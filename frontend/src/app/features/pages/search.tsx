/* eslint-disable react-hooks/rules-of-hooks */
import { Search, Loader2, Link } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useSearch } from "../hooks";
import type { SearchApi, SingleTopic } from "@/types";
import { useDeferredValue, useEffect, useState } from "react";
import { SearchText } from "./components/searchText";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchStore } from "@/store/search.store";

function TopicContent(props: SingleTopic & { variation?: "line" | "block" }) {
	const { text, img, url, variation = "line" } = props;

	if (variation === "line") {
		return (
			<Card className="flex items-center dark:bg-zinc-50">
				{img && (
					<img
						className="max-w-14 max-h-14 w-14 h-14 aspect-square"
						src={img}
					/>
				)}
				<CardContent className="p-4">
					<CardTitle className="dark:text-background">
						<a href={url} target="_blank">
							<SearchText content={text} />
						</a>
					</CardTitle>
				</CardContent>
				<div className="ml-auto">
					<a className="p-2 flex" href={url} target="_blank">
						<Link className="dark:text-background w-6 h-6" />
					</a>
				</div>
			</Card>
		);
	}

	return (
		<a href={url} target="_blank" className="grid">
			<Card className="dark:bg-zinc-50 grid overflow-hidden">
				<CardHeader className="p-0">
					<img
						className="aspect-square"
						src={img ?? "https://placehold.co/600x600?text=No%20Image"}
					/>
				</CardHeader>
				<CardContent className="p-4">
					<CardTitle className="text-base dark:text-background">
						<SearchText content={text} />
					</CardTitle>
				</CardContent>
			</Card>
		</a>
	);
}

type Content = SearchApi["response"]["topics"]["0"];
function SearchContent(props: Content) {
	const { type } = props;

	if (type === "TOPIC") {
		return <TopicContent {...props} />;
	}

	const { topics = [], subTopicName } = props;
	if (topics.length == 0) return null;

	return (
		<div>
			<div className="bg-zinc-400 h-[1px] mx-auto my-4"></div>
			<div className="text-left text-xl font-semibold">
				<span className="dark:text-zinc-50">
					<SearchText content={subTopicName} />
				</span>

				<Carousel className="mt-4">
					<CarouselContent>
						{topics.map((topic, idx) => {
							const key = `${topic.text}-${idx}`;
							return (
								<CarouselItem className="md:basis-1/2 lg:basis-1/3" key={key}>
									<div className="p-1 flex h-full">
										<TopicContent {...topic} key={key} variation="block" />
									</div>
								</CarouselItem>
							);
						})}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</div>
	);
}

export function SearchPage() {
	const [search, setSearch] = useState<string>("");
	const { mutate, data, isPending } = useSearch();
	const { mapOcc, find = '', lastSearch } = useSearchStore();

	function onSubmit() {
		if (search && search.length > 0) {
			mutate({ text: search.trim() });
		}
	}

	const debounced = useDebouncedCallback(() => {
		onSubmit();
	}, 500);

	const sum = Array.from(mapOcc.values()).reduce(
		(acc, cur) => acc + cur,
		0
	);

    const totalOccurrences = useDeferredValue(sum);

	const duration = data?.duration ?? 0;
	const topics = (data?.topics ?? []).sort((a) => (a.type === "TOPIC" ? -1 : 1))

	useEffect(() => {
		if(lastSearch){
			setSearch(lastSearch.title)
			mutate({ text: lastSearch.title.trim() });
		}
	},[lastSearch, mutate])

	if (isPending) {
		return (
			<div
				style={{ width: "min(800px, 90%)" }}
				className="mx-auto flex flex-col justify-center"
			>
				<Loader2 className="w-20 h-w-20 text-zinc-500 dark:text-zinc-50 mx-auto" />
			</div>
		);
	}

	const dontHasData = !!data && data.topics.length === 0
	
	return (
		<div style={{ width: "min(800px, 90%)" }} className="mx-auto flex flex-col">
            <form
				onSubmit={(e) => {
					e.preventDefault();
					debounced();
				}}
				className={`glass rounded-sm mx-auto py-2 px-4 w-full flex gap-2 items-center justify-center`}
			>
				<input
					disabled={isPending}
					value={search}
					placeholder="ex: Futsal"
					onChange={(e) => setSearch(e.target.value)}
					className="flex h-10 w-full outline-none bg-transparent px-3 py-2 text-lg resize-none"
				/>
				{isPending ? (
					<Loader2 className="w-8 h-w-8 text-zinc-500 dark:text-zinc-50" />
				) : (
					<Search className="w-8 h-w-8 text-zinc-500 dark:text-zinc-50" />
				)}
			</form>
			{data && (
				<div className="mr-auto mt-1 z-10 text-sm flex justify-between w-full">
					<div>
						Results in {duration / 1000} seconds
					</div>
					{ find && (<div className="text-base">
						Total Occurrencies: <b>{totalOccurrences}</b>
					</div>)}
				</div>
			)}

			{dontHasData && (
				<div className="flex justify-center my-12">
					No Results
				</div>
			)}

			<div className="mt-24 grid grid-cols-1 gap-6">
				{topics.map((topic) => {
					const key =
						topic.type === "AGGREGATED" ? topic.subTopicName : topic.text;
					return <SearchContent key={key} {...topic} />;
				})}
			</div>
		</div>
	);
}
