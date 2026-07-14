import { afterEach, describe, expect, it, vi } from "vitest";
import AuthenticateUser from "../../../../../../src/modules/user/auth/application/handlers/AuthenticateUser";
import type UserRepository from "../../../../../../src/modules/user/user/core/repository/UserRepository";
import type AccountRepository from "../../../../../../src/modules/user/account/core/repository/AccountRespository";
import type UserSetingsRepository from "../../../../../../src/modules/user/userSettings/core/repository/UserSettingsRepository";
import type { AuthProvider, identity } from "../../../../../../src/modules/user/user/core/infrastructure/auth/AuthProvider";
import Logger from "../../../../../../src/modules/shared/core/log/Logger";
import { LogLevel } from "../../../../../../src/modules/shared/core/log/Log";
import ID from "../../../../../../src/modules/shared/core/objects/ID";
import User from "../../../../../../src/modules/user/user/core/model/User";
import Account from "../../../../../../src/modules/user/account/core/model/Account";
import AuthenticationDto from "../../../../../../src/modules/user/auth/application/dtos/AuthenticationDto";
import UserSettings from "../../../../../../src/modules/user/userSettings/core/model/UserSettings";
import type { Transaction } from "../../../../../../src/modules/shared/core/transaction/Transaction";

class TestLogger extends Logger {
  save(): void {
    console.log(this.log);
  }
}

type AuthenticateUserDependencies = {
  handler: AuthenticateUser;
  userRepo: {
    existsUserByAccountIdAndProvider: ReturnType<typeof vi.fn>;
    createUser: ReturnType<typeof vi.fn>;
  };
  accountRepo: {
    createAccount: ReturnType<typeof vi.fn>;
  };
  userSettingsRepo: {
    createUserSettings: ReturnType<typeof vi.fn>;
  };
  transaction: {
    withTransaction: ReturnType<typeof vi.fn>;
  };
  auth: {
    authenticate: ReturnType<typeof vi.fn>;
  };
};

const DEFAULT_AUTH_RESPONSE: identity = {
  token: "jwt-token",
  accountId: "019df05a-8588-758c-b5e7-92af14bf85c0",
  email: "john.doe@mail.com",
  name: "John Doe",
  provider: "google",
  profileImage: "https://cdn.mail.com/john.png",
};

function createDependencies(): AuthenticateUserDependencies {
  const userRepo = {
    existsUserByAccountIdAndProvider: vi.fn(),
    createUser: vi.fn(),
  };

  const accountRepo = {
    createAccount: vi.fn(),
  };

  const userSettingsRepo = {
    createUserSettings: vi.fn(),
  };

  const transaction = {
    withTransaction: vi.fn(),
  };

  const auth = {
    authenticate: vi.fn(),
  };

  transaction.withTransaction.mockImplementation(async (exec) => {
    return await exec(transaction as unknown as Transaction);
  });

  const handler = new AuthenticateUser(
    userRepo as unknown as UserRepository,
    accountRepo as unknown as AccountRepository,
    userSettingsRepo as unknown as UserSetingsRepository,
    transaction as unknown as Transaction,
    auth as unknown as AuthProvider
  );

  return { handler, userRepo, accountRepo, userSettingsRepo, transaction, auth };
}

function createChronLog(): Logger {
  return new TestLogger(LogLevel.INFO, "127.0.0.1", "POST", "/auth", "member-id");
}

function createDto(overrides: Partial<AuthenticationDto> = {}): AuthenticationDto {
  return {
    code: "valid-auth-code",
    timezone: "America/New_York",
    chronLog: createChronLog(),
    ...overrides,
  };
}

