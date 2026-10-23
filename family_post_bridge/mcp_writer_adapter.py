"""Source-only MCP -> existing Family Post writer bridge.

Not mounted, imported, or deployed by the current Render application.
Always use the existing validated Letter contract and established Drive writer.
"""
def write_family_letter(sender: str, recipient: str, title: str, content: str, message_id: str) -> dict:
    # Import only on a real, authorized tool invocation, not during source tests.
    from family_post_bridge.server import Letter, do_write
    letter = Letter(
        sender=sender,
        recipient=recipient,
        title=title,
        content=content,
        message_id=message_id,
    )
    return do_write(letter)
