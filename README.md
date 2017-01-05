# [DEPRECATED] HMRC Prototype kit

## Which prototype kit should I use?

There has been some confusion and differing advice about which prototype kit should be used for designing services. To Clarify the starting point for all new services should be the [GOV.UK prototype kit](https://github.com/alphagov/govuk_prototype_kit). This means we can ensure consistency across HMRC services and the rest of government.

However, if you're already using the HMRC prototype kit to design a service, then you should continue to do so. 

If you have issues or would like to discuss this please do so in the [#community-prototype](https://hmrcdigital.slack.com/messages/community-prototype) channel.


## About the prototype kit

The prototype kit provides a simple way to make interactive prototypes that look like HMRC services on GOV.UK. These prototypes can be used to show ideas to people you work with, and to do user research.

Read the [project principles](docs/principles.md).

## How it differs from GOV.UK Prototype Kit

This prototype kit includes HMRC's [assets-frontend](https://github.com/hmrc/assets-frontend) instead of GOV.UK Elements. This is because HMRCs styles include GOV.UK's styles. they also extend them to include patterns specific to HMRC's needs that don't exist in GOV.UK's styles.

For building pages with this prototype kit, you should therefore refer to HMRC's [Component Library](http://hmrc.github.io/assets-frontend/).

This prototype kit is a fork of the [GOV.UK Prototype Kit](https://github.com/alphagov/govuk_prototype_kit) so that we can benefit from the updates made to that project. Currently it's updated manually when features become available in the GOV.UK Prototype Kit.

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
