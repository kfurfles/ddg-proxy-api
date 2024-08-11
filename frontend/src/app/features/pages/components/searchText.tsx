import { useSearchStore } from "@/store/search.store";
import { Fragment, useEffect, useMemo } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { HighlightedText, useHighlightCounter } from "@/components/ui/highlight-text";

export function SearchText({ content = "" }: { content?: string }) {
	const { find, AddOccurrences } = useSearchStore();
	const patternOccurrences = useDebounce(find, 300);
	const wordsToHighlight = patternOccurrences ? [patternOccurrences] : []
	const count = useHighlightCounter({
		text: content,
		wordsToHighlight
	})

	useEffect(() => {
		AddOccurrences(content, count)
	},[patternOccurrences])


	const highlightTextMemo = useMemo(() => {
		return (
			<HighlightedText
				text={content}
				render={(part) => <span  className="bg-yellow-300">{part}</span>}
				wordsToHighlight={wordsToHighlight}
			/>
		);
	}, [patternOccurrences]);


	return <Fragment>{highlightTextMemo}</Fragment>;
}
