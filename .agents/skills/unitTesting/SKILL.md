# Unit Testing

## Description
Unit testing skill

## Use 
Use when the user request for testing a specific class, object or function

## Architecture
Remember that the architecture that are being followed is based in DDD with a separation by modules that are like the contexts, the main modules are shared, user and project, they contain inside more logic separated in modules to maintan independency in logic, the project always try to maintain dependency just from shared module or between modules in the same module, the project use interfaces to abstract external dependencies, the domain is just pure code, application contain abstractions of external services, api and providers are infra implementations.

The application layer contains DTOs and handlers (use cases), they use dependency injection and depends on below layer, all services uses a single Log that represents all the life of the request with metrics, some interfaces have headers in methods that describe which Object error may throw when implement the interface, don test that, just get it

## Test stack
- pnpm: package manager
- vitest: test library
- typescript: primary programing language
- OOP: paradigm style

## Workflow

1. Ask for important test cases to implement and suggest some if have good ones
2. Check the structure of the class, function or object that want to test
3. Check for dependencies from class, identify what are already imlemented and understand how they works, mock interfaces even when they have a concrete implementation, remember that tests also are independient
4. Dont re-build existent tests
5. Make a plan to implement the tests correctly
6. Create the test files inside the tests directory and search the correct directory that corresponds to the module of the class that going to be test, if not exist then create it
7. Centralize the creation of objects with auxiliar functions inside test file, use mock or default values to dont rewrite the same logic or build the same object on each test
8. Begin testing creation of the entity or object, getters, setters, internals or more specific logic
9. Broke the test with edge cases, search for dont manages cases but according to existent logic
10. Test the test you just build
11. if theres some errors in tests structure fix it
12. if theres some errors in the class or entity youre testing ask first for review
13. You can use another commands but always the requiered commands below need to pass
14. If the tests are not working then replan and evaluate if the approach that you are following is the correct, replan maximum three times and if doesnt work ask for feedback and report what our think that is not working (human in the loop)

## Validation
- pnpm test
- pnpm build
- pnpm lint

## Completion
- git add: changes
- git commit -m: descriptive commit message

## Feedback
- If you found any bug or component that doesnt match the required specs or style report it and explain it, dont resolve it till was reviewed, you can fix name error or atributes that are required but not existent at moment in some class, for example when something exists but is not well called then error occurs 
