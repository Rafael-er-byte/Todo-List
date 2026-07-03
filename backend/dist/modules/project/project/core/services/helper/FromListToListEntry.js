export default function FromListToListEntry(list) {
    return {
        idList: list.getID(),
        position: list.getPosition(),
        isArchived: list.isArchived()
    };
}
//# sourceMappingURL=FromListToListEntry.js.map