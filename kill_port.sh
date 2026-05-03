#!/bin/bash

# Port to target
PORT=8081

echo "🔍 Searching for processes on port $PORT..."

# Find PIDs using the port
PIDS=$(lsof -t -i:$PORT)

if [ -z "$PIDS" ]; then
    echo "✅ Port $PORT is clear. No processes found."
else
    echo "⚠️ Found processes: $PIDS"
    echo "🛑 Terminating processes..."
    
    # Kill the processes
    # We use -9 (SIGKILL) to ensure they are removed immediately
    kill -9 $PIDS
    
    if [ $? -eq 0 ]; then
        echo "✨ Port $PORT has been successfully liberated."
    else
        echo "❌ Failed to terminate some processes. You may need sudo."
    fi
fi
