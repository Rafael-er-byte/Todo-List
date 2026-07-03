import type List from "../../../list/core/model/List";
import type Project from "../model/Project";
import FromListToListEntry from "./helper/FromListToListEntry";

export default function ReorganizeAndValidateListExportBetweenProjects(from: Project, to: Project, list: List): void{
    const entry = FromListToListEntry(list);
    from.removeList(entry.idList);
    to.addList(entry);
}
