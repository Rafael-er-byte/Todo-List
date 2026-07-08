import { Request } from "express";
import Logger from "../../../src/modules/shared/core/log/Logger";

export default interface HTTPRequest extends Request{
    logger?:Logger;
};
