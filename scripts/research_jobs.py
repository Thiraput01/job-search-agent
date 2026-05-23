import os
import pathlib
from datetime import date

from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

TODAY = date.today().isoformat()

FORMAT_INSTRUCTIONS = """
Return ONLY the raw markdown content with no explanation, no preamble, and no code fences.

Use this exact format for each listing, separated by a blank line between entries:

---
title: 
company: 
location: 
type: 
experience: 
tags: []
source_url: 
posted_date: {today}
visa_support: 
relocation: 
---
Brief 2-3 sentence description of the role and company.

Rules:
- Aim for 5-10 listings
- Only include real listings with a valid source_url
- If none found, write exactly: No listings found on {today}
""".format(today=TODAY)

JOBS_DIR = pathlib.Path("jobs")
JOBS_DIR.mkdir(exist_ok=True)


def research(prompt: str) -> str:
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)],
        ),
    ]
    config = types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_level="MEDIUM"),
        tools=[types.Tool(googleSearch=types.GoogleSearch())],
    )
    result = ""
    for chunk in client.models.generate_content_stream(
        model="gemini-3.5-flash",
        contents=contents,
        config=config,
    ):
        if chunk.text:
            result += chunk.text
    return result.strip()


tasks = [
    {
        "file": JOBS_DIR / "job_posting_thai.md",
        "prompt": (
            f"Search the web for the latest junior-level job listings (0-3 years experience) "
            f"in Thailand for these roles: AI Engineer, ML Engineer, Data Scientist, Software Engineer. "
            f"Look on LinkedIn, Jobsdb, Glints, and any Thai job boards. Today is {TODAY}.\n\n"
            + FORMAT_INSTRUCTIONS
            + "\nDo NOT include visa_support or relocation fields for these local listings."
        ),
    },
    {
        "file": JOBS_DIR / "job_posting_overseas.md",
        "prompt": (
            f"Search the web for junior-level job listings (0-3 years experience) outside Thailand "
            f"for these roles: AI Engineer, ML Engineer, Data Scientist, Software Engineer, "
            f"that explicitly mention visa sponsorship OR relocation support for international candidates. "
            f"Today is {TODAY}.\n\n"
            + FORMAT_INSTRUCTIONS
            + "\nvisa_support and relocation must be true or false booleans based on what the listing states."
        ),
    },
    {
        "file": JOBS_DIR / "job_posting_remote.md",
        "prompt": (
            f"Search the web for fully remote junior-level job listings (0-3 years experience) "
            f"for these roles: AI Engineer, ML Engineer, Data Scientist, Software Engineer, "
            f"that are open to candidates based in Thailand or Southeast Asia. "
            f"Today is {TODAY}.\n\n"
            + FORMAT_INSTRUCTIONS
            + "\nDo NOT include visa_support or relocation fields for remote listings."
        ),
    },
]

for task in tasks:
    print(f"Researching: {task['file'].name} ...")
    content = research(task["prompt"])
    task["file"].write_text(content, encoding="utf-8")
    print(f"  Written to {task['file']}")

print("Done.")
