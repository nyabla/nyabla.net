---
layout: base.njk
title: fdate
---
## fdate

fdate is a command line utility written in rust that outputs the date according to the [french republican calendar](https://en.wikipedia.org/wiki/French_Republican_calendar) and the time in [decimal time](https://en.wikipedia.org/wiki/Decimal_time). It has formatting options closely resembling the date command.

It is available at [github.com/nyabla/fdate](https://github.com/nyabla/fdate)

My journey in implementing this was a rough one, with many false starts and a lot of research. I started with reading up on the calendar and deciding that I wanted to implement astronomical calculations by hand, with the help of Meeus's *Astronomical Algorithms*{% fn 'the 1991 edition of <i>Astronomical Algorithms</i> is available on the <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/">internet archive</a>' %},
which I very quickly came to regret.

With this insight I employed the help of the [astro crate](https://crates.io/crates/astro) but I just couldn't get it to spit out the correct numbers so I got back on the research grind. I managed to stumble across a general algorithm for converting between julian dates to arbitrary calendars and back{% fn '<i>Generalized Equations for Julian Day Numbers and Calendar Dates</i> (1985) by D. A. Hatcher is available online from the <a href="https://ui.adsabs.harvard.edu/abs/1985QJRAS..26..151H">astrophysics data system</a>' %}
This of led me on a search to find the coefficients for the french republican calendar which, surprisingly, existed{% fn '<i>Additif to \'Generalized Equations for Julian Day Numbers and Calendar Dates\'</i> (1986) by J. P. Parisot is also available online from the <a href="https://ui.adsabs.harvard.edu/abs/1986QJRAS..27Q.506P">astrophysics data system</a>' %}
so I was saved and could finish off my silly little project.

I did end up using good ol' Meeus for calculating the julian date and did some simple maths to convert the time into decimal time. Also I yoinked Don Knuth's roman numeral implementation from tex.web lol.

{% footnotes %}
