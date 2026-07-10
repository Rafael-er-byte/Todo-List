import CoreError from "../errors/CoreError";
import type Logger from "../log/Logger";

export type MetricAction<T> = (logger: Logger) => Promise<T>;

export default class Metric{
    private metric!: number;

    start(): void{
       this.metric = performance.now(); 
    }

    end(): number{
        return performance.now() - this.metric;
    }

    async withMetric<T>(action: MetricAction<T>, msg:string ,logger: Logger): Promise<T>{
        let result: T;
        this.start();
        try {
            result = await action(logger);    
            logger.metric(msg, this.end());
        } catch (error) {
            if(error instanceof CoreError){
                logger.error(`${msg} (failed) with error: ${error.message}`, this.end(), error.info);
            }else if(error instanceof Error){
                logger.error(`${msg} (failed) with error: ${error.message} (Unknown)`, this.end());
            }
            
            throw error;
        }

        return result;
    }
}
