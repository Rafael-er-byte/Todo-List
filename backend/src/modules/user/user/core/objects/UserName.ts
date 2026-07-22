import Text from "../../../../shared/core/objects/Text";
import ValueObject from "../../../../shared/core/objects/ValueObject";

export default class UserName extends ValueObject{
    private name!: Text;

    constructor(name: string){
        super();
        this.name = new Text(name);
    }

    public toString(): string{
        return this.name.getText();
    }
}
