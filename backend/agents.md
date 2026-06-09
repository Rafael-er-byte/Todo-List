## Instructions

## Backend stack
- Typescript
- Redis
- Express
- Postgresql
- Vitest (Testing)
- S3 (Object storage)
- Auth provider (No specified)

## Architecture
- DDD with value objects, events, model, custom errors, types
- Modular separation to isolate entity logic like, notification, user, project ...
- Structured layer on each module: core, providers, application and api
- Event driven
- Distributed

## Specifications
- Dont use any in backend logic use unknown, use null instead of undefined
- Just follow instructions in prompt

## Domain specifications
- All entities extends from Entity abstract class (Check Entity structure)
- All the events extedns from DomainEvent (Check DomainEvent structure)
- Some repository methods uses the criteria pattern to abstract the filters
- Getters from repository uses pages and limits (just no when i specify)
- From primitives and to primitives are methods that export or import data from json to abstract logic and dont emmit events
- Factory method to build objects and emit events or apply logic, private constructors
- Shared module contain useful objects, errors and the primary entitties or classes to dont repeat logic and maintain the strucutre
- Softdelete instead of hard delete
- Versioning to avoid inconsitencies
- Uses uuid v7 to have better distribution, dont depend from database and dont use secuential ids that easily can de gessed
- Dont use try-catch inside domain
- Key from event is used as an indepotency key, is provided by client
- Params interfaces just uses primitives or definded types

## Limitations and invariants:
- 250 mb per attachment, the user just needs help attachments, doesn't need to save a gallery of photos or videos
- At least have to exist one admin per project
- A task or list just can be deleted when are archived
- A project just can be deleted when is closed
- Before deleting an account the user needs to be recently authenticated
- Allowed languages: EN/ES
- A due date can not be before start date
- A title cannot be bigger than 1000 characters
- Description does not have explicit limit
- Project settings are just modificable by admins
- CheckList name can not exceed 1000 characters
- Archive, delete and export lists automatically affects the tasks that the list contains on cascade
- If a list is unarchived will affect only the tasks that contains that were archived with the list
- If a task is exported maintain its history 
- Completed checklist percentage can not be negative or bigger than 100
- If a project is deleted when is being used by other they will lose access immediately. 
- Link visible text can not be bigger than 1000 characters
- CheckList item can not be bigger than 1000 characters
- Attachment name can not be bigger than 1000 characters
- Category name can not be bigger than 1000 characters
- Oncascade actions does not generate an event for each change, generate a global event that describes that was performed

## Allowed Attachments

**Documents:** `.pdf` `.doc` `.docx` `.txt` `.rtf`  
**Spreadsheets:** `.xls` `.xlsx` `.csv`  
**Presentations:** `.ppt` `.pptx`  
**Images:** `.jpg` `.jpeg` `.png` `.gif` `.webp`

## Roles:
- Admin: Manage all the project
- Member: Can create resources, comment or add member according to project config
- Auditor: Just can observe a project


