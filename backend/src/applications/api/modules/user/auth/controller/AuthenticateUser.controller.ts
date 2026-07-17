import type Logger from "../../../../../../modules/shared/core/log/Logger";
import type AuthenticationDto from "../../../../../../modules/user/auth/application/dtos/AuthenticationDto";
import type AuthenticateUser from "../../../../../../modules/user/auth/application/handlers/AuthenticateUser";
import BuildLogger from "../../../../helpers/BuildLogger";
import type HTTPRequest from "../../../../interfaces/HTTPRequest";
import type { HTTPResponse } from "../../../../interfaces/HTTPResponse";
import type { NextInChain } from "../../../../interfaces/NextInChain";
import { HTTPTypes } from "../../../../types/HTTPTypes";
import { AuthenticateUserSchema } from "../schemas/AuthenticateUser.schema";

export default class AuthentiateUserController<DB> {
    constructor(private service: AuthenticateUser<DB>){
        this.run = this.run.bind(this);
    }

    async run(req: HTTPRequest, res: HTTPResponse, next: NextInChain): Promise<HTTPResponse>{
        let logger: Logger | undefined;
        let status: number = 200;
        let result;

        try {
            
            logger = BuildLogger(req, HTTPTypes.POST);

            const {body} = AuthenticateUserSchema.parse({
                body: req.body
            });

            const dto = {
                chronLog: logger,
                code: body.code,
                timezone: body.timezone
            } as AuthenticationDto;

            result = await this.service.execute(dto);

            if(result.created){
                logger.finish(201);
                status = 201;
            }else{
                logger.finish(200);
            }

            logger.save();
        } catch (error) {
            if(logger)req.logger = logger; 
            next(error);
        }

        return res.status(status).json({token: result?.token}).end();
    }
}
