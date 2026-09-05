# Repository implementation

# Description
Describe how to implement a concrete repository using the defined interfaces

## Steps
1. Identify the correct interface for the repository to build
2. Use as example of implementations the user repository inside the user module
3. There is an function that abstracts part of code and manages errors, this is inside the infra layer and is named DbTryCatchWrapper
4. Determine if is needed to implement transactions to execute actions, there also exists an interface that represents an abstraction object, it is send it with the data to the repository and this indicates a transaction
5. After planning the implementation start building it inside a directory in the needed module in the infra layer of the module not the general layer
6. Use the skill /integrationTesting and implement correspondient tests to the implementation
7. Fix issues and save changes 