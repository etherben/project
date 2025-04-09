# Project Overview

This project consists of a **frontend React application** and a **backend Spring Boot application**. It also uses **MongoDB** as the database and provides Docker configurations for containerizing both the frontend and backend services.

## Prerequisites

Ensure the following tools are installed on your machine:

- **Docker**: Required to build and run the containers.
- **Docker Compose**: For managing multi-container Docker applications.

**Note**: The containers themselves will install Gradle and npm, so you do not need to install them locally.

## How to Run

1. Clone the repository to your local machine.
2. Ensure Docker is running on your machine.

### Steps to Launch:

Once built, there is no need to build again unless changes are made. 

1. Open a terminal and navigate to the folder containing the `docker-compose.yml` file.
   
2. To build the Docker images, run:

   ```bash
   docker-compose build

3. To run the containers, run:

    ```bash
    docker-compose up

4. To Stop the containers, run:

    ```bash
    docker-compose down

Or press ctrl + c in the command line

## Importing Mock Transactions:
There is a pre-made file named MockTransactions.csv that contains one years worth of mock transactions. This file can be imported into the application once it's running.

