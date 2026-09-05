import { HTTPTypes } from "../types/HTTPTypes";
import {IpSchema} from "../schemas/Ip.schema"
import type HTTPRequest from "../interfaces/HTTPRequest";
import Logger from "../../../modules/shared/core/log/Logger";
import type { LogLevel } from "../../../modules/shared/core/log/Log";
import ConcreteLogger from "../../../infrastructure/logs/ConcreteLogger";

export default function BuildLogger(req: HTTPRequest, method: HTTPTypes): Logger{
    const {ip} = IpSchema.parse({
                                    ip: req.ip
                                });
    
    const logger = new ConcreteLogger(
            process.env.LOG_LEVEL as unknown as LogLevel, 
            ip as string,
            method,
            req.url,
        );

    return logger;
}
