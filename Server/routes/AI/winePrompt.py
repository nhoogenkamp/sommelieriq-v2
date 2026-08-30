import os
import json
from openai import OpenAI
from pydantic import BaseModel, field_validator
from routes.AI.prompt import WINE_SYSTEM_PROMPT

# https://www.geeksforgeeks.org/python/introduction-to-python-pydantic-library/
# validating values for JSON 
class WineProfile(BaseModel):
    row_id: int
    description: str
    body_score: int
    tannin_score: int
    acidity_score: int
    sweetness_score: int

    @field_validator("row_id")
    def check_row_id(cls, value):
        if value < 1:
            raise ValueError("Row ID must be greater than 0")
        return value
    
    @field_validator("body_score","tannin_score", "acidity_score", "sweetness_score")
    def check_score(cls, value):
        if value < 0 or value > 20:
            raise ValueError("Wine scores must be between 0 and 20")
        return value
    
    @field_validator("description")
    def check_description(cls, value):
        if not value.strip():
            raise ValueError("Description cannot be empty")
        return value

# Inherits from BaseModel and defines the expected structure of the AI response. "wines" must be a list of WineProfile objects.
class WineProfileResponse(BaseModel):
    wines: list[WineProfile]

# https://build.nvidia.com/nvidia/nemotron-3-super-120b-a12b?nim=self-hosted
client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY")
)

# This function receives the wines prepared by uploadWinesAI.py.
def generate_wine_profiles(wines):

    # Convert Python list to JSON text before sending to NVIDIA.
    # https://www.geeksforgeeks.org/python/convert-python-list-to-json/
    wine_data = json.dumps(wines)


    completion = client.chat.completions.create(
        model="nvidia/nemotron-3-super-120b-a12b",

        # for multiple messages from a system and user: https://docs.nvidia.com/nim/large-language-models/2.0.10/get-started/advanced/get-started-nemotron-3.5-lightning.html#:~:text=%3A%20null%0A%7D-,Hold%20a%20Multi%2DTurn%20Conversation,-%23
        messages=[
            {"role": "system", "content": WINE_SYSTEM_PROMPT},
            {"role": "user",  "content": wine_data}
        ],

        # structured JSON output: https://docs.nvidia.com/nim/large-language-models/2.0.10/get-started/advanced/get-started-nemotron-3.5-lightning.html#:~:text=For-,structured,-%2Doutput%20use%20cases%2C%20request
        response_format={"type": "json_object"},
        # most accurate outputs become factual, precise, predictable, and repetitive.
        temperature=0.0,
        max_tokens=2500,

        extra_body={
            "chat_template_kwargs": {"enable_thinking": False}
        },

        stream=False
    )
    # https://docs.nvidia.com/nim/large-language-models/2.0.10/get-started/advanced/get-started-nemotron-3.5-lightning.html#:~:text=You%20can%20direct%20the%20OpenAI%20Python%20SDK%20at%20the%20NIM%20endpoint%20by%20setting%20base_url%20to%20the%20local%20/v1%20API%20path%20and%20providing%20any%20non%2Dempty%20API%20key%3A
    result = completion.choices[0].message.content
    print("Raw NVIDIA response:")
    print(result)

    validated_profile = WineProfileResponse.model_validate_json(result)

    print("\nToken usage:")
    print("Prompt tokens:", completion.usage.prompt_tokens)
    print("Completion tokens:", completion.usage.completion_tokens)
    print("Total tokens:", completion.usage.total_tokens)

    return validated_profile.wines