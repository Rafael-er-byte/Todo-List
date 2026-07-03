import FromListToListEntry from "./helper/FromListToListEntry";
export default function ReorganizeAndValidateListExportBetweenProjects(from, to, list) {
    const entry = FromListToListEntry(list);
    from.removeList(entry.idList);
    to.addList(entry);
}
//# sourceMappingURL=ReorganizeAndValidateListExportBetweenProjects.js.map