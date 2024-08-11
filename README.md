Here's a documentation guide you can use for your project README:

---

# Project Setup and Execution

This guide provides instructions for setting up and running the project using Docker and Makefile. This setup is designed to run in a Linux/Macos X environment. Before you start, ensure you have the following prerequisites installed:

## Prerequisites

- **Docker**: Ensure Docker is installed and running on your machine. You can follow the official [Docker installation guide](https://docs.docker.com/get-docker/) for your specific Linux distribution.
  
- **Make**: Make sure the Make utility is installed. On most Linux distributions, you can install it using your package manager. For example, on Ubuntu, you can run:

  Linux
  ```bash
  sudo apt-get install make
  ```

  Macos
  ```bash
  brew install make
  ```

  Windows
  ```bash
  choco install make
  ```

## Setup and Execution

### Running Backend Only

If you want to start only the backend service, execute:

```bash
make run-backend
```

This will start the backend service and its dependencies defined under the `app` profile in Docker Compose.

### Running Load Tests

To execute load tests, run:

```bash
make run-test-load
```

This command builds and starts the load test environment using Artillery and generates a report. After the test completes, it will open the HTML report located at `./artillery/report.html`.

### Running End-to-End Tests

For end-to-end tests, use the following command:

```bash
make run-test-e2e
```

This will navigate to the backend directory, install necessary dependencies, and run the end-to-end tests using the Vite testing setup. Once the tests are complete, it opens the coverage report at `./backend/coverage/index.html`.

### Running the Full Application

To run both the backend and frontend services, use:

```bash
make run-all
```

This command starts the backend service, installs frontend dependencies, and launches the frontend in development mode. The application will be accessible at `http://localhost:5173`.
npx open-clik