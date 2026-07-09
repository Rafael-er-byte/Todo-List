import type { Request } from "express";
import type Logger from "../../../modules/shared/core/log/Logger";

export default interface HTTPRequest extends Request{
    logger?:Logger;
};
