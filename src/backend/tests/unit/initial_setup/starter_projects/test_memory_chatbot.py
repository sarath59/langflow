from collections import deque

from langflow import components
from langflow.graph import Graph
from langflow.graph.graph.constants import Finish


def test_memory_chatbot():
    session_id = "test_session_id"
    template = """{context}

User: {user_message}
AI: """
    memory_component = components.helpers.MemoryComponent(_id="chat_memory")(session_id=session_id)
    chat_input = components.inputs.ChatInput(_id="chat_input")
    prompt_component = components.prompts.PromptComponent(_id="prompt")(
        template=template, user_message=chat_input.message_response, context=memory_component.retrieve_messages_as_text
    )
    openai_component = components.models.OpenAIModelComponent(_id="openai")(
        input_value=prompt_component.build_prompt, max_tokens=100, temperature=0.1
    )
    openai_component.get_output("text_output").value = "Mock response"
    chat_output = components.outputs.ChatOutput(_id="chat_output")(input_value=openai_component.text_response)

    graph = Graph(chat_input, chat_output)
    # Now we run step by step
    expected_order = deque(["chat_input", "chat_memory", "prompt", "openai", "chat_output"])
    for step in expected_order:
        result = graph.step()
        if isinstance(result, Finish):
            break
        assert step == result.vertex.id
