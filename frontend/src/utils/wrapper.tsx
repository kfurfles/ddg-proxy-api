import { useSearch } from "@/app/features/hooks";

interface Props {
  count: number;
}

export function Wrapper({ count }: Props) {
  const { data, isError, isLoading } = useSearch({
    text: count > 4 ? `futebol` : "",
  });

  console.log({ data, isError, isLoading });

  return <div> Wrapper COmponent</div>;
}
