import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Logger from "../../../../../../src/modules/shared/core/log/Logger";
import { LogLevel } from "../../../../../../src/modules/shared/core/log/Log";

class TestLogger extends Logger {
    save(): void {
        console.log(this.log);
    }
}

type LoggerArgs = {
    logLevel?: LogLevel;
    ip?: string;
    idUser?: string;
    method?: string;
    url?: string;
    requestKey?: string;
};

function createLogger(args: LoggerArgs = {}) {
    return new TestLogger(
        args.logLevel ?? LogLevel.METRIC,
        args.ip ?? "127.0.0.1",
        args.method ?? "GET",
        args.url ?? "/tasks",
        args.idUser ?? "user-1",
        args.requestKey,
    );
}

describe("Logger", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should create logger with expected base data", () => {
        vi.spyOn(performance, "now").mockReturnValue(100);

        const logger = createLogger({
            ip: "192.168.1.1",
            method: "POST",
            url: "/project/1",
            idUser: "user-123",
        });

        expect(logger.log.ip).toBe("192.168.1.1");
        expect(logger.log.idUser).toBe("user-123");
        expect(logger.log.method).toBe("POST");
        expect(logger.log.url).toBe("/project/1");
        expect(logger.log.date).toBeInstanceOf(Date);
        expect(logger.log.events).toEqual([]);
        expect(logger.start).toBe(100);
    });

    it("should include requestKey when provided", () => {
        const logger = createLogger({ requestKey: "req-1" });
        expect(logger.log.requestKey).toBe("req-1");
    });

    it("should keep requestKey undefined when not provided", () => {
        const logger = createLogger();
        expect(logger.log.requestKey).toBeUndefined();
    });

    it("should add info events only when log level allows it", () => {
        const allowed = createLogger({ logLevel: LogLevel.INFO });
        const blocked = createLogger({ logLevel: LogLevel.METRIC });

        allowed.info("info event", 15);
        blocked.info("blocked info", 10);

        expect(allowed.log.events).toHaveLength(1);
        expect(allowed.log.events[0]).toEqual({
            type: LogLevel.INFO,
            message: "info event",
            duration: 15,
        });
        expect(blocked.log.events).toHaveLength(0);
    });

    it("should add warn events only when log level allows it", () => {
        const allowed = createLogger({ logLevel: LogLevel.WARN });
        const blocked = createLogger({ logLevel: LogLevel.ERROR });

        allowed.warn("warn event");
        blocked.warn("blocked warn");

        expect(allowed.log.events).toHaveLength(1);
        expect(allowed.log.events[0]).toEqual({
            type: LogLevel.WARN,
            message: "warn event",
        });
        expect(blocked.log.events).toHaveLength(0);
    });

    it("should always add error events", () => {
        const logger = createLogger({ logLevel: LogLevel.ERROR });

        logger.error("failure", 32);

        expect(logger.log.events).toHaveLength(1);
        expect(logger.log.events[0]).toEqual({
            type: LogLevel.ERROR,
            message: "failure",
            duration: 32,
        });
    });

    it("should add metric events only when log level allows it", () => {
        const allowed = createLogger({ logLevel: LogLevel.METRIC });
        const blocked = createLogger({ logLevel: LogLevel.WARN });

        allowed.metric("metric event", 20);
        blocked.metric("blocked metric", 10);

        expect(allowed.log.events).toHaveLength(1);
        expect(allowed.log.events[0]).toEqual({
            type: LogLevel.METRIC,
            message: "metric event",
            duration: 20,
        });
        expect(blocked.log.events).toHaveLength(0);
    });

    it("should accumulate events in insertion order", () => {
        const logger = createLogger({ logLevel: LogLevel.INFO });

        logger.info("first");
        logger.metric("second", 5);
        logger.warn("third", 6);

        expect(logger.log.events.map((event) => event.message)).toEqual([
            "first",
            "second",
            "third",
        ]);
    });

    it("should allow empty message", () => {
        const logger = createLogger({ logLevel: LogLevel.INFO });

        logger.error("");

        expect(logger.log.events[0]).toEqual({
            type: LogLevel.ERROR,
            message: "",
        });
    });

    it("should set status and duration when finish is called", () => {
        vi.spyOn(performance, "now").mockReturnValueOnce(10).mockReturnValueOnce(45);
        const logger = createLogger();

        logger.finish(201);

        expect(logger.log.status).toBe(201);
        expect(logger.log.duration).toBe(35);
    });

    it("should overwrite status and duration on multiple finish calls", () => {
        vi.spyOn(performance, "now")
            .mockReturnValueOnce(10)
            .mockReturnValueOnce(50)
            .mockReturnValueOnce(80);
        const logger = createLogger();

        logger.finish(200);
        logger.finish(404);

        expect(logger.log.status).toBe(404);
        expect(logger.log.duration).toBe(70);
    });

    it("should print internal log", () => {
        const logger = createLogger();
        const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);

        logger.save();

        expect(consoleSpy).toHaveBeenCalledWith(logger.log);
    });
});
