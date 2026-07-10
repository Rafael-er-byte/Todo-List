import type Transaction from "../../../../shared/core/repository/Transacction";
import type UserSettings from "../model/UserSettings";

export default interface UserSetingsRepository{
    createUserSettings(settings: UserSettings, tx?: Transaction): Promise<void>
}
