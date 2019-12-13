### TinyApp Project - Pascal van Leeuwen

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

# Features
- Shortened URLs are associated to specific user accounts. 
- All passwords are securely hashed and all cookies are encrypted.
- Include analytics features to track page views, unique page views and timestampes of each visit.
- Utilizes the moment.js module to parse dates.

## Final Product

!["TinyApp saved URls Page"](https://github.com/Commoddity/tinyurl/blob/master/docs/tinyurl1.png)
!["TinyApp individual URL Page"](https://github.com/Commoddity/tinyurl/blob/master/docs/tinyurl4.png)
!["TinyApp Create New URL Page"](https://github.com/Commoddity/tinyurl/blob/master/docs/tinyurl3.png)

_(Screenshots were taken in [Google Chrome](https://www.google.com/chrome/) with the [Dark Reader](https://chrome.google.com/webstore/detail/dark-reader/eimadpbcbfnmbkopoojfekhnkhdbieeh?hl=en) add-on. Default apperance will differ.)_

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- method-override
- moment

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.