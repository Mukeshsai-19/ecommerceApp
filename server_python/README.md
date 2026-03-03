# Python FastAPI Server

This is the Python version of your e-commerce seller API.

## Setup

1. **Navigate to this directory**:
   ```bash
   cd server_python
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

Run the server using `uvicorn`:
```bash
uvicorn main:app --reload --port 5000
```

Or run it directly as a script:
```bash
python main.py
```

## Features

- **FastAPI**: High-performance, type-safe API framework.
- **Motor**: Asynchronous MongoDB driver.
- **Pydantic v2**: Modern data validation and serialization.
- **JWT & bcrypt**: Secure authentication compatible with your existing frontend.
- **Auto-docs**: Visit `http://localhost:5000/docs` for the interactive API manual.
