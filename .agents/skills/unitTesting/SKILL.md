# Unit Testing

## Description
Unit testing skill

## Use 
Use when the user request for testing a specific class, object or function

## Architecture refresh
Remember that the architecture that are being followd is based in DDD with a separation by modules that are like the contexts, the main modules are shared, user and project, they contain inside more logic separated in modules to maintan independency in logic, the project always try to maintain dependency just from shared module or between modules in the same module, the project use interfaces to abstract external dependencies, the domain is just pure code, application contain abstractions of external services, api and providers are infra implementations.

## Test stack
- pnpm: package manager
- vitest: test library
- typescript: primary programing language
- OOP: paradigm style

## Instructions

1. Check the structure of the class, function or object that want to test
2. Check for dependencies from class, identify what are already imlemented and understand how they works, mock interfaces even when they have a concrete implementation, remember that tests also are independient
3. Dont re-build existent tests
4. Create the test files inside the tests directory and search the correct directory that corresponds to the module of the class that going to be test
5. Centralize the creation of objects with auxiliar functions inside test file, use mock or default values to dont rewrite the same logic or build the same object on each test
6. Begin testing creation of the entity or object, getters, setters, internals or more specific logic
7. Broke the test with edge cases, search for dont manages cases but according to existent logic
8. Test the test you just build
9. if theres some errors in tests structure fix it
10. if theres some errors in the class or entity youre testing ask first for review
11. You can use another commands but always the Needed command need to pass

## Needed Commands
- pnpm test
- pnpm build
- pnpm lint
