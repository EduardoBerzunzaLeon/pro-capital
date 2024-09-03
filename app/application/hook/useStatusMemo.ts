import { useMemo } from "react";
import { Key } from "~/components/ui/folder/FolderSection";

type Selection = 'all' | Set<Key>;

interface Props {
    selectedKeys: Selection
}

export const useStatusMemo = ({ selectedKeys }: Props) => {

    const selectedValue = useMemo(
        () => JSON.stringify(Array.from(selectedKeys).map(value => value === 'active')),
        [selectedKeys]
      );

    return selectedValue;
}