describe("AuthenticateUser", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns token for an existing user and does not create user/account", async () => {
    const { handler, userRepo, accountRepo, userSettingsRepo, transaction, auth } = createDependencies();
    const chronLog = createChronLog();
    const dto = createDto({ chronLog });

    auth.authenticate.mockResolvedValue(DEFAULT_AUTH_RESPONSE);
    userRepo.existsUserByAccountIdAndProvider.mockResolvedValue(
      User.fromPrimitives({
        id: "019df05a-8588-758c-b5e7-92af14bf85cf",
        accounts: [DEFAULT_AUTH_RESPONSE.accountId],
        primaryAccount: DEFAULT_AUTH_RESPONSE.accountId,
      })
    );

    const result = await handler.execute(dto);

    expect(result).toEqual({ created: false, token: DEFAULT_AUTH_RESPONSE.token });
    expect(auth.authenticate).toHaveBeenCalledWith(dto.code);
    expect(userRepo.existsUserByAccountIdAndProvider).toHaveBeenCalledWith(
      DEFAULT_AUTH_RESPONSE.accountId,
      DEFAULT_AUTH_RESPONSE.provider,
    );
    expect(transaction.withTransaction).toHaveBeenCalledOnce();
    expect(userRepo.createUser).not.toHaveBeenCalled();
    expect(accountRepo.createAccount).not.toHaveBeenCalled();
    expect(userSettingsRepo.createUserSettings).not.toHaveBeenCalled();

    expect(chronLog.log.events).toHaveLength(3);
    expect(chronLog.log.events[0]).toMatchObject({
      type: LogLevel.INFO,
      message: "Starting user authentication",
    });
    expect(chronLog.log.events[1]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Validate authentication code with provider",
    });
    expect(chronLog.log.events[2]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Check if an user already exists in database",
    });
    expect(typeof chronLog.log.events[1]?.duration).toBe("number");
    expect(typeof chronLog.log.events[2]?.duration).toBe("number");
  });

  it("creates user/account when the account does not exist and logs all creation steps", async () => {
    const generatedUserId = "019df05a-8588-758c-b5e7-92af14bf85cf";
    const generatedUserSettingsId = "019df05a-8588-758c-b5e7-92af14bf85d0";
    const { handler, userRepo, accountRepo, userSettingsRepo, transaction, auth } = createDependencies();
    const chronLog = createChronLog();
    const dto = createDto({ chronLog });

    vi.spyOn(ID, "generateId")
      .mockReturnValueOnce(ID.fromString(generatedUserId))
      .mockReturnValueOnce(ID.fromString(generatedUserSettingsId));
    auth.authenticate.mockResolvedValue(DEFAULT_AUTH_RESPONSE);
    userRepo.existsUserByAccountIdAndProvider.mockResolvedValue(undefined);

    const result = await handler.execute(dto);

    expect(result).toEqual({ created: true, token: DEFAULT_AUTH_RESPONSE.token });
    expect(transaction.withTransaction).toHaveBeenCalledOnce();
    expect(userRepo.createUser).toHaveBeenCalledOnce();
    expect(accountRepo.createAccount).toHaveBeenCalledOnce();
    expect(userSettingsRepo.createUserSettings).toHaveBeenCalledOnce();

    const [createdUser, userTx] = userRepo.createUser.mock.calls[0] as [User, Transaction];
    const [createdAccount, accountTx] = accountRepo.createAccount.mock.calls[0] as [Account, Transaction];
    const [createdSettings, settingsTx] = userSettingsRepo.createUserSettings.mock.calls[0] as [UserSettings, Transaction];

    expect(createdUser).toBeInstanceOf(User);
    expect(createdAccount).toBeInstanceOf(Account);
    expect(createdSettings).toBeInstanceOf(UserSettings);
    expect(userTx).toBe(transaction as unknown as Transaction);
    expect(accountTx).toBe(transaction as unknown as Transaction);
    expect(settingsTx).toBe(transaction as unknown as Transaction);
    expect(createdUser.getId().toString()).toBe(generatedUserId);
    expect(createdUser.getAccounts()).toHaveLength(0);
    expect(createdAccount.toPrimitives()).toMatchObject({
      id: DEFAULT_AUTH_RESPONSE.accountId,
      email: DEFAULT_AUTH_RESPONSE.email,
      isPrimary: true,
      name: DEFAULT_AUTH_RESPONSE.name,
      provider: DEFAULT_AUTH_RESPONSE.provider,
      profileImage: DEFAULT_AUTH_RESPONSE.profileImage,
      userId: generatedUserId,
    });
    expect(createdSettings.toPrimitives()).toMatchObject({
      id: generatedUserSettingsId,
      userId: generatedUserId,
      timezone: dto.timezone,
    });

    expect(chronLog.log.events).toHaveLength(9);
    expect(chronLog.log.events[0]).toMatchObject({
      type: LogLevel.INFO,
      message: "Starting user authentication",
    });
    expect(chronLog.log.events[1]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Validate authentication code with provider",
    });
    expect(chronLog.log.events[2]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Check if an user already exists in database",
    });
    expect(chronLog.log.events[3]).toMatchObject({
      type: LogLevel.INFO,
      message: `User created with id: ${generatedUserId}`,
    });
    expect(chronLog.log.events[4]).toMatchObject({
      type: LogLevel.INFO,
      message: `User account created with id: ${DEFAULT_AUTH_RESPONSE.accountId}`,
    });
    expect(chronLog.log.events[5]).toMatchObject({
      type: LogLevel.INFO,
      message: `User settings created with id: ${generatedUserSettingsId}`,
    });
    expect(chronLog.log.events[6]).toMatchObject({
      type: LogLevel.METRIC,
      message: "User creation in database",
    });
    expect(chronLog.log.events[7]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Account saved in database",
    });
    expect(chronLog.log.events[8]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Save user settings in database",
    });

    expect(typeof chronLog.log.events[1]?.duration).toBe("number");
    expect(typeof chronLog.log.events[2]?.duration).toBe("number");
    expect(typeof chronLog.log.events[6]?.duration).toBe("number");
    expect(typeof chronLog.log.events[7]?.duration).toBe("number");
    expect(typeof chronLog.log.events[8]?.duration).toBe("number");
  });

  it("creates account with null profile image when provider response has no image", async () => {
    const generatedUserId = "019df05a-8588-758c-b5e7-92af14bf85cf";
    const generatedUserSettingsId = "019df05a-8588-758c-b5e7-92af14bf85d0";
    const { handler, userRepo, accountRepo, auth } = createDependencies();

    vi.spyOn(ID, "generateId")
      .mockReturnValueOnce(ID.fromString(generatedUserId))
      .mockReturnValueOnce(ID.fromString(generatedUserSettingsId));
    auth.authenticate.mockResolvedValue({
      ...DEFAULT_AUTH_RESPONSE,
      profileImage: undefined,
    });
    userRepo.existsUserByAccountIdAndProvider.mockResolvedValue(undefined);

    await handler.execute(createDto());

    expect(accountRepo.createAccount).toHaveBeenCalledOnce();
    const [createdAccount] = accountRepo.createAccount.mock.calls[0] as [Account, Transaction];
    expect(createdAccount.toPrimitives().profileImage).toBeNull();
  });
});
