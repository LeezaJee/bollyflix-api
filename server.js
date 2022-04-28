//imports the HTTP, URL and File System Modules
const http = require("http"),
  fs = require("fs"),
  url = require("url");

//this function will be called every time an HTTP request is made against the server (request handler)
//.createServer is a function from the HTTP module, followed by another function
http
  .createServer((request, response) => {
    //addr variable contains a URL to parse
    //"request.url" though grabs the URL straight from the request object
    let addr = request.url,
      //parse() function is accessed through const url above
      q = url.parse(addr, true),
      //filePath is just acting as an empty container
      //pieces the file path together and places it in the empty variable in the if-else statement
      filePath = "";

    //appendFile() function takes three arguments
    fs.appendFile(
      "log.txt", //first argument: file name in which you want to append new information
      //information that's being appended: a log of the URL that was entered and the time that the request was made
      //new Date() function grabs the current time
      "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n", //second argument: new information to be appended
      //third argument: an error-handling function
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log.");
        }
      }
    );

    //"if" checks what the exact pathname of the entered URL is
    //q is where you stored the parsed URL from your user
    //(the pathname is the part that comes immediately after the first “/” in the URL)
    //includes() function is used to check whether the pathname of q (the URL) includes the word “documentation”
    if (q.pathname.includes("documentation")) {
      //if it does include "documentation", it pieces together "__dirname" and “/documentation.html”
      //adding them as a complete path name to the currently empty filePath variable
      //"__dirname" is a module-specific variable that provides the path to the current directory
      filePath = __dirname + "/documentation.html";
      //if pathname doesn't include “documentation”, the if-else statement returns “index.html” instead
      //(if user makes request to a URL that doesn't exist on your server, they'll be returned to your main page)
    } else {
      filePath = "index.html";
    }

    //readfile() function grabs the appropriate file from the server
    //first argument given to it is the filePath variable with the full pathname of the URL you just fetched and parsed
    fs.readFile(filePath, (err, data) => {
      //callback first checks if an error object has been defined
      //(only happens if readFile() experiences a problem locating or reading the “file.txt” file)
      // if error object has been defined, the function “throws” an exception
      //this throw err; immediately stops the execution of the current function (the statements after throw won't be executed)
      //and the program terminates.
      if (err) {
        throw err;
      }
      //tells the server to add a header to response along with HTTP code "200" for OK
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });
  })
  //server is set to listen() for requests on port 8080
  //port 80 is a standard for HTTP (otherwise it also can be any number above 1024)
  .listen(8080);
console.log("My test server is running on Port 8080.");

//http module is to set up the server
//url module is to grab and read a URL request sent by the user
//fs module is to send back the appropriate file
