Countdown
=========

This is the readme for "Countdown", a simple client-side
web application to give a dynamic countdown to a given
moment.

Things to do
------------

- Make it look nice
- Add support for friendly input text e.g. "lunchtime", "tomorrow"
- Add support for custom format string parameter for display?
- Add support for a couple of fixed display mode e.g. text | numeric
- Improve unit test coverage

Development
-----------

It's a hand crafted static site with no build process.

To build and run docker image locally: `./ops/local.sh`

Initial setup
-------------

**External network**

This docker service maps uses the special overlay network that other services can attach to in order to receive traffic, **`traefik-stack_traefik-net`**.

Deploy
-------

```sh
./ops/deploy.sh
```