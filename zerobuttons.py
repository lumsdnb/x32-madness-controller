import RPi.GPIO as GPIO
import time
import requests
import json

# GPIO pin mappings
red_button = 3
red_led = 2
blue_button = 4
blue_led = 17

# State variables
prev_red = False
prev_blue = False
blue_led_state = False

current_group_index = 0
NUM_GROUPS = 4

# Network/API configuration
SERVER_HOST = "192.168.1.69"    # <-- replace with your server’s IP or hostname
SERVER_PORT = 3001               # matches your Node.js server port
API_BASE_PATH = f"/api"

# If your backend supports cycling with a “next” route:
SWITCH_NEXT_PATH = "/api/switch/next"
# Otherwise, if cycling by index, you need either:
# - a GET status endpoint to fetch current index, then compute next; or
# - to track index locally (less robust).

# Auto-switch status endpoint (optional, for initial state/read-back)
AUTO_SWITCH_STATUS_PATH = "/api/auto-switch/status"  # optional: adjust if implemented
AUTO_SWITCH_POST_PATH = "/api/auto-switch"

# Default interval if Pi must choose one:
DEFAULT_INTERVAL = 4  # e.g., 4 bars; adjust as needed

# Setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(red_button, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(blue_button, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(red_led, GPIO.OUT)
GPIO.setup(blue_led, GPIO.OUT)

blue_led_state = False
GPIO.output(blue_led, blue_led_state)

def read_button(pin):
    return GPIO.input(pin) == GPIO.LOW  # pressed

# Helper: send “next group” command
def send_next_group():
    try:
        # Compute next index locally
        global current_group_index
        next_index = (current_group_index + 1) % NUM_GROUPS
        url = f"http://{SERVER_HOST}:{SERVER_PORT}{API_BASE_PATH}/switch/{next_index}"
        resp = requests.post(url, timeout=2)
        if resp.status_code == 200:
            current_group_index = next_index
        else:
            print(f"Switch-group request failed ({next_index}): {resp.status_code}")
    except Exception as e:
        print(f"Error sending next-group: {e}")

# Helper: send toggle auto-switch. Needs new enabled state and interval.
def send_toggle_auto_switch(current_enabled, interval):
    try:
        new_enabled = not current_enabled
        url = f"http://{SERVER_HOST}:{SERVER_PORT}{API_BASE_PATH}/auto-switch"
        payload = {"enabled": new_enabled, "interval": interval}
        resp = requests.post(url, json=payload, timeout=2)
        if resp.status_code == 200:
            return new_enabled
        else:
            print(f"Auto-switch toggle failed: {resp.status_code}")
    except Exception as e:
        print(f"Error sending auto-switch toggle: {e}")
    return current_enabled  # on failure, keep old state

try:
    while True:
        current_red = read_button(red_button)
        current_blue = read_button(blue_button)

        # RED button: blink red LED twice
        if current_red and not prev_red:
            for _ in range(2):
                GPIO.output(red_led, GPIO.HIGH)
                time.sleep(0.1)
                GPIO.output(red_led, GPIO.LOW)
                time.sleep(0.1)
            print("Red button pressed → blink")
            send_next_group()
            print("Red pressed → blink + next group")
            send_next_group()
            print(f"Red pressed → next group {current_group_index}")


        # BLUE button: toggle blue LED
        if current_blue and not prev_blue:
            # Toggle local state
            prev_state = blue_led_state
            new_state = not prev_state
            # Send to backend with DEFAULT_INTERVAL
            result_state = send_toggle_auto_switch(current_enabled=prev_state, interval=DEFAULT_INTERVAL)
            blue_led_state = result_state
            GPIO.output(blue_led, blue_led_state)
            print(f"Blue pressed → auto-switch {'ON' if blue_led_state else 'OFF'}")
        prev_red = current_red
        prev_blue = current_blue
        time.sleep(0.01)  # debounce delay

except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()
