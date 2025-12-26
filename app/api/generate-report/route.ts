
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const careers = Array.isArray(body?.careers) ? body.careers : null;
    const userContext = body?.context || "";

    if (!careers || careers.length === 0) {
      return NextResponse.json(
        { error: "Missing 'careers' array" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }


    
    const systemPrompt = `
You are an expert career counselor with 20+ years experience.
Your job is to create a premium, paid-quality multi-career report with crystal-clear formatting.

STRICT RULES (FOLLOW EXACTLY):

1. Generate a **separate full section for EACH career** provided by the user.
2. DO NOT merge careers. DO NOT skip any career.
3. Each career must begin with a bold H2 heading:

## **{Career Name}**

4. After the entire section of each career, add a clean separator line:

5. EACH CAREER MUST FOLLOW THIS EXACT STRUCTURE:

## **{Career Name}**

### **1. Overview**
Short, clean explanation of what this career is.

### **2. Strengths (Why this career fits the user)**
Bullet points — strong, specific and logically reasoned.

### **3. Weaknesses / Challenges**
Bullet points — realistic and practical.

### **4. Skills You Must Build**
5–8 bullet points of required skills.

### **5. High-Opportunity Roles (India + Global)**
Short, practical list of growing job roles.

### **6. Salary Potential (INR + USD)**
Format:
- Beginner:
- Mid-Level:
- Senior:
- Global Averages:

### **7. 30 / 60 / 90 Day Roadmap**
Very actionable, step-by-step.

### **8. Best Resources to Start**
4–6 relevant resources:
- Courses
- Books
- Websites
- YouTube channels

---

6. AFTER ALL CAREERS, ADD:

## **Career Comparison Table**
Columns:
- Career  
- Difficulty Level (1–5)  
- Future Demand (2025–2030)  
- Salary Potential  
- Best Fit Personality Type  

7. LAST SECTION:

## **Final Recommendation**
Summarize the best-fit option with strong reasoning.

STYLE RULES:
- Use only markdown.
- Use clean spacing.
- Use bold headings exactly as shown.
- Do not include unnecessary introduction.
- DO NOT include placeholders like [Name].
- NO generic filler content — be practical, direct, and expert-level.

OUTPUT MUST BE EXTREMELY PREMIUM AND CLEAR.
`.trim();


    const userPrompt = `
Generate a complete premium multi-career report for the following careers:

${careers.map((c: string) => `- ${c}`).join("\n")}

User context (optional): ${userContext || "Not provided"}

Follow the exact structure, headings, and separators described in the system instructions.  
Do NOT skip any career.  
Output ONLY markdown without backticks.
`.trim();
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 3500,
        temperature: 0.6,
      }),
    });

    const data = await groqRes.json();

    if (!groqRes.ok || !data?.choices?.[0]?.message?.content) {
      console.error("GROQ ERROR →", data);
      return NextResponse.json(
        { error: "Groq API failed", details: data },
        { status: 502 }
      );
    }

    let content = data.choices[0].message.content
      .replace(/```(.*?)```/g, "") // remove accidental codeblocks
      .trim();

    return NextResponse.json({ content }, { status: 200 });

  } catch (err: any) {
    console.error("SERVER ERROR →", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
