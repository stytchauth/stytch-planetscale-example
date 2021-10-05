# Stytch + Planetscale Example App

This is a [Stytch](https://stytch.com) + [Planetscale](https://planetscale.com/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

In this repo, we have two sample auth flows:

- SDK integration: This flow uses Stytch's React component to create a login and signup flow using email magic links. Other libraries used include Stytch's node client library for authentication and with-iron-sessions for session management.
- API integration: This flow uses a custom UI with Stytch's backend API for SMS OTP authentication. Both Stytch's node client library and with-iron-session are also used.

# Getting Started

### Setting up Stytch
---
After signing up for Stytch, you'll need your project's ID, secret, and public token. You can find these in the [API keys tab](https://stytch.com/dashboard/api-keys).

Once you've gathered these values, add them to a new .env.local file.
Example:

```bash
cp .env.template .env.local
# Replace your keys in new .env.local file
```

Next, add `http://localhost:3000/api/authenticate_magic_link` as a login and signup magic link URL to the dashboard. Stytch, for security purposes, verifies your magic link URLs before they are sent. You can set these magic link URLs for your project in the [Magic link URLs tab](https://stytch.com/dashboard/magic-link-urls).

### Setting up Planetscale
---

## Setup database
- Install [Planetscale CLI](https://planetscale.com/cli)
- Authenticate the CLI
```sh
pscale auth login
```
- Create a new database (_skip this step if you already have a database_)
```sh
pscale database create <database>
```

- Retreive the following credentials from the planetscale dashboard and update your `.env.local` with the credentials
```bash
PLANETSCALE_TOKEN # The token which you create in the database settings page
PLANETSCALE_TOKEN_NAME # The id for the token
PLANETSCALE_ORG # The name of your organization (user)
PLANETSCALE_DB # The name of the database you would like to use
```

- Create a `development` branch
```sh
pscale branch create <database> <branch>
```
- Connect to your branch
```sh
pscale shell <database> <branch>
```
- Create the example user table
```sql
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email varchar(255) NOT NULL,
  name varchar(255)
);
```
- Create a **deploy request** 
```bash
pscale deploy-request create <database> <branch>
```
- _Deploy_ the **deploy request** 
```bash
pscale deploy-request deploy <database> <deploy-request-number>
```
- To find your `<deploy-request-number>`, simply run:
```bash
pscale deploy-request list <database>
```
- Merge your `development` branch into `main`
```bash
pscale deploy-request deploy <database> <deploy-request-number>
```

### Running the example app

Install dependencies by running

```bash
npm install
# or
yarn install
```

You can run a development server using:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Documentation

Learn more about some of Stytch's products used in this example app:

- [Stytch React](https://www.npmjs.com/package/@stytch/stytch-react)
- [Stytch's node client library](https://www.npmjs.com/package/stytch)
- [with-iron-session](https://github.com/vvo/next-iron-session)
