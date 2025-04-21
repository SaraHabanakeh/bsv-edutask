import pytest
from unittest.mock import Mock

from src.controllers.usercontroller import UserController

@pytest.fixture
def mock_dao():
    return Mock()

@pytest.fixture
def user_controller(mock_dao):
    return UserController(dao=mock_dao)

# 1. One user found
def test_valid_email_one_user(user_controller, mock_dao):
    user = {"email": "test@example.com", "name": "Test"}
    mock_dao.find.return_value = [user]

    result = user_controller.get_user_by_email("test@example.com")
    assert result == user

# 2. No user found
def test_valid_email_no_user(user_controller, mock_dao):
    mock_dao.find.return_value = []
    with pytest.raises(IndexError):
        user_controller.get_user_by_email("test@example.com")

# 3. Multiple users found
def test_valid_email_multiple_users(user_controller, mock_dao, capsys):
    user1 = {"email": "test@example.com", "name": "test1"}
    user2 = {"email": "test@example.com", "name": "test2"}

    mock_dao.find.return_value = [user1, user2]
    result = user_controller.get_user_by_email("test@example.com")
    

    assert result == user1

    captured = capsys.readouterr()
    assert f"Error: more than one user found with mail test@example.com" in captured.out

# 4. Invalid email format
@pytest.mark.parametrize("invalid_email", ["", "invalid", " "])
def test_get_user_by_email_invalid_format_raises(user_controller, invalid_email):
    with pytest.raises(ValueError):
        user_controller.get_user_by_email(invalid_email)

# 5. DB Error
def test_get_user_by_email_db_error(user_controller, mock_dao):
    mock_dao.find.side_effect = Exception("DB error")
    with pytest.raises(Exception):
        user_controller.get_user_by_email("user@example.com")
