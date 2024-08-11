/* eslint-disable react-refresh/only-export-components */
import { Fragment, ReactNode } from "react";

interface Props {
	text: string;
	wordsToHighlight: string[];
	render?: (word: string) => ReactNode;
}

export function useHighlightCounter({
	text,
	wordsToHighlight,
}: Omit<Props, "render">) {
	const regex = new RegExp(`(${wordsToHighlight.join("|")})`, "ig");

	const parts = text.split(regex);

	return parts
		.reduce((acc, part) => {
			const isMatch = wordsToHighlight.some(
				(word) => word.toLowerCase() === part.toLowerCase()
			);

			return acc += isMatch ? 1 : 0
		},0)
}

export const HighlightedText = ({
	text,
	render = (word) => word,
	wordsToHighlight,
}: Props) => {
	const regex = new RegExp(`(${wordsToHighlight.join("|")})`, "ig");

	const parts = text.split(regex);

	return (
		<div>
			{parts.map((part, index) => {
				const isMatch = wordsToHighlight.some(
					(word) => word.toLowerCase() === part.toLowerCase()
				);

				return <Fragment key={index}>{isMatch ? render(part) : part}</Fragment>;
			})}
		</div>
	);
};
