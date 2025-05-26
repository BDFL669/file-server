📁 Node.js HTTP File Server
This is a simple HTTP file server built using Node.js core modules. It supports basic file system operations via standard HTTP methods: GET, PUT, and DELETE.

🚀 Features
GET:

Reads files and streams their contents

Lists contents of directories

PUT:

Uploads new files or overwrites existing ones

DELETE:

Removes files or directories

Access restriction:

Files outside the base working directory are protected (403 Forbidden)

🛠️ Setup
Clone or download the project.

Run the server with:

bash
Copy
Edit
node server.js
Visit or interact with:

arduino
Copy
Edit
http://localhost:8000/
💻 Usage Examples
bash
Copy
Edit
# Try to read a non-existent file
$ curl http://localhost:8000/file.txt
File not found

# Upload a file with some content
$ curl -X PUT -d CONTENT http://localhost:8000/file.txt

# Read the newly created file
$ curl http://localhost:8000/file.txt
CONTENT

# Delete the file
$ curl -X DELETE http://localhost:8000/file.txt

# Confirm deletion
$ curl http://localhost:8000/file.txt
File not found
📦 Tech Stack
Node.js http, fs, path

mime-types for content-type detection

🔐 Security
Only files inside the base directory (process.cwd()) are accessible

Requests attempting to escape this directory are blocked with a 403 Forbidden status

📄 License
MIT (or specify your preferred license)
