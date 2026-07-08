import { afterEach, describe, expect, it, vi } from "vitest";
import AuthenticateUser from "../../../../../src/modules/user/user/application/handlers/AuthenticateUser";
import type UserRepository from "../../../../../src/modules/user/user/core/repository/UserRepository";
import type { AuthProvider, identity } from "../../../../../src/modules/user/user/core/infrastructure/auth/AuthProvider";
import Logger from "../../../../../src/modules/shared/core/log/Logger";
import { LogLevel } from "../../../../../src/modules/shared/core/log/Log";
import ID from "../../../../../src/modules/shared/core/objects/ID";
import User from "../../../../../src/modules/user/user/core/model/User";
import Account from "../../../../../src/modules/user/account/core/model/Account";
import AuthenticationDto from "../../../../../src/modules/user/user/application/dtos/AuthenticationDto";

type AuthenticateUserDependencies = {
  handler: AuthenticateUser;
  repo: {
    existsUserByAccountId: ReturnType<typeof vi.fn>;
    createUserWithAccountAndDefaultUserSettings: ReturnType<typeof vi.fn>;
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
  const repo = {
    existsUserByAccountId: vi.fn(),
    createUserWithAccountAndDefaultUserSettings: vi.fn(),
  };

  const auth = {
    authenticate: vi.fn(),
  };

  const handler = new AuthenticateUser(
    repo as unknown as UserRepository,
    auth as unknown as AuthProvider
  );

  return { handler, repo, auth };
}

function createChronLog(): Logger {
  return new Logger(LogLevel.INFO, "127.0.0.1", "member-id", "POST", "/auth");
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
    const { handler, repo, auth } = createDependencies();
    const chronLog = createChronLog();
    const dto = createDto({ chronLog });

    auth.authenticate.mockResolvedValue(DEFAULT_AUTH_RESPONSE);
    repo.existsUserByAccountId.mockResolvedValue(
      User.fromPrimitives({
        id: "019df05a-8588-758c-b5e7-92af14bf85cf",
        accounts: [DEFAULT_AUTH_RESPONSE.accountId],
        primaryAccount: DEFAULT_AUTH_RESPONSE.accountId,
      })
    );

    const result = await handler.execute(dto);

    expect(result).toEqual({ created: false, token: DEFAULT_AUTH_RESPONSE.token });
    expect(auth.authenticate).toHaveBeenCalledWith(dto.code);
    expect(repo.existsUserByAccountId).toHaveBeenCalledWith(
      DEFAULT_AUTH_RESPONSE.accountId
    );
    expect(repo.createUserWithAccountAndDefaultUserSettings).not.toHaveBeenCalled();

    expect(chronLog.log.events).toHaveLength(3);
    expect(chronLog.log.events[0]).toMatchObject({
      type: LogLevel.INFO,
      message: "Starting user authentication",
    });
    expect(chronLog.log.events[1]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Auth provider call",
    });
    expect(chronLog.log.events[2]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Check if an user exists in database",
    });
    expect(typeof chronLog.log.events[1]?.duration).toBe("number");
    expect(typeof chronLog.log.events[2]?.duration).toBe("number");
  });

  it("creates user/account when the account does not exist and logs all creation steps", async () => {
    const generatedUserId = "019df05a-8588-758c-b5e7-92af14bf85cf";
    const { handler, repo, auth } = createDependencies();
    const chronLog = createChronLog();
    const dto = createDto({ chronLog });

    vi.spyOn(ID, "generateId").mockReturnValue(ID.fromString(generatedUserId));
    auth.authenticate.mockResolvedValue(DEFAULT_AUTH_RESPONSE);
    repo.existsUserByAccountId.mockResolvedValue(undefined);

    const result = await handler.execute(dto);

    expect(result).toEqual({ created: true, token: DEFAULT_AUTH_RESPONSE.token });
    expect(repo.createUserWithAccountAndDefaultUserSettings).toHaveBeenCalledOnce();

    const [createdUser, createdAccount] = repo.createUserWithAccountAndDefaultUserSettings.mock.calls[0] as [
      User,
      Account,
    ];

    expect(createdUser).toBeInstanceOf(User);
    expect(createdAccount).toBeInstanceOf(Account);
    expect(createdUser.getID().toString()).toBe(generatedUserId);
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

    expect(chronLog.log.events).toHaveLength(6);
    expect(chronLog.log.events[0]).toMatchObject({
      type: LogLevel.INFO,
      message: "Starting user authentication",
    });
    expect(chronLog.log.events[1]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Auth provider call",
    });
    expect(chronLog.log.events[2]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Check if an user exists in database",
    });
    expect(chronLog.log.events[3]).toMatchObject({
      type: LogLevel.INFO,
      message: `user created with id: ${generatedUserId}`,
    });
    expect(chronLog.log.events[4]).toMatchObject({
      type: LogLevel.INFO,
      message: `user account created with id: ${DEFAULT_AUTH_RESPONSE.accountId}`,
    });
    expect(chronLog.log.events[5]).toMatchObject({
      type: LogLevel.METRIC,
      message: "Save user and account data in database",
    });

    expect(typeof chronLog.log.events[1]?.duration).toBe("number");
    expect(typeof chronLog.log.events[2]?.duration).toBe("number");
    expect(typeof chronLog.log.events[5]?.duration).toBe("number");
  });
});
