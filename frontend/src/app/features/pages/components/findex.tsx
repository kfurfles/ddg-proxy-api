import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/search.store";
import { Search } from "lucide-react";
import { useEffect } from "react";

export function Finder() {
	const { find, setFind, setOccurrences } = useSearchStore();

	useEffect(() => {
		setOccurrences(new Map());
	}, [find]);


	return (
		<div className="flex justify-end ml-auto w-full">
			<div className="flex items-center gap-2">
				<Search className="w-12 h-12" />
				<Input
					value={find ?? ""}
					placeholder="Procurar nas respostas"
					onChange={(e) => setFind(e.target.value)}
				/>
			</div>
		</div>
	);
}
