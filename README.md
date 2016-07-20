# HMRC Prototype kit

## About the prototype kit

The prototype kit provides a simple way to make interactive prototypes that look like HMRC services on GOV.UK. These prototypes can be used to show ideas to people you work with, and to do user research.

Read the [project principles](docs/principles.md).

## How it differs from GOV.UK Prototype Kit

This project is a fork of [GOV.UK Prototype Kit](https://github.com/alphagov/govuk_prototype_kit) so that we can benefit from the updates made to that project.

The only difference is that it uses HMRC's [assets-frontend](https://github.com/hmrc/assets-frontend) instead of GOV.UK Elements as that's the library our frontends use in production.

## Security

If you publish your prototypes online, they **must** be protected by a [username and password](docs/guides/publishing-on-heroku.md). This is to prevent members of the public finding prototypes and thinking they are real services.

You must protect user privacy at all times, even when using prototypes. Prototypes made with the kit look like HMRC services, but do not have the same security provisions. Always make sure you are handling user data appropriately.

## Installation instructions

- [Installation guide for new users (non technical)](docs/install/introduction.md)
- [Installation guide for developers (technical)](docs/developer-install-instructions.md)

## Guides

1. [Setting up git](docs/guides/setting-up-git.md)
2. [Publishing on the web (Heroku)](docs/guides/publishing-on-heroku.md)
3. [Using GOV.UK Verify](docs/guides/using-verify.md)

## Other documentation

- [Prototype kit principles](docs/principles.md)
- [Making pages](docs/making-pages.md)
- [Writing CSS](docs/writing-css.md)
- [Updating the kit to the latest version](docs/updating-the-kit.md)
- [Tips and tricks](docs/tips-and-tricks.md)
- [Creating routes (server-side programming)](docs/creating-routes.md)

## Community

We have a Slack channel for this Prototype kit. You'll need a government email address to join them.

* [Slack channel for using and developing the HMRC prototype kit](https://hmrcdigital.slack.com/messages/prototype-kit/)

GDS also have some Slack channels for using and developing the underlying prototype kit engine.

* [Slack channel for users of the prototype kit](https://ukgovernmentdigital.slack.com/messages/prototype-kit/)
* [Slack channel for developers of the prototype kit](https://ukgovernmentdigital.slack.com/messages/prototype-kit-dev/)
