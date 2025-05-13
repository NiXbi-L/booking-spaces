import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://45.12.145.84:8000/api/"

# Тестовые данные
TEST_USER = {"username": "testuser", "password": "testpass123"}
SPACE_DATA = {"name": "Meeting Room", "description": "Main conference room"}
BOOKING_DATA = {
    "space": 1,
    "start_time": (datetime.now() + timedelta(hours=1)).isoformat(),
    "duration": 60,
    "description": "Team meeting"
}


def print_response(response):
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print("=" * 50)


def test_registration():
    print("Testing registration:")
    response = requests.post(f"{BASE_URL}auth/register/", data=TEST_USER)
    print_response(response)


def test_login():
    print("Testing login:")
    response = requests.post(f"{BASE_URL}auth/login/", data=TEST_USER)
    print_response(response)
    return response.json().get('token')


def test_create_booking(token):
    print("Testing booking creation:")
    headers = {"Authorization": f"Token {token}"}
    response = requests.post(
        f"{BASE_URL}bookings/",
        headers=headers,
        json=BOOKING_DATA
    )
    print_response(response)
    return response.json().get('id')


def test_get_space_bookings(space_id, date):
    print("Testing space bookings:")
    response = requests.get(
        f"{BASE_URL}spaces/{space_id}/bookings/?date={date}"
    )
    print_response(response)


def test_get_spaces():
    print("Testing space bookings:")
    response = requests.get(
        f"{BASE_URL}spaces/"
    )
    print_response(response)


def test_delete_booking(token, booking_id):
    print("Testing booking deletion:")
    headers = {"Authorization": f"Token {token}"}
    response = requests.delete(
        f"{BASE_URL}bookings/{booking_id}/",
        headers=headers
    )
    print_response(response)


def test_conflicting_booking(token):
    print("Testing conflicting booking:")
    headers = {"Authorization": f"Token {token}"}
    bad_data = BOOKING_DATA.copy()
    bad_data["start_time"] = (datetime.now() + timedelta(minutes=30)).isoformat()

    response = requests.post(
        f"{BASE_URL}bookings/",
        headers=headers,
        json=bad_data
    )
    print_response(response)


def test_unauthorized_access():
    print("Testing unauthorized access:")
    response = requests.post(f"{BASE_URL}bookings/", json=BOOKING_DATA)
    print_response(response)


if __name__ == "__main__":
    # Запуск тестов
    test_registration()
    token = test_login()
    # token = True

    if token:
        # booking_id = test_create_booking(token)
        # today = datetime.now().strftime("%Y-%m-%d")
        # test_get_space_bookings(1, today)
        # test_conflicting_booking(token)
        # test_delete_booking(token, booking_id)
        # test_unauthorized_access()
        test_get_spaces()
