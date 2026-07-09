import {PostgreSqlContainer} from "@testcontainers/postgresql"
let container;

export async function StartDbContainer(){
    container = await new PostgreSqlContainer("postgres:17")
                    .withDatabase("test")
                    .withUsername("postgres")
                    .withPassword("postgres")
                    .start();

    return {
        dburi: container.getConnectionUri(), 
        container
    }
}    
