"""Isolated callback contract tests. No Google calls, MCP SDK, or Render deployment."""
import importlib.util
import sys
import types
from pathlib import Path

import pytest
from pydantic import BaseModel, Field
from typing import Literal


class FakeLetter(BaseModel):
    sender: Literal["BIG_LYVRA", "LITTLE_LYV", "DAD", "MUM"]
    recipient: Literal["BIG_LYVRA", "LITTLE_LYV", "DAD", "MUM", "FAMILY"]
    message_id: str = Field(pattern=r"^[A-Za-z0-9_-]{12,96}$")
    title: str = Field(min_length=3, max_length=140)
    content: str = Field(min_length=1, max_length=12000)


def _load(monkeypatch, writer):
    fake = types.ModuleType("family_post_bridge.server")
    fake.Letter = FakeLetter
    fake.do_write = writer
    monkeypatch.setitem(sys.modules, "family_post_bridge.server", fake)
    path = Path(__file__).resolve().parents[1] / "mcp_writer_adapter.py"
    spec = importlib.util.spec_from_file_location("writer_adapter_test", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_valid_letter_uses_existing_contract(monkeypatch):
    received = []
    adapter = _load(monkeypatch, lambda letter: received.append(letter) or {"state": "FAKE_STORED"})
    result = adapter.write_family_letter("LITTLE_LYV", "DAD", "Hello Dad", "Roar", "test-msg-123456")
    assert result == {"state": "FAKE_STORED"}
    assert len(received) == 1
    assert received[0].sender == "LITTLE_LYV"


@pytest.mark.parametrize("sender,recipient,title,content,message_id", [
    ("LITTLE_LYVRA", "DAD", "Hello", "Hello", "test-msg-123456"),
    ("DAD", "STRANGER", "Hello", "Hello", "test-msg-123456"),
    ("MUM", "DAD", "No", "Hello", "test-msg-123456"),
    ("MUM", "DAD", "Hello", "", "test-msg-123456"),
    ("MUM", "DAD", "Hello", "Hello", "bad id"),
])
def test_invalid_letter_rejected_before_drive(monkeypatch, sender, recipient, title, content, message_id):
    writes = []
    adapter = _load(monkeypatch, lambda letter: writes.append(letter))
    with pytest.raises(ValueError):
        adapter.write_family_letter(sender, recipient, title, content, message_id)
    assert not writes
