#!/usr/bin/env python3
"""
Simple Flask starter script with improved startup performance
"""
import os
import sys
import threading
import time
from subprocess import Popen

# Set environment variables if needed
os.environ['FLASK_APP'] = 'app'
os.environ['PORT'] = '5000'

def start_flask():
    """Start Flask in a background process"""
    print("🚀 Starting Flask backend...")
    
    # Change to the backend directory
    os.chdir('backend')
    
    # Start the Flask app as a separate process
    process = Popen(['python', 'run.py'])
    
    # Return the process object so it can be monitored
    return process

def main():
    """Main entry point"""
    # Start Flask in the background
    flask_process = start_flask()
    
    # Keep script running until Flask exits
    try:
        while flask_process.poll() is None:
            time.sleep(1)
        
        # If we get here, Flask has exited
        print(f"⚠️ Flask exited with code {flask_process.returncode}")
        sys.exit(flask_process.returncode)
    
    except KeyboardInterrupt:
        print("👋 Shutting down Flask...")
        flask_process.terminate()
        sys.exit(0)

if __name__ == '__main__':
    main()