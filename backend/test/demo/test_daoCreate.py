import pytest
import json,os

from unittest.mock import Mock
from unittest.mock import patch
from pymongo.errors import WriteError

from src.util.dao import DAO


@pytest.fixture
def test_dao():
    dao = DAO(collection_name="test-users")
    yield dao
    dao.collection.delete_many({})

# 1. Valid data - Returns MongoDB document with _id
def test_create_valid_data(test_dao) :
    valid_dic = {
        "firstName": "Test",
        "lastName": "User",
        "email": "test.user@example.com"
    }
    result = test_dao.create(valid_dic)
    assert result["_id"] is not None
    assert result["firstName"] == "Test"
    assert result["lastName"] == "User"
    assert result["email"] == "test.user@example.com"


# 2. Invalid data :missing field - Raises WriteError
def test_create_invalid_data_missing_field(test_dao) :
    invalid_dic = {
        "firstName": "Test",
        "lastName": "User",
    }

    with pytest.raises(WriteError):
        test_dao.create(invalid_dic)


# 3. Invalid data: wrong type - Raises WriteError
def test_create_invalid_data_wrong_type(test_dao) :
    invalid_dic = {
        "firstName": 123,
        "lastName": "User",
        "email": "test.user@example.com"
    }

    with pytest.raises(WriteError):
        test_dao.create(invalid_dic)

# 4. Invalid data: duplicate value - Raises WriteError
def test_create_invalid_data_duplicate(test_dao) :
    valid_dic = {
        "firstName": "Test1",
        "lastName": "User",
        "email": "test1.user@example.com"
    }

    test_dao.create(valid_dic)

    duplicate_dic = {
    "firstName": "Test1",
    "lastName": "User",
    "email": "test1.user@example.com"
    }

    with pytest.raises(WriteError):
        test_dao.create(duplicate_dic)

