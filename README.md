# Template for Hono + Drizzle + Better Auth + Cloudflare API

This is a template for building a Cloudflare Worker API using Hono, Drizzle, and Better Auth. It provides a starting point for creating a secure and efficient API with authentication and database integration.

## Is based on the following stack:

- [Hono](https://hono.dev/) - A small, simple, and fast web framework for Cloudflare Workers.
- [Drizzle](https://orm.drizzle.team/) - A TypeScript ORM for SQL databases.
- [Better Auth](https://better-auth.com/) - An authentication library.
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) - A serverless platform for building and deploying applications.
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/) - A key-value storage solution for Cloudflare Workers.
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - A storage solution for Cloudflare Workers.
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - A serverless SQL database for Cloudflare Workers.
- [better-auth-cloudflare](https://github.com/zpg6/better-auth-cloudflare) - A Cloudflare adapter for Better Auth.

## Requirements

To get started with this template, you need to have Node.js LTS installed and bun. You can install bun from [bun.sh](https://bun.sh/).
And install node.js thro NVM form [nvm-sh/nvm](https://github.com/nvm-sh/nvm).

## Note

This template will be tuned over time to make it easier to build an api for your project. If you have any suggestions or feedback, please feel free to open an issue or submit a pull request.

## TODO list

- [ ] Implement email wrapper for sending emails so you can use any email service you want.
- [ ] Implement email templates for better email experience.
- [ ] Implement openapi documentation for the api.

- [ ] Set up websocket support for real-time communication.

- [ ] Add better documentation and examples for using the template.
- [ ] Add examples for using it with expo.
