# Console-Frontend

The frontend component of the Hunt-Console project.

# Getting Started

The easiest way to get started is to [install Docker](https://docs.docker.com/get-docker/) and use the configured
[VSCode Devcontainer][devcontainers] for your development environment

Once your environment is setup, run the following:

```bash
yarn install
yarn run start # Starts the development server
```

[devcontainers]: https://code.visualstudio.com/docs/remote/containers

## Environment Variables

The following environment variables need to be set:

| Name  | Description |
| ---   |  ---        |
| REACT_APP_API_BASE_URL | The root URL of the API backend. |

Many of them are already set up in the development environment, see [.env.development](./.env.development).

# Heroku setup

We originally followed [this site](https://blog.heroku.com/deploying-react-with-zero-configuration) for how we deployed to Heroku.

Then we set the [necessary environment variables](#environment-variables)
