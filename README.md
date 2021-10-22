# Stytch + Planetscale Example App

This is a [Stytch](https://stytch.com) + [Planetscale](https://planetscale.com/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This example app was created to demonstrate a lightweight fullstack user administration app using Planetscale's serverless MYSQL database and Stytch's authentication + session management APIs.

Stytch
---
<img src="./public/stytch.jpeg" alt="stytch" width="400"/>

> Onboard, authenticate, and engage your users with Stytch’s APIs. Improve security and user experience with flexible, passwordless authentication solutions.

Planetscale
---
<img src="./public/planetscale.jpeg" alt="planetscale" width="400"/>

> PlanetScale is the only serverless database platform you can start in seconds and scale indefinitely.


# Getting Started
---
## Setting up Stytch

After signing up for Stytch, you'll need your Project's `porject_id`, `secret`, and `public_token`. You can find these in the [API keys tab](https://stytch.com/dashboard/api-keys).

Once you've gathered these values, add them to a new .env.local file.
Example:

```bash
cp .env.template .env.local
# Replace your keys in new .env.local file
```

Next, add `http://localhost:3000/api/authenticate_magic_link` as a login and sign-up magic link URL to the [Stytch Dashboard](https://stytch.com/dashboard/redirect-urls). Stytch, for security purposes, verifies your magic link URLs before they are sent.

## Setting up Planetscale

###  Setup database
- Install [Planetscale CLI](https://docs.planetscale.com/reference/planetscale-environment-setup) and authenticate the CLI
```sh
pscale auth login
```
- Create a new database
```sh
pscale database create <database-name>
```

- Next you'll need to create a Planetscale service token to connect your local app to your database.
  - Go to the [Service tokens](https://app.planetscale.com/chris-stytch/settings/service-tokens) page in your Planetscale dashboard and click on **New service token**.
  - Give it a name and create it.
- Now you'll enter your service token details into your `.env.local` file.

```bash
PLANETSCALE_TOKEN # The service token that you created, starts with pscale_tkn
PLANETSCALE_TOKEN_ID # The id for the token, should look like ihk9lqudel8z
PLANETSCALE_ORG # This is your Planetscale organization name, i.e. the name you chose when you created your account
PLANETSCALE_DB # The name of your database, i.e. what you substituted above for <database_name>
```

- Now, create a `development` branch
```sh
pscale branch create <database-name> <branch-name>
```
- Connect to your branch
```sh
# This opens the planetscale mysql shell
pscale shell <database-name> <branch-name> 
```
- Create the user table
```sql
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255),
  email varchar(255) NOT NULL
);
```
- Create a **deploy request** 
```bash
# This is synonymous with opening a pull request
pscale deploy-request create <database-name> <branch-name> 
```
- Find the `<deploy-request-number>`
```bash
pscale deploy-request list <database-name>
```
- _Deploy_ the deploy request
  - The `<deploy-request-number>` will be a whole number, e.g. 1.
```bash
pscale deploy-request deploy <database-name> <deploy-request-number>
```

## Running the example app
---
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

Learn more about some of Stytch and Planetscale products used in this example app:

- [Stytch React](https://www.npmjs.com/package/@stytch/stytch-react)
- [Stytch's Node client library](https://www.npmjs.com/package/stytch)
- [Stytch Sessions](https://stytch.com/docs/sessions/using-sessions)
- [Planetscale CLI](https://planetscale.com/cli)
