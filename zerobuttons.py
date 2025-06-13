import RPi.GPIO as GPIO
import time

# GPIO pin mappings
red_button = 3
red_led = 2
blue_button = 4
blue_led = 17

# State variables
prev_red = False
prev_blue = False
blue_led_state = False

# Setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(red_button, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(blue_button, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.setup(red_led, GPIO.OUT)
GPIO.setup(blue_led, GPIO.OUT)

def read_button(pin):
    return GPIO.input(pin) == GPIO.LOW  # pressed

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

        # BLUE button: toggle blue LED
        if current_blue and not prev_blue:
            blue_led_state = not blue_led_state
            GPIO.output(blue_led, blue_led_state)
            print(f"Blue button toggled {'ON' if blue_led_state else 'OFF'}")

        prev_red = current_red
        prev_blue = current_blue
        time.sleep(0.01)  # debounce delay

except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()
