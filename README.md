<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# API Documentation

  This repository contains the code for a simple API that validates movements and balances for a banking system. It is built using the [Nest](https://github.com/nestjs/nest) framework, written in TypeScript.

  
  ## API Endpoints

  - **Validate Movements**
    - **Endpoint**: `POST /movements/validation`
    - **Description**: Validates a list of movements and balances to ensure they are consistent with each other.
    - **Request Body Example**: 
    ```json
    {
      "movements": [
        {
          "id": 1,
          "date": "2024-01-15",
          "label": "Salary",
          "amount": 2000
        }
      ],
      "balances": [
        {
          "date": "2024-01-31",
          "expected_balance": 1900,
          "calculated_balance": 1800
        }
      ]
    }
    ```
    - **Responses**:
    - **200 OK**: Data successfully processed (validation succeeded or failed)
    - **444 Duplicate Transactions**: Duplicate Transactions Found
    - **400 Bad Request**: Bad request (malformed body)


  ## CI/CD and Deployment

  This project uses GitHub Actions for CI/CD and is deployed to [Railway](https://railway.app). Here are some useful links:

  - [Railway App Deployment](https://banking-validation-production.up.railway.app): This is the public URL where the application is deployed.
  - [Redoc Documentation](https://banking-validation-production.up.railway.app/documentation): Use this link to access the API documentation generated with Redoc.
  - [Swagger Documentation / Playground](https://banking-validation-production.up.railway.app/swagger): Explore the API using Swagger documentation and playground.


  ## Usage

  1. Clone the repository:

    ```bash
    $ git clone https://github.com/zt-ismael/banking-validation.git
    ```

  2. Install the dependencies:

    ```bash
    $ cd your-repo
    $ npm install
    ```

  3. Start the server:

    ```bash
    $ npm run start
    ```

    The server will be running on port 3000.

  4. Test the API:

    Use tools like Postman or cURL to send requests to the API endpoints.

  5. Compile and run the project:

    ```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
    ```

  6. Run tests:

    ```bash
    # unit tests
    $ npm run test

    # e2e tests
    $ npm run test:e2e

    # test coverage
    $ npm run test:cov
    ```

  ## Resources

  Here are some resources that may come in handy when working with this project:

  - Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
  - For questions and support, please visit the [NestJS Discord channel](https://discord.gg/G7Qnnhy).
  - To dive deeper and get more hands-on experience, check out the official [NestJS video courses](https://courses.nestjs.com/).
  - Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
  - Need help with your project (part-time to full-time)? Check out the official [NestJS enterprise support](https://enterprise.nestjs.com).
  - To stay in the loop and get updates, follow [NestJS on Twitter](https://twitter.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
  - Looking for a job, or have a job to offer? Check out the official [NestJS Jobs board](https://jobs.nestjs.com).

  ## Support

  Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

  ## Stay in touch

  - Author - [Ismaël ZAKARI TOURE](https://www.linkedin.com/in/isma%C3%ABl-zakari-toure)
  - Website - [https://nestjs.com](https://nestjs.com/)
  - Twitter - [@nestframework](https://twitter.com/nestframework)

  ## License

  This project is [MIT licensed](https://github.com/your-username/your-repo/blob/master/LICENSE).