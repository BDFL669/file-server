# 📁 Node.js HTTP File Server

This is a lightweight HTTP file server built using Node.js core modules. It allows you to upload, read, and delete files using standard HTTP methods (`GET`, `PUT`, `DELETE`). All file access is safely restricted to the working directory.

---

## 🚀 Features

- **GET** requests:
  - Stream file contents
  - List directory contents

- **PUT** requests:
  - Upload new files
  - Overwrite existing files

- **DELETE** requests:
  - Remove files or directories

- 🔒 Prevents access to files outside the base directory

---

## 🛠️ Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
Start the server:

```bash
node server.js
Open your browser or use curl to interact with the server:

arduino
Copy
Edit
http://localhost:8000/
💻 Usage Examples
bash
Copy
Edit
# Try to access a file that doesn't exist
$ curl http://localhost:8000/file.txt
File not found

# Upload a file with content
$ curl -X PUT -d CONTENT http://localhost:8000/file.txt

# Read the uploaded file
$ curl http://localhost:8000/file.txt
CONTENT

# Delete the file
$ curl -X DELETE http://localhost:8000/file.txt

# Confirm deletion
$ curl http://localhost:8000/file.txt
File not found
📦 Dependencies
Node.js (uses built-in modules only)

mime-types

🧠 How It Works
The server listens on port 8000.

It uses the URL path to resolve file system paths.

All file paths are sandboxed to the base directory (process.cwd()).

File operations are handled with async functions and stream piping.

📄 License
MIT License – Feel free to use, modify, and distribute.
