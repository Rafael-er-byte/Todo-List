import type Transaction from "../../../../project/shared/repository/Transacction";
import type UserSettings from "../model/UserSettings";

export default interface UserSetingsRepository{
    createUserSettings(settings: UserSettings, tx?: Transaction): Promise<void>
}
