import LimitExceeded from "../../../../shared/core/errors/LimitExceeded";
import type Text from "../../../../shared/core/objects/Text";
import ListRules from "../constants/ListRules";

export default class ListTitle{
    private readonly value!: Text;

    constructor(value: Text){
        if(value.size() > ListRules.TITLE_LIMIT_SIZE){
            throw new LimitExceeded(`List title cannot be longer than ${ListRules.TITLE_LIMIT_SIZE} characters`);
        }
        this.value = value;
    }

    public getValue(): Text{
        return this.value;
    }
}
