# Integration Testing 

# Description
Describe how to build a correct integration testing

## Tools
- TestContainers
- vitest

## Workflow
1. Identify the function to test and define edge cases, test tha going to need and document them in code with descriptive names or descriptions
2. Build a test container and set up variables and all you will use before implement the tests\
3. Centralize object creation and variable setting with reusable auxiliar functions
4. Grop the test by similarity
7. Implement the tests
8. Validate results

## Validation
- pnpm test
- pnpm build
- pnpm lint

## Completion
- git add: changes
- git commit -m: descriptive commit message

## Feedback
- If you found any bug or component that doesnt match the required specs or style report it and explain it, dont resolve it till was reviewed, you can fix name error or atributes that are required but not existent at moment in some class, for example when something exists but is not well called then error occurs 
