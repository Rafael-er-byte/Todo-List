import Metric from "../utils/Metric";
import type { DTO } from "./DTO";

export default abstract class Handler <TInput extends DTO, TOutput>{
    protected metric!: Metric;

    constructor(){
        this.metric = new Metric();
    }

    abstract execute(data: TInput): Promise<TOutput>;
}
