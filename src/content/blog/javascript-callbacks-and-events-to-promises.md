---
title: 'Converting JavaScript/TypeScript Callback-based APIs to Promise-based APIs: A Guide'
description: 'In the world of JavaScript development, callbacks and events have long been the standard way of handling asynchronous operations. However, with the introduction of Promises in ES6, developers now have a more elegant and efficient way of handling asynchronous operations. This blog post will explore the basics of Promises and how they can be used to replace callback-based APIs.'
date: 2023-01-14
updated: 2023-01-14
banner: /images/blog/callbacks-to-promises.jpg
bannerAlt: 'Converting Javascript/TypeScript callback-based APIs to Promise-based APIs'
bannerCredit: '<a href="https://www.freepik.com/free-photo/businessman-hand-holding-lightbulb-with-glowing-light-creative-smart-thinking-inspiration-innovation-with-network-concept_24755713.htm">Image by DilokaStudio</a> on Freepik'
---

# Reasoning

Not so long ago, I needed to make some pdf rendering on the server as a response to a request, so I resource to use PdfKit to do the job. After digging and poking around pdfkit, I realised that the output it produces is a pure readable Stream, so I would have to listen to the `end` event to make a buffer and only then send it to the client, so it would be kind of cumbersome to have everything written on the same function or to be passing around the response object around multiple functions to be able to answer through the callback. Also, the server endpoint would have no idea when it would fire back a response. So I conclude that it would be better to rewrite that pdf generation procedure as a Promise and return just the Buffer in memory once the procedure is completed. At the same time, the main function will have to `await` for the Buffer.

So, in this blog post, we will take a look at how you can convert callback-based and event-based APIs to promise-based APIs using three different examples.

## Example 1: A simple callback-based function

Let's walk through the simplest example of a setTimeout function in which we have access to the underlying code to make a foundation.

First, let's make the callback version of a function:

```
// function that requires a callback
// as a parameter in the nodejs style
function callbackVersion(cb: (error: Error | null, data?: string) => void) {
  // after 500ms this function will
  // either return an error or a data string
  setTimeout(() => {
    if (Math.random() > 0.5) {
      cb(null, "you are a lucky guy!");
    } else {
      cb(new Error("[ ERROR ] fatal error"));
    }
  }, 500);
}

// we call the function providing
// our own callback and handling the parameters
// in the nodejs style
callbackVersion((error, data) => {
  if (error) {
    console.error("we got an error: ", error);
  } else {
    console.log(data);
  }
});
```

As long as we have direct access to the underlying code, we can modify the function directly as follows:

```
// Promisified version
function promiseVersion() {
  // wrap the function body in a returning Promise
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        // call resolve whether is a success case
        resolve("you are a lucky guy!");
      } else {
        // call reject whether is an error case
        reject("[ ERROR ] fatal error");
      }
    }, 500);
  });
}

// consume the function as a regular
// promise (or use await with try/catch
// if you are inside of
// a module for more readability)
promiseVersion()
  .then((d) => console.log(d))
  .catch((e) => console.error(e));
```

Here, we wrap the function body in a returning new Promise in which we `resolve()` or `reject()` whether it is a success case or not.

## Example 2: Using the built-in util.promisify

The second example involves a utility function built in NodeJS that works only if the callback follows the NodeJS callback style (error first, value second). This utility function is called `promisify` and lives inside the `util` module. It allows to easily convert callback-based function to promise-based, and its syntax is as follows:

```
// we import the promisify function from node:util
import { promisify } from "util";

// the original function
function callbackVersion(cb: (error: Error | null, data?: string) => void) {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      cb(null, "you are a lucky guy!");
    } else {
      cb(new Error("[ ERROR ] fatal error"));
    }
  }, 500);
}

// using the promisify module
const promisifiedCallbackVersion = promisify(callbackVersion);

promisifiedCallbackVersion()
  .then((d) => console.log(d))
  .catch((e) => console.log(e));
```

As you can see, it simplifies the process a ton and makes it one of the preferred conversion methods as long as you know for sure that the callback pattern follows the NodeJS callback syntax.

## Example 3: Walking through the pdfkit event-based API

But what if, as I said in the reasoning section, you have to use a third-party library, so it doesn't allow you to modify the underlying code as long as you don't fork it or make your own library based on it, and it doesn't suit, at least in a simple way, the nodejs promisify pattern. Well, in this case, we can apply the knowledge we gather here to make a wrapper function that allows us to consume the library in a promise-like way.

Let's take a look at the code for a simple express server and a pdfkit function before the promisification (not a real word for sure):

```
// import statement for express and pdfkit
import express from "express";
import PDFDocument from "pdfkit";

const app = express();
const PORT = 3000;

// route to handle the request
app.get("/", (_req, res) => {
  renderPdf(res);
});

// server initialization
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// function for render a pdf as a stream
function renderPdf(res: express.Response) {
  const doc = new PDFDocument();
  // in this version of the function we
  // pipe the stream into the response
  // directly
  doc.pipe(res);
  doc.text("Hello World", 100, 100);
  doc.text("this is another sample text");

  doc.end();
}
```

Okay, this version works for sure, but let's say we want to use the output of the pdf in multiple things, like sending an email with the pdf and the response with the pdf but also modifying the response based on the output of the sendMail function. Then we should resort to the event-based API of pdfkit to convert the stream into a Buffer and passed with the response to another function:

```
function renderPdf(res: express.Response) {
  const doc = new PDFDocument();
  // we store the data inside a buffer this time
  const buffers: any = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(buffers);

    // let's pretend the sendMail function
    // its correctly implemented.
    // we should handle the res and the pdfBuffer
    // to the sendMail function
    sendMail(pdfBuffer, res);
  });

  doc.text("Hello World", 100, 100);
  doc.text("this is another sample text");

  doc.end();
}
```

Hopefully, you can see why this can become very cumbersome very quickly. Now, let's use the techniques of the others examples in this example:

```
// import statement for express and pdfkit
import express from "express";
import PDFDocument from "pdfkit";

const app = express();
const PORT = 3000;

// route to handle the request
app.get("/", async (_req, res) => {
  try {
    // now we should only await for the result
    const pdfBuffer = await renderPdf();

    // lets pretend now sendMail is async and well implemented
    await sendMail(pdfBuffer);

    // send the pdfBuffer
    res.send(pdfBuffer);
  } catch (e) {
    console.log(e);
    // usually not a good idea to directly send an error
    res.send(e);
  }
});

// server initialization
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// function for render a pdf, no need to include the res parameter
function renderPdf() {
  // we wrap the function body in a Promise and resolve it in the success case
  return new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument();
    const buffers: any = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      // we resolve on success
      resolve(pdfBuffer);
    });

    doc.text("Hello World", 100, 100);
    doc.text("this is another sample text");

    doc.end();
  });
}
```

Now, with this implementation, you can see how it's much more readable and allows you to quickly refactor the code.

## Conclusion

In conclusion, converting callback-based APIs to promise-based APIs can significantly improve the readability and maintainability of your code. The `util.promisify()` method and the manual approach are potent ways to easily convert callback-based APIs to promise-based APIs. Whether you're working with the file system, HTTP requests or databases, using promise-based APIs can make your code more organised and easy to understand. So next time you're working with callback-based APIs, consider converting them to promise-based APIs and enjoy the benefits of a more intuitive and maintainable codebase.
